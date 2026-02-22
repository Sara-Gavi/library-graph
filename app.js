/* 
   Library Graph - JavaScript
   - Controla la landing (mostrar/ocultar)
   - Inicializa el grafo con Cytoscape cuando empieza la app
   - Gestiona búsqueda, selección de nodos y botones
 */

/* Elementos de la landing y app */

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
    // Libros
    { data: { id: "book:dune", label: "Dune", type: "Libro" } },
    { data: { id: "book:1984", label: "1984", type: "Libro" } },
    {
      data: {
        id: "book:hp1",
        label: "Harry Potter y la piedra filosofal",
        type: "Libro",
      },
    },
    {
      data: {
        id: "book:pride",
        label: "Orgullo y prejuicio",
        type: "Libro",
      },
    },
    { data: { id: "book:ender", label: "El juego de Ender", type: "Libro" } },
    { data: { id: "book:fundacion", label: "Fundación", type: "Libro" } },
    { data: { id: "book:neuromante", label: "Neuromante", type: "Libro" } },
    {
      data: {
        id: "book:holmes-estudio",
        label: "Estudio en escarlata",
        type: "Libro",
      },
    },
    {
      data: {
        id: "book:orient-express",
        label: "Asesinato en el Orient Express",
        type: "Libro",
      },
    },
    {
      data: {
        id: "book:nombre-rosa",
        label: "El nombre de la rosa",
        type: "Libro",
      },
    },
    {
      data: {
        id: "book:fahrenheit451",
        label: "Fahrenheit 451",
        type: "Libro",
      },
    },
    {
      data: {
        id: "book:blade-runner",
        label: "¿Sueñan los androides con ovejas eléctricas?",
        type: "Libro",
      },
    },
    {
      data: {
        id: "book:lotr1",
        label: "El señor de los anillos: La comunidad del anillo",
        type: "Libro",
      },
    },
    {
      data: {
        id: "book:hobbit",
        label: "El hobbit",
        type: "Libro",
      },
    },
    {
      data: {
        id: "book:dragon-tatuaje",
        label: "Los hombres que no amaban a las mujeres",
        type: "Libro",
      },
    },
    {
      data: {
        id: "book:da-vinci",
        label: "El código Da Vinci",
        type: "Libro",
      },
    },
    {
      data: {
        id: "book:sherlock-baskerville",
        label: "El sabueso de los Baskerville",
        type: "Libro",
      },
    },

    // Categorías
    { data: { id: "cat:scifi", label: "Ciencia ficción", type: "Categoria" } },
    { data: { id: "cat:distopia", label: "Distopía", type: "Categoria" } },
    { data: { id: "cat:fantasia", label: "Fantasía", type: "Categoria" } },
    { data: { id: "cat:clasico", label: "Clásico", type: "Categoria" } },
    { data: { id: "cat:romance", label: "Romance", type: "Categoria" } },
    { data: { id: "cat:misterio", label: "Misterio", type: "Categoria" } },
    { data: { id: "cat:crimen", label: "Crimen", type: "Categoria" } },
  ],
  edges: [
    // Libros de ciencia ficción
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
        id: "e6",
        source: "book:1984",
        target: "cat:scifi",
        type: "RELACIONADO",
      },
    },
    {
      data: {
        id: "e7",
        source: "book:ender",
        target: "cat:scifi",
        type: "PERTENECE_A",
      },
    },
    {
      data: {
        id: "e8",
        source: "book:fundacion",
        target: "cat:scifi",
        type: "PERTENECE_A",
      },
    },
    {
      data: {
        id: "e9",
        source: "book:neuromante",
        target: "cat:scifi",
        type: "PERTENECE_A",
      },
    },
    {
      data: {
        id: "e15",
        source: "book:fahrenheit451",
        target: "cat:distopia",
        type: "PERTENECE_A",
      },
    },
    {
      data: {
        id: "e16",
        source: "book:fahrenheit451",
        target: "cat:scifi",
        type: "RELACIONADO",
      },
    },
    {
      data: {
        id: "e17",
        source: "book:blade-runner",
        target: "cat:scifi",
        type: "PERTENECE_A",
      },
    },

    // Fantasía
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
        id: "e18",
        source: "book:lotr1",
        target: "cat:fantasia",
        type: "PERTENECE_A",
      },
    },
    {
      data: {
        id: "e19",
        source: "book:lotr1",
        target: "cat:clasico",
        type: "RELACIONADO",
      },
    },
    {
      data: {
        id: "e20",
        source: "book:hobbit",
        target: "cat:fantasia",
        type: "PERTENECE_A",
      },
    },

    // Clásicos y romance
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
    {
      data: {
        id: "e10",
        source: "book:nombre-rosa",
        target: "cat:clasico",
        type: "RELACIONADO",
      },
    },

    // Misterio / crimen
    {
      data: {
        id: "e11",
        source: "book:holmes-estudio",
        target: "cat:misterio",
        type: "PERTENECE_A",
      },
    },
    {
      data: {
        id: "e12",
        source: "book:orient-express",
        target: "cat:misterio",
        type: "PERTENECE_A",
      },
    },
    {
      data: {
        id: "e13",
        source: "book:orient-express",
        target: "cat:crimen",
        type: "RELACIONADO",
      },
    },
    {
      data: {
        id: "e14",
        source: "book:nombre-rosa",
        target: "cat:misterio",
        type: "PERTENECE_A",
      },
    },
    {
      data: {
        id: "e21",
        source: "book:dragon-tatuaje",
        target: "cat:crimen",
        type: "PERTENECE_A",
      },
    },
    {
      data: {
        id: "e22",
        source: "book:dragon-tatuaje",
        target: "cat:misterio",
        type: "RELACIONADO",
      },
    },
    {
      data: {
        id: "e23",
        source: "book:da-vinci",
        target: "cat:misterio",
        type: "PERTENECE_A",
      },
    },
    {
      data: {
        id: "e24",
        source: "book:da-vinci",
        target: "cat:crimen",
        type: "RELACIONADO",
      },
    },
    {
      data: {
        id: "e25",
        source: "book:sherlock-baskerville",
        target: "cat:misterio",
        type: "PERTENECE_A",
      },
    },
  ],
};

