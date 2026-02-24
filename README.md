# 📚 Library Graph - AWS Serverless Visualization

- [Spanish Version](#grafo-dinámico-desplegado-en-aws)
- [English Version](#dynamic-graph-deployed-on-aws)

# Grafo dinámico desplegado en AWS

Aplicación web interactiva que visualiza relaciones entre libros y categorías mediante un grafo dinámico desplegado en AWS.

## 🔗 Índice

* [Propósito](#propósito)
* [Arquitectura](#arquitectura)
* [Flujo de datos](#flujo-de-datos)
* [ETL](#etl)
* [Tecnologías](#tecnologías)
* [Equipo de desarrollo](#equipo-de-desarrollo)
* [Notas](#notas)


## Propósito

Este proyecto se desarrolla dentro de la formación AWS re/Start y tiene como objetivo principal desarrollar una aplicación frontend sobre libros y las conexiones que pueden unirlos (por ejemplo, categoría, autor, tema tratado). 

Los datos, extraídos de [OpenLibrary](https://openlibrary.org/developers/api), se cargan en DynamoDB. El frontend se construye utilizando Vanilla JavaScript, y se conecta al backend a través de AWS Lambda. 

Con este proyecto, se busca afianzar conocimientos sobre: 

- Despliegue de sitios web estáticos en Amazon S3.
- Integración de frontend con funciones serverless.
- Uso de AWS Lambda exponiendo un endpoint público mediante Function URLs.
- Modelado básico de datos tipo grafo.
- Uso de Amazon DynamoDB como base de datos NoSQL.
- Carga automatizada de datos en AWS mediante Python y boto3.
- Visualización interactiva con Cytoscape.js.

## 🏗️ Arquitectura 

Usuario

⬇️

Amazon S3 (Hosting del Frontend estático: HTML/JS/Cytoscape.js)

⬇️

AWS Lambda Function URL (Endpoint HTTP público con configuración CORS)

⬇️

Amazon DynamoDB (Datos NoSQL para nodos y relaciones)


## 🔄 Flujo de datos

1. El usuario accede a la web alojada en Amazon S3.
2. El cliente (Vainilla JS) realiza un fetch directo a la Lambda Function URL.
3. La función Lambda consulta las tablas en DynamoDB.
4. Lambda devuelve un JSON con la estructura requerida por Cytoscape.js.
5. El frontend renderiza el grafo dinámico con las relaciones obtenidas.

## ⚙️ ETL 

El dataset original en formato CSV se transforma mediante un script en Python utilizando la librería **boto3** (SDK oficial de AWS para Python) y Pandas.

El script `load_csv_to_dynamodb.py` carga los datos en las tablas de DynamoDB.

## 🛠️ Tecnologías

- **Amazon S3** - Hosting estático 
- **AWS Lambda** - Procesamiento de datos y endpoint HTTP (Function URL)
- **Amazon DynamoDB** - Almacenamiento no NoSQL
- **Python (boto3)** - Proceso ETL
- **HTML5** - Estructura del sitio 
- **CSS3** - Diseño cálido estilo biblioteca 
- **Vanilla JavaScript** - Lógica de la aplicación 
- **Cytoscape.js** - Visualización interactiva del grafo 

## 👥 Equipo de desarrollo

* [Clara B. García](https://github.com/cbueno82)
* [Irene de Hoz](https://github.com/IreneDHA)
* [Marianela Gómez](https://github.com/marianela-gomez)
* [Magdala Pérez](https://github.com/MPNimo)
* [Sara Gavilán](https://github.com/Sara-Gavi)

## Notas

**Library Graph** no es una herramienta oficial de AWS.  
Es un proyecto académico diseñado para practicar arquitectura serverless y conceptos cloud de forma aplicada y colaborativa.

# Dynamic graph deployed on AWS

Interactive web application that visualizes relationships between books and categories through a dynamic graph deployed on AWS.

## 🔗 Table of contents

* [Purpuse](#purpose)
* [Architecture](#architecture)
* [Data flow](#data-flow)
* [ETL](#etl-1)
* [Technologies](#technologies)
* [Development Team](#development-team)
* [Notes](#notes)

## Purpose

This project was developed within the AWS re/Start training program. Its main objective is to build a frontend application centered on books and the connections between them (e.g., category, author, subject).

Data extracted from OpenLibrary is loaded into DynamoDB. The frontend is built using Vanilla JavaScript and connects to the backend through AWS Lambda.

Through this project, the team aims to strengthen knowledge in:

- Deploying static websites on Amazon S3.
- Integrating frontends with serverless functions.
- Using AWS Lambda by exposing a public endpoint via Function URLs.
- Basic graph-based data modeling.
- Using Amazon DynamoDB as a NoSQL database.
- Automated data loading into AWS using Python and boto3.
- Interactive visualization with Cytoscape.js.

## Architecture

User

⬇️

Amazon S3 (Static Frontend Hosting: HTML/JS/Cytoscape.js)

⬇️

AWS Lambda Function URL (Public HTTP Endpoint with CORS configuration)

⬇️

Amazon DynamoDB (NoSQL data for nodes and relationships)

## Data Flow

1. The user accesses the web application hosted on Amazon S3.
2. The client (Vanilla JS) performs a direct fetch to the Lambda Function URL.
3. The Lambda function queries the DynamoDB tables.
4. Lambda returns a JSON object with the structure required by Cytoscape.js.
5. The frontend renders the dynamic graph with the retrieved relationships.

## ETL

The original dataset in CSV format is transformed using a Python script with the Pandas library and boto3 (the official AWS SDK for Python).

The script `load_csv_to_dynamodb.py` automates the data loading process into the DynamoDB tables.

## Technologies

- **Amazon S3** - Static hosting.
- **AWS Lambda** - Data processing and HTTP endpoint (Function URL).
- **Amazon DynamoDB** - NoSQL data storage.
- **Python (boto3)** - ETL process.
- **HTML5** - Site structure.
- **CSS3** - Warm library-style design.
- **Vanilla JavaScript** - Application logic.
- **Cytoscape.js** - Interactive graph visualization.

## Development Team

* [Clara B. García](https://github.com/cbueno82)
* [Irene de Hoz](https://github.com/IreneDHA)
* [Marianela Gómez](https://github.com/marianela-gomez)
* [Magdala Pérez](https://github.com/MPNimo)
* [Sara Gavilán](https://github.com/Sara-Gavi)

## Notes

**Library Graph** is not an official AWS product.  
It is an academic project designed to practice serverless architecture and cloud concepts in an applied and collaborative way.
