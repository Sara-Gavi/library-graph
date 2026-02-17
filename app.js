/* 
   Library Graph - JavaScript
   - Controla la landing (mostrar/ocultar)
   - Inicializa el grafo con Cytoscape cuando empieza la app
   - Gestiona búsqueda, selección de nodos y botones
 */

/*Elementos de la landing y app */

const startButton = document.querySelector(".js-start");
const landingSection = document.querySelector(".landing");
const appRoot = document.getElementById("appRoot");

/* Título clicable para volver a la landing */
const brandTitle = document.getElementById("brandTitle");

/* Referencias a la interfaz de la app */

const inputBusqueda = document.getElementById("searchInput");
const botonLimpiar = document.getElementById("btnClear");
const botonVerCompleto = document.getElementById("btnFit");
const botonReset = document.getElementById("btnReset");

const panelDetalles = document.getElementById("detailsContent");
const graphArea = document.getElementById("graphArea");
const placeholder = document.getElementById("placeholderMessage");
const statusBadge = document.getElementById("statusBadge");

/* Instancia de Cytoscape (se crea al iniciar el grafo) */
let cy = null;

/* 
   Datos mock del grafo
 */

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

/* configuración para probar AWS (Lambda Function URL) */
// Poner en false cuando termine el lab o volver al mock
const USE_AWS = false;

// URL pública de Lambda (Function URL)
const FUNCTION_URL =
  "https://hhcl7s3sf3rpkbxasogkbo2l5u0hwwdt.lambda-url.us-west-2.on.aws/";

/* Navegación: landing - app*/

function startApp() {
  if (landingSection) landingSection.style.display = "none";
  if (appRoot) appRoot.hidden = false;

  loadGraph();
}

function goToLanding() {
  if (appRoot) appRoot.hidden = true;
  if (landingSection) landingSection.style.display = "block";

  /* Si el grafo existe, lo destruimos para evitar errores al volver a entrar */
  if (cy) {
    cy.destroy();
    cy = null;
  }

  /* Dejamos el input limpio por si se vuelve a entrar */
  if (inputBusqueda) inputBusqueda.value = "";

  /* Volvemos a mostrar el placeholder visual  */
  if (placeholder) placeholder.style.display = "block";
  if (graphArea) graphArea.classList.remove("graph-ready");

  /* Restauramos el panel de detalles */
  setDefaultDetails();
}

/* Eventos de navegación */
if (startButton) startButton.addEventListener("click", startApp);
if (brandTitle) brandTitle.addEventListener("click", goToLanding);

/* Carga del grafo (mock) o de AWS Lamda*/

async function loadGraph() {
  if (placeholder) placeholder.style.display = "none";
  if (graphArea) graphArea.classList.add("graph-ready");

  if (USE_AWS) {
    try {
      const res = await fetch(FUNCTION_URL);
      if (!res.ok) throw new Error("HTTP " + res.status);

      const graph = await res.json();

      if (statusBadge) statusBadge.textContent = "Modo: AWS (Lambda URL)";

      const elements = graph.nodes.concat(graph.edges);
      initCytoscape(elements);
      setDefaultDetails();
      return;
    } catch (err) {
      console.error("Error AWS, usando mock:", err);
    }
  }

  // Fallback o modo normal
  const elements = MOCK_GRAPH.nodes.concat(MOCK_GRAPH.edges);
  if (statusBadge) statusBadge.textContent = "Modo: Mock";
  initCytoscape(elements);
  setDefaultDetails();
}

function setDefaultDetails() {
  if (!panelDetalles) return;
  panelDetalles.innerHTML =
    '<p class="text-placeholder">Haz click en un nodo para ver información.</p>';
}

/* Cytoscape: creación del grafo, estilos y eventos */

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

    cy.elements().addClass("faded");

    node.removeClass("faded");
    node.connectedEdges().removeClass("faded");
    neighbors.removeClass("faded");

    renderDetails(label, type, neighbors);
  });
}

function renderDetails(label, type, neighbors) {
  if (!panelDetalles) return;

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

/* Búsqueda*/

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

/* 
   Eventos de botones e input
 */

if (botonLimpiar) {
  botonLimpiar.addEventListener("click", function () {
    inputBusqueda.value = "";
    applySearch("");
    setDefaultDetails();
  });
}

if (inputBusqueda) {
  inputBusqueda.addEventListener("input", function () {
    applySearch(this.value);
  });
}

if (botonVerCompleto) {
  botonVerCompleto.addEventListener("click", function () {
    if (cy) cy.fit(undefined, 40);
  });
}

if (botonReset) {
  botonReset.addEventListener("click", function () {
    if (!cy) return;

    cy.zoom(1);
    cy.center();
    cy.elements().removeClass("faded highlight");

    inputBusqueda.value = "";
    setDefaultDetails();
  });
}