/* configuración para probar AWS (Lambda Function URL) */
// Poner en false cuando termina el lab o volver al mock
const USE_AWS = false;

// URL pública de Lambda (Function URL)
const FUNCTION_URL =
  "https://mnlsnvjahi7epaxgye5mw2wdq40xnjnn.lambda-url.us-west-2.on.aws/";

/* Navegación: landing - app */

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

/* Carga del grafo (mock) o de AWS Lambda */

async function loadGraph() {
  if (placeholder) placeholder.style.display = "none";
  if (graphArea) graphArea.classList.add("graph-ready");

  if (USE_AWS) {
    try {
      const res = await fetch(FUNCTION_URL);
      if (!res.ok) throw new Error("HTTP " + res.status);

      const graph = await res.json();

      if (statusBadge)
        statusBadge.textContent = "Modo en vivo (AWS Lambda · DynamoDB)";

      /* ---- LIMITAR A 100 LIBROS ---- */

      const bookNodes = graph.nodes
        .filter((n) => n.data.type === "Libro")
        .slice(0, 100);

      const bookIds = new Set(bookNodes.map((n) => n.data.id));

      const edges = graph.edges.filter((e) => bookIds.has(e.data.source));

      const categoryIds = new Set(edges.map((e) => e.data.target));

      const categoryNodes = graph.nodes.filter((n) =>
        categoryIds.has(n.data.id),
      );

      const smallGraph = {
        nodes: [...bookNodes, ...categoryNodes],
        edges: edges,
      };

      const elements = smallGraph.nodes.concat(smallGraph.edges);
      initCytoscape(elements);
      setDefaultDetails();
      return;
    } catch (err) {
      console.error("Error AWS, usando mock:", err);
      // Si falla AWS, mostramos modo demo
      if (statusBadge)
        statusBadge.textContent =
          "Modo demostración (datos mock · AWS Lambda inactivo)";
    }
  }

  // Fallback o modo normal (mock)
  const elements = MOCK_GRAPH.nodes.concat(MOCK_GRAPH.edges);
  if (statusBadge)
    statusBadge.textContent =
      "Modo demostración (datos mock · AWS Lambda inactivo)";
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

/* Click en nodos: resaltar y mostrar detalles */

function registerNodeClick() {
  cy.on("tap", "node", function (evt) {
    const node = evt.target;
    const data = node.data();

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

    renderDetails(data, neighbors);
  });
}

/* Panel de detalles (incluye sinopsis si está disponible en AWS) */

function renderDetails(data, neighbors) {
  if (!panelDetalles) return;

  let html = "";
  html += '<h3 style="margin-bottom:8px;">' + data.label + "</h3>";
  html += '<p style="margin-bottom:6px;">' + data.type + "</p>";

  // Sinopsis solo para libros y solo si viene en los datos (modo AWS)
  if (data.type === "Libro" && data.synopsis) {
    const cleanSynopsis = data.synopsis
      .replace(/\n/g, " ")
      .replace(/\[.*?\]\(.*?\)/g, "")
      .trim();

    const shortSynopsis =
      cleanSynopsis.length > 220
        ? cleanSynopsis.slice(0, 220).trim() + "..."
        : cleanSynopsis;

    html += '<p style="margin-top:10px;"><strong>Sinopsis:</strong></p>';
    html += "<p>" + shortSynopsis + "</p>";
  }

  html += '<p style="margin-top:12px;"><strong>Relacionado con:</strong></p>';
  html += '<ul style="margin-top:6px; padding-left:18px;">';

  neighbors.forEach(function (n) {
    html += "<li>" + n.data("label") + "</li>";
  });

  html += "</ul>";

  panelDetalles.innerHTML = html;
}

/* Búsqueda */

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
