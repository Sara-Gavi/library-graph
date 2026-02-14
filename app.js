/* =========================================================
   Library Graph - Código del proyecto (JavaScript)
   Este archivo:
   - Carga datos mock (nodos y relaciones)
   - Crea el grafo con Cytoscape dentro de #graphArea
   - Gestiona búsqueda, selección de nodos y botones
========================================================= */

/* Referencias a elementos HTML */

const inputBusqueda = document.getElementById("searchInput");
const botonLimpiar = document.getElementById("btnClear");
const botonEncajar = document.getElementById("btnFit");
const botonReset = document.getElementById("btnReset");

const panelDetalles = document.getElementById("detailsContent");
const graphArea = document.getElementById("graphArea");
const placeholder = document.getElementById("placeholderMessage");
const statusBadge = document.getElementById("statusBadge");

/* Instancia del grafo (Cytoscape la crea cuando inicializamos) */
let cy = null;

/* Datos mock del grafo
   Formato Cytoscape:
   - nodes: { data: { id, label, type } }
   - edges: { data: { id, source, target, type } } */

const MOCK_GRAPH = {
  nodes: [
    { data: { id: "book:dune", label: "Dune", type: "Libro" } },
    { data: { id: "book:1984", label: "1984", type: "Libro" } },
    { data: { id: "book:hp1", label: "Harry Potter", type: "Libro" } },
    { data: { id: "book:pride", label: "Orgullo y prejuicio", type: "Libro" } },

    { data: { id: "cat:scifi", label: "Ciencia ficción", type: "Categoria" } },
    { data: { id: "cat:distopia", label: "Distopía", type: "Categoria" } },
    { data: { id: "cat:fantasia", label: "Fantasía", type: "Categoria" } },
    { data: { id: "cat:clasico", label: "Clásico", type: "Categoria" } },
    { data: { id: "cat:romance", label: "Romance", type: "Categoria" } },
  ],
  edges: [
    {
      data: {
        id: "e1",
        source: "book:dune",
        target: "cat:scifi",
        type: "PERTENECE_A",
      },
    },
    {
      data: {
        id: "e2",
        source: "book:1984",
        target: "cat:distopia",
        type: "PERTENECE_A",
      },
    },
    {
      data: {
        id: "e3",
        source: "book:hp1",
        target: "cat:fantasia",
        type: "PERTENECE_A",
      },
    },
    {
      data: {
        id: "e4",
        source: "book:pride",
        target: "cat:clasico",
        type: "PERTENECE_A",
      },
    },
    {
      data: {
        id: "e5",
        source: "book:pride",
        target: "cat:romance",
        type: "RELACIONADO",
      },
    },
  ],
};

/*Función principal: carga y muestra el grafo */

function loadGraph() {
  const elements = MOCK_GRAPH.nodes.concat(MOCK_GRAPH.edges);

  /* Se oculta el placeholder */
  if (placeholder) placeholder.style.display = "none";
  graphArea.classList.add("graph-ready");

  /* texto del estado simple */
  if (statusBadge) statusBadge.textContent = "Modo: Mock";

  initCytoscape(elements);
  setDefaultDetails();
}

/*Detalles por defecto en el panel lateral*/

function setDefaultDetails() {
  panelDetalles.innerHTML =
    '<p class="text-placeholder">Haz click en un nodo para ver información.</p>';
}

/* =========================================================
   BLOQUE DE CYTOSCAPE (Librería)
   Se usa Cytoscape para crear el grafo.
   Este bloque depende de la librería Cytoscape:
   - cytoscape({ ... })
   - estilos con selector "node", "edge"
   - layout, eventos (cy.on)
========================================================= */

function initCytoscape(elements) {
  cy = cytoscape({
    container: graphArea,
    elements: elements,

    layout: {
      name: "cose",
      animate: true,
      fit: true,
      padding: 40,
    },

    style: [
      {
        selector: "node",
        style: {
          label: "data(label)",
          "font-size": 12,
          "text-wrap": "wrap",
          "text-max-width": 90,
          "text-valign": "center",
          "text-halign": "center",

          width: "label",
          height: "label",
          padding: "12px",

          "background-color": "#FFFFFF",
          "border-width": 2,
          "border-color": "#E07A5F",
          shape: "round-rectangle",
          color: "#3D405B",
        },
      },
      {
        selector: 'node[type = "Categoria"]',
        style: {
          shape: "ellipse",
          "background-color": "#F2CC8F",
          "border-color": "#C79A54",
        },
      },
      {
        selector: "edge",
        style: {
          "curve-style": "bezier",
          "target-arrow-shape": "triangle",
          "line-color": "#A8DADC",
          "target-arrow-color": "#A8DADC",
          width: 2,
          label: "data(type)",
          "font-size": 10,
          color: "#818181",
          "text-background-color": "#FFFFFF",
          "text-background-opacity": 0.8,
          "text-background-padding": 2,
        },
      },
      {
        selector: ".faded",
        style: { opacity: 0.2 },
      },
      {
        selector: ".highlight",
        style: { "border-width": 4 },
      },
    ],
  });

  registerNodeClick();
}

/* Click en un nodo: resaltar relaciones y mostrar detalles */

function registerNodeClick() {
  cy.on("tap", "node", function (evt) {
    const node = evt.target;
    const data = node.data();

    const label = data.label;
    const type = data.type;

    const neighbors = node
      .connectedEdges()
      .connectedNodes()
      .filter(function (n) {
        return n.id() !== node.id();
      });

    fadeAll();
    showSelection(node, neighbors);

    renderDetails(label, type, neighbors);
  });
}

/* Funciones de apoyo para selección (resaltado) */

function fadeAll() {
  cy.elements().addClass("faded");
}

function showSelection(node, neighbors) {
  node.removeClass("faded");
  node.connectedEdges().removeClass("faded");
  neighbors.removeClass("faded");
}

/* Render de detalles en el panel lateral */

function renderDetails(label, type, neighbors) {
  let html = "";
  html += '<h3 style="margin-bottom:8px;">' + label + "</h3>";
  html += '<p style="margin-bottom:10px;">' + type + "</p>";
  html += "<p><strong>Relacionado con:</strong></p>";
  html += '<ul style="margin-top:6px; padding-left:18px;">';

  neighbors.forEach(function (n) {
    html += "<li>" + n.data("label") + "</li>";
  });

  html += "</ul>";

  panelDetalles.innerHTML = html;
}

/* Búsqueda: resalta nodos que coinciden con el texto */

function applySearch(query) {
  if (!cy) return;

  const q = query.trim().toLowerCase();

  if (q === "") {
    cy.elements().removeClass("faded highlight");
    return;
  }

  cy.elements().addClass("faded");

  const matches = cy.nodes().filter(function (n) {
    return n.data("label").toLowerCase().includes(q);
  });

  matches.removeClass("faded");
  matches.addClass("highlight");

  if (matches.length > 0) {
    cy.center(matches[0]);
  }
}

/* Eventos de la interfaz (botones e input)*/

botonLimpiar.addEventListener("click", function () {
  inputBusqueda.value = "";
  applySearch("");
  setDefaultDetails();
});

inputBusqueda.addEventListener("input", function () {
  applySearch(this.value);
});

botonEncajar.addEventListener("click", function () {
  if (cy) cy.fit(undefined, 40);
});

botonReset.addEventListener("click", function () {
  if (!cy) return;

  cy.zoom(1);
  cy.center();
  cy.elements().removeClass("faded highlight");

  inputBusqueda.value = "";
  setDefaultDetails();
});

/* Inicio de la aplicación */

loadGraph();
