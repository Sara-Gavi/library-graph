# Library Graph - AWS Serverless Visualization

Aplicación web interactiva que visualiza relaciones entre libros y categorías mediante un grafo dinámico.

Interactive web application that visualizes relationships between books and categories through a dynamic graph.

---

## Propósito / Purpose

- Practicar el desarrollo de una arquitectura serverless en AWS mediante una aplicación frontend en HTML, CSS y JavaScript conectada a un backend con AWS Lambda.

- Practice building a serverless architecture on AWS using an HTML, CSS and JavaScript frontend connected to an AWS Lambda backend.

Este proyecto forma parte de nuestra formación en AWS y tiene como objetivo comprender mejor:

- Despliegue de sitios estáticos en Amazon S3.
- Integración de frontend con funciones serverless.
- Modelado básico de datos tipo grafo.
- Visualización interactiva con Cytoscape.js.

This project is part of our AWS training and aims to better understand:

- Static website deployment on Amazon S3.
- Frontend integration with serverless functions.
- Basic graph-based data modeling.
- Interactive visualization using Cytoscape.js.

---

## Arquitectura / Architecture

Usuario → Amazon S3 (Frontend estático) → AWS Lambda (Backend) → Base de datos

User → Amazon S3 (Static Frontend) → AWS Lambda (Backend) → Database

La aplicación sigue un modelo serverless donde no se gestionan servidores directamente.

The application follows a serverless model, meaning no servers are directly managed.

---

## Tecnologías / Technologies

- **HTML5** - Estructura del sitio
- **CSS3** - Diseño cálido estilo biblioteca
- **Vanilla JavaScript** - Lógica de la aplicación
- **Cytoscape.js** - Visualización del grafo
- **Amazon S3** - Hosting estático
- **AWS Lambda** - Backend serverless
- _(Según implementación)_ DynamoDB u otra base de datos AWS

---

## Autoría / Authors

Proyecto grupal desarrollado por:

- Clara
- Irene
- Marianela
- Magdala
- Sara

---

## Notas

**Library Graph** no es una herramienta oficial de AWS.  
Es un proyecto académico diseñado para practicar conceptos cloud de forma aplicada y colaborativa.

**Library Graph** is not an official AWS product.  
It is an academic project created to practice cloud concepts in a collaborative and practical way.
