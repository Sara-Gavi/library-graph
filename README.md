# Library Graph - AWS Serverless Visualization

Aplicación web interactiva que visualiza relaciones entre libros y categorías mediante un grafo dinámico desplegado en AWS.

Interactive web application that visualizes relationships between books and categories through a dynamic graph deployed on AWS.

## Propósito / Purpose

- Practicar el desarrollo de una arquitectura serverless en AWS mediante una aplicación frontend en Vanilla JavaScript conectada a un backend con AWS Lambda y una base de datos en DynamoDB.

- Practice building a serverless architecture on AWS using JavaScript frontend connected to an AWS Lambda backend and a DynamoDB database.

Este proyecto forma parte de nuestra formación en AWS y tiene como objetivo comprender mejor:

- Despliegue de sitios estáticos en Amazon S3.
- Integración de frontend con funciones serverless.
- Uso de AWS Lambda como backend sin servidor.
- Modelado básico de datos tipo grafo.
- Uso de Amazon DynamoDB como base de datos NoSQL.
- Carga automatizada de datos en AWS mediante Python y boto3.
- Visualización interactiva con Cytoscape.js.

This project is part of our AWS training and aims to better understand:

- Static website deployment on Amazon S3.
- Frontend integration with serverless functions.
- Using AWS Lambda as a serverless backend.
- Basic graph-based data modeling.
- Using Amazon DynamoDB as a NoSQL database.
- Automated data loading into AWS using Python and boto3.
- Interactive visualization using Cytoscape.js.

## Arquitectura / Architecture

Usuario  
↓  
Amazon S3 (Frontend estático)  
↓  
AWS Lambda (Backend serverless)  
↓  
Amazon DynamoDB (Base de datos NoSQL)

User  
↓  
Amazon S3 (Static Frontend)  
↓  
AWS Lambda (Serverless Backend)  
↓  
Amazon DynamoDB (NoSQL Database)

## Flujo de Datos / Data Flow

1. La persona usuaria accede a la web alojada en Amazon S3.
2. El frontend realiza una petición HTTP a una función AWS Lambda.
3. Lambda consulta las tablas en DynamoDB.
4. Lambda devuelve un JSON con la estructura requerida por Cytoscape.js.
5. El frontend renderiza el grafo interactivo.

6. The user accesses the website hosted on Amazon S3.
7. The frontend sends an HTTP request to an AWS Lambda function.
8. Lambda reads the tables from DynamoDB.
9. Lambda returns a JSON formatted for Cytoscape.js.
10. The frontend renders the interactive graph.

## Preparación de Datos / Data Preparation

El dataset original en formato CSV se transforma mediante un script en Python utilizando la librería **boto3** (SDK oficial de AWS para Python).  
Este script automatiza la carga de los datos en las tablas de DynamoDB.

The original dataset in CSV format is transformed using a Python script with **boto3** (AWS official SDK for Python).  
This script automates the data insertion into DynamoDB tables.

## Tecnologías / Technologies

- **HTML5** - Estructura del sitio / Site structure
- **CSS3** - Diseño cálido estilo biblioteca / Warm library-style design
- **Vanilla JavaScript** - Lógica de la aplicación / Application logic
- **Cytoscape.js** - Visualización interactiva del grafo / Interactive graph visualization
- **Amazon S3** - Hosting estático / Static hosting
- **AWS Lambda** - Backend serverless
- **Amazon DynamoDB** - Base de datos NoSQL
- **Python + boto3** - Automatización de carga de datos

## Autoría / Authors

Proyecto grupal desarrollado por:

- Clara
- Irene
- Marianela
- Magdala
- Sara

## Notas

**Library Graph** no es una herramienta oficial de AWS.  
Es un proyecto académico diseñado para practicar arquitectura serverless y conceptos cloud de forma aplicada y colaborativa.

**Library Graph** is not an official AWS product.  
It is an academic project created to practice serverless architecture and cloud concepts in a collaborative and practical way.
