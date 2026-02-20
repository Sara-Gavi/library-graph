#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import re
import unicodedata
from typing import Optional

import boto3
import pandas as pd


def slugify_stable(text: str, max_len: int = 200) -> str:
    """
    Slug estable:
    - minúsculas
    - sin tildes/diacríticos
    - espacios/puntuación -> guiones
    - colapsa guiones repetidos
    """
    if text is None:
        text = ""
    text = str(text).strip().lower()

    # Quitar diacríticos
    text = unicodedata.normalize("NFKD", text)
    text = "".join(ch for ch in text if not unicodedata.combining(ch))

    # Convertir separadores/puntuación a guión
    text = re.sub(r"[^\w]+", "-", text, flags=re.UNICODE)  # \w incluye letras/números/_
    text = text.replace("_", "-")

    # Limpiar guiones
    text = re.sub(r"-{2,}", "-", text).strip("-")

    if not text:
        text = "unknown"

    return text[:max_len]


def to_int_or_none(x) -> Optional[int]:
    try:
        if pd.isna(x):
            return None
    except Exception:
        pass

    if x is None:
        return None

    if isinstance(x, int):
        return x

    s = str(x).strip()
    if not s:
        return None

    if s.isdigit():
        return int(s)

    # por si viene "1975.0"
    try:
        f = float(s)
        return int(f)
    except Exception:
        return None


def year_to_decade(year: Optional[int]) -> Optional[int]:
    if year is None:
        return None
    return (year // 10) * 10


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    """
    Normaliza columnas a minúsculas y garantiza:
    - title, genre obligatorias
    - author/synopsis opcionales
    - decade preferida; si solo hay year -> decade
    """
    df = df.copy()
    df.columns = [c.strip().lower() for c in df.columns]

    if "title" not in df.columns:
        raise ValueError("Falta la columna obligatoria 'title' en el CSV.")
    if "genre" not in df.columns:
        raise ValueError("Falta la columna obligatoria 'genre' en el CSV.")

    if "author" not in df.columns:
        df["author"] = None
    if "synopsis" not in df.columns:
        df["synopsis"] = None

    if "decade" not in df.columns:
        if "year" in df.columns:
            df["decade"] = df["year"].apply(lambda v: year_to_decade(to_int_or_none(v)))
        else:
            df["decade"] = None
    else:
        df["decade"] = df["decade"].apply(lambda v: to_int_or_none(v))

    return df


def make_book_id(title: str, author: Optional[str], decade: Optional[int]) -> str:
    """
    bookId estable.
    Para reducir colisiones uso: title + author + decade.
    """
    t = slugify_stable(title)
    a = slugify_stable(author or "unknown")
    d = str(decade) if decade is not None else "unknown"
    return slugify_stable(f"{t}-{a}-{d}", max_len=220)


def clean_str(x) -> Optional[str]:
    if x is None:
        return None
    if isinstance(x, float) and pd.isna(x):
        return None
    s = str(x).strip()
    return s if s else None


def load_to_dynamodb(
    df: pd.DataFrame,
    table_books: str,
    table_categories: str,
    table_edges: str,
    region: str,
    endpoint_url: Optional[str] = None,
) -> dict:
    session = boto3.Session(region_name=region)
    dynamodb = session.resource("dynamodb", endpoint_url=endpoint_url)

    books_t = dynamodb.Table(table_books)
    cats_t = dynamodb.Table(table_categories)
    edges_t = dynamodb.Table(table_edges)

    seen_books = set()
    seen_cats = set()
    seen_edges = set()

    with books_t.batch_writer(overwrite_by_pkeys=["bookId"]) as bw_books, \
         cats_t.batch_writer(overwrite_by_pkeys=["catId"]) as bw_cats, \
         edges_t.batch_writer(overwrite_by_pkeys=["edgeId"]) as bw_edges:

        for _, row in df.iterrows():
            title = clean_str(row.get("title"))
            if not title:
                continue

            author = clean_str(row.get("author")) or "Unknown"
            genre = clean_str(row.get("genre")) or "Unknown"
            synopsis = clean_str(row.get("synopsis"))

            decade_int = to_int_or_none(row.get("decade"))

            book_id = make_book_id(title, author, decade_int)
            cat_id = slugify_stable(genre)

            # --- Books ---
            if book_id not in seen_books:
                item_book = {
                    "bookId": book_id,
                    "title": title,
                    "author": author,
                }
                if decade_int is not None:
                    item_book["decade"] = decade_int
                if synopsis:
                    item_book["synopsis"] = synopsis

                # extra opcional
                if "openlibrary_work_key" in df.columns:
                    owk = clean_str(row.get("openlibrary_work_key"))
                    if owk:
                        item_book["openlibrary_work_key"] = owk

                bw_books.put_item(Item=item_book)
                seen_books.add(book_id)

            # --- Categories ---
            if cat_id not in seen_cats:
                bw_cats.put_item(Item={"catId": cat_id, "name": genre})
                seen_cats.add(cat_id)

            # --- Edges ---
            edge_id = f"{book_id}#{cat_id}"
            if edge_id not in seen_edges:
                bw_edges.put_item(Item={
                    "edgeId": edge_id,
                    "source": f"book:{book_id}",
                    "target": f"cat:{cat_id}",
                    "type": "PERTENECE_A",
                })
                seen_edges.add(edge_id)

    return {
        "books_written": len(seen_books),
        "cats_written": len(seen_cats),
        "edges_written": len(seen_edges),
    }


def main():
    ap = argparse.ArgumentParser(description="Load CSV -> DynamoDB (Books, Categories, Edges)")
    ap.add_argument("--csv", required=True, help="Ruta al CSV (e.g. books_clean.csv)")
    ap.add_argument("--region", default="us-west-2", help="Región AWS (default: us-west-2)")
    ap.add_argument("--endpoint-url", default=None, help="Endpoint DynamoDB (para localstack/dynamo local)")

    ap.add_argument("--books-table", default="Books")
    ap.add_argument("--categories-table", default="Categories")
    ap.add_argument("--edges-table", default="Edges")

    args = ap.parse_args()

    df = pd.read_csv(args.csv, encoding="utf-8")
    df = normalize_columns(df)

    stats = load_to_dynamodb(
        df=df,
        table_books=args.books_table,
        table_categories=args.categories_table,
        table_edges=args.edges_table,
        region=args.region,
        endpoint_url=args.endpoint_url,
    )

    print("Carga completada:")
    print(stats)


if __name__ == "__main__":
    main()
