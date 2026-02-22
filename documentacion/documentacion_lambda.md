# Guía para DynamoDB + Lambda + Function URL + Frontend

## Objetivo

Conseguir este flujo, **sin API Gateway**:

**Frontend (Live Server / GitHub Pages) → Lambda Function URL (GET) → Lambda lee DynamoDB → devuelve JSON `{nodes, edges}` → Cytoscape pinta.**

Además, en el frontend limitamos la visualización a **100 libros** para no saturar el navegador (aunque el backend devuelva más).

---

## 0) Antes de empezar (muy importante)

- Abrimos el lab en AWS re/Start y entramos a la **AWS Console**.
- Arriba a la derecha, fijamos la **región: `us-west-2`** (muy importante para que tablas y lambda estén en la misma región).
- Trabajamos siempre con el rol **LabRole** (o el rol que nos da el lab).

---

## 1) DynamoDB: crear tablas y comprobar datos

### 1.1 Crear (o verificar) las tablas

En AWS Console:

1. Buscamos **DynamoDB**  
2. Vamos a **Tables**  
3. Creamos o confirmamos que existen estas 3 tablas (**nombres EXACTOS**):
   - `Books`
   - `Categories`
   - `Edges`

### 1.2 Keys recomendadas

Para que todo funcione fácil:

#### Tabla `Books`
- **Partition key:** `bookId` (String)

Ejemplo de item (en DynamoDB “normal”, no el formato con `S/N`):

```json
{
  "bookId": "someone-like-you-18-stories-roald-dahl-1950",
  "title": "Someone Like You [18 stories]",
  "author": "Roald Dahl",
  "decade": 1950
}
```

#### Tabla `Categories`
- **Partition key:** `catId` (String)

Ejemplo:

```json
{
  "catId": "historical-fiction",
  "name": "Historical fiction"
}
```

#### Tabla `Edges`
- **Partition key:** `edgeId` (String)

Ejemplo:

```json
{
  "edgeId": "the-internet-for-dummies-john-r-levine-1990#non-fiction",
  "source": "book:the-internet-for-dummies-john-r-levine-1990",
  "target": "cat:non-fiction",
  "type": "PERTENECE_A"
}
```

**Importante:** los edges ya guardan `source` y `target` con prefijos `book:` y `cat:`.  
Esto es perfecto para Cytoscape.

---

## 2) IAM (permisos): asegurar que Lambda puede leer DynamoDB

En AWS Console:

1. Vamos a **IAM → Roles**
2. Buscamos el rol que usa la Lambda (normalmente `LabRole`)
3. Añadimos permisos:

- `AmazonDynamoDBReadOnlyAccess` (mínimo para leer con `Scan`)

Si no tenemos permisos, nos saldrá error: `AccessDeniedException`.

---

## 3) Lambda: crear la función GET que devuelve el grafo real

### 3.1 Crear la Lambda

En AWS Console:

1. Buscamos **Lambda**
2. **Create function**
3. Elegimos: **Author from scratch**
4. Rellenamos:
   - **Function name:** `library-graph-get`
   - **Runtime:** `nodejs24.x`
   - **Architecture:** `x86_64`
   - **Permissions:** *Use an existing role* → elegimos `LabRole`
5. **Create function**

### 3.2 Pegar el código correcto (Node.js) en `index.mjs`

En la Lambda:

- Pestaña **Code**
- Abrimos `index.mjs`
- Pegamos este código (**IMPORTANTE: NO ponemos CORS aquí**):

```js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const REGION = "us-west-2";

const BOOKS_TABLE = "Books";
const CATEGORIES_TABLE = "Categories";
const EDGES_TABLE = "Edges";

const client = new DynamoDBClient({ region: REGION });
const ddb = DynamoDBDocumentClient.from(client);

async function scanAll(TableName) {
  let items = [];
  let ExclusiveStartKey = undefined;

  do {
    const resp = await ddb.send(new ScanCommand({ TableName, ExclusiveStartKey }));
    items = items.concat(resp.Items ?? []);
    ExclusiveStartKey = resp.LastEvaluatedKey;
  } while (ExclusiveStartKey);

  return items;
}

export const handler = async (event) => {
  const method = event?.requestContext?.http?.method || "GET";

  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: "{}",
    };
  }

  if (method !== "GET") {
    return {
      statusCode: 405,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Usa GET para obtener el grafo" }),
    };
  }

  try {
    const [books, categories, edges] = await Promise.all([
      scanAll(BOOKS_TABLE),
      scanAll(CATEGORIES_TABLE),
      scanAll(EDGES_TABLE),
    ]);

    const bookNodes = books
      .filter((b) => b.bookId)
      .map((b) => ({
        data: {
          id: `book:${b.bookId}`,
          label: b.title ?? b.bookId,
          type: "Libro",
          author: b.author,
          decade: b.decade,
          synopsis: b.synopsis,
          openlibrary_work_key: b.openlibrary_work_key,
        },
      }));

    const categoryNodes = categories
      .filter((c) => c.catId)
      .map((c) => ({
        data: {
          id: `cat:${c.catId}`,
          label: c.name ?? c.catId,
          type: "Categoria",
        },
      }));

    const cyEdges = edges
      .filter((e) => e.edgeId && e.source && e.target)
      .map((e) => ({
        data: {
          id: e.edgeId,
          source: e.source,
          target: e.target,
          type: e.type ?? "PERTENECE_A",
        },
      }));

    const graph = { nodes: [...bookNodes, ...categoryNodes], edges: cyEdges };

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(graph),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: String(err) }),
    };
  }
};
```

Pulsamos **Deploy**.

### 3.3 Ajustar Timeout y Memory (para evitar timeouts)

En la Lambda:

1. **Configuration**
2. **General configuration**
3. **Edit**
4. Ponemos:
   - **Timeout:** 10 seconds
   - **Memory (RAM):** 256 MB
5. **Save**

No tocamos **Ephemeral storage**.

### 3.4 Test en Lambda (para comprobar DynamoDB)

- Pestaña **Test**
- **Create new test event**
- **Name:** `get-graph`
- Pegamos:

```json
{
  "requestContext": {
    "http": { "method": "GET" }
  }
}
```

- **Save**
- Pulsamos **Test**

Esperamos:

- **Status:** Succeeded
- `statusCode: 200`
- `body` contiene `{"nodes":[...],"edges":[...]}`

Si sale:

- `AccessDeniedException` → faltan permisos en `LabRole`
- `ResourceNotFoundException` → nombres de tabla incorrectos o región incorrecta
- `Timeout` → subir timeout/memory

---

## 4) Function URL: crear la URL pública (sin API Gateway) + CORS correcto

En la Lambda:

1. **Configuration**
2. Menú lateral: **Function URL**
3. Click: **Create function URL**

### 4.1 Authorization type
- `NONE`

### 4.2 Invoke mode
- `BUFFERED`

### 4.3 CORS
Activamos CORS y rellenamos:

- **Allow origin:** `*`
- **Allow methods:** marcamos `GET` (y `OPTIONS` si aparece)
- **Allow headers:** `*`
- **Expose headers:** (vacío)
- **Max age:** (vacío)
- **Allow credentials:** desactivado

Guardamos.

Nos aparece una URL tipo:

```txt
https://xxxxx.lambda-url.us-west-2.on.aws/
```

### 4.4 Probar la Function URL

- Copiamos la URL
- La abrimos en el navegador
- Debe verse el JSON `{nodes, edges}`

**Regla importante:**
- **No ponemos CORS en el código de Lambda.**
- CORS **solo** en Function URL, si no aparece el error:

```txt
Access-Control-Allow-Origin contains multiple values '*, *'
```

---

## 5) Frontend: conectar con la URL nueva (y limitar a 100 libros)

El frontend lo dejamos preparado. Mañana solo cambiamos:

- `USE_AWS = true`
- `FUNCTION_URL = "URL nueva"`

### 5.1 Límite de 100 libros (frontend)

Dentro de `loadGraph()` (en el bloque AWS):

1. Cogemos `graph.nodes` con `type === "Libro"`
2. Nos quedamos con los **primeros 100**
3. Filtramos `edges` cuyo `source` esté en esos 100
4. Filtramos categorías conectadas
5. Pintamos el grafo reducido

Esto evita que Cytoscape y el layout se saturen el navegador.

---

## 6) Checklist rápido (si algo falla)

### Si el Test de Lambda no devuelve nodes/edges
- Revisamos región `us-west-2`
- Revisamos nombres exactos de tablas: `Books`, `Categories`, `Edges`
- Revisamos `LabRole` con `AmazonDynamoDBReadOnlyAccess`
- Subimos **Timeout** a 10s y **Memory** a 256MB

### Si Function URL da error CORS
- Confirmamos que **no** hemos añadido headers `Access-Control-Allow-Origin` en Lambda
- CORS **solo** en la configuración de Function URL

### Si frontend se queda en Mock
- Abrimos DevTools → Consola y miramos el error
- Comprobamos que `FUNCTION_URL` es la nueva
- Probamos abrir la Function URL en el navegador y ver JSON
