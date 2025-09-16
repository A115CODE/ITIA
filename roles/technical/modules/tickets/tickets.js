console.log("Tickets ON");

const TICKETS_CONTAINER = document.createElement("div");
TICKETS_CONTAINER.id = "TICKETS_CONTAINER";
TICKETS_CONTAINER.classList.add("tickets-container");
SYSTEM.appendChild(TICKETS_CONTAINER);

const TICKETS_HEADER = document.createElement("header");
TICKETS_HEADER.id = "TICKETS_HEADER";
TICKETS_HEADER.classList.add("tickets-header");
TICKETS_CONTAINER.appendChild(TICKETS_HEADER);

const TICKETS_HEADER_H1 = document.createElement("h1");
TICKETS_HEADER_H1.id = "TICKETS_HEADER_H1";
TICKETS_HEADER_H1.classList.add("tickets-header-h1");
TICKETS_HEADER_H1.textContent = "Tickets";
TICKETS_HEADER.appendChild(TICKETS_HEADER_H1);

const TICKETS_TABLE = document.createElement("table");
TICKETS_TABLE.id = "TICKETS_TABLE";
TICKETS_TABLE.classList.add("tickets-table");
TICKETS_CONTAINER.appendChild(TICKETS_TABLE);

const TICKETS_TABLE_THEAD = document.createElement("thead");
TICKETS_TABLE_THEAD.id = "TICKETS_TABLE_THEAD";
TICKETS_TABLE.appendChild(TICKETS_TABLE_THEAD);

const TICKETS_TABLE_THEAD_TR = document.createElement("tr");
TICKETS_TABLE_THEAD_TR.id = "TICKETS_TABLE_THEAD_TR";
TICKETS_TABLE_THEAD.appendChild(TICKETS_TABLE_THEAD_TR);

function DEPLOY_TH(titulo_tabla) {
  const TH = document.createElement("th");
  TH.textContent = titulo_tabla;
  TICKETS_TABLE_THEAD_TR.appendChild(TH);
}
DEPLOY_TH("TICKET");
DEPLOY_TH("TITULO");
DEPLOY_TH("DESCRIPCION");
DEPLOY_TH("ESTADO");
DEPLOY_TH("PRIORIDAD");
DEPLOY_TH("USUARIO");
DEPLOY_TH("AGENTE");
DEPLOY_TH("FECHA aCTUALIZACION");

const TICKETS_TABLE_TBODY = document.createElement("tbody");
TICKETS_TABLE_TBODY.id = "TICKETS_TABLE_TBODY";
TICKETS_TABLE.appendChild(TICKETS_TABLE_TBODY);

// Recuperar JWT del sessionStorage
function obtenerToken() {
  const jwtData = sessionStorage.getItem("jwtData");
  if (!jwtData) return null;
  try {
    const { token, expiraEn } = JSON.parse(jwtData);
    if (Date.now() > expiraEn) {
      sessionStorage.removeItem("jwtData");
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

// cargar los tikes
async function cargarTickets() {
  try {
    // mandamos token pendejo
    const token = obtenerToken();
    if (!token) {
      alert("Sesión expirada o no iniciada. Por favor, inicie sesión.");
      window.location.href = "../login_tikets.html";
      return;
    }
    // Llama al webhook de n8n
    const res = await fetch("http://localhost:5678/webhook/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const tickets = await res.json();

    const tbody = document.querySelector(".tickets-table tbody");
    tbody.innerHTML = "";

    tickets.forEach((ticket) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
          <td>#${ticket.id_ticket}</td>
          <td>${ticket.titulo}</td>
          <td>${ticket.descripcion}</td>
          <td>
            <span class="status-badge status-${ticket.estado}">
              ${ticket.estado}
            </span>
          </td>
          <td class="priority-${ticket.prioridad}">
            ${ticket.prioridad}
          </td>
          <td>${ticket.nombre_usuario}</td>
          <td>${ticket.id_asignado || "Sin asignar"}</td>
          <td>${new Date(ticket.fecha_actualizacion).toLocaleString()}</td>
        `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error cargando tickets:", error);
  }
}

// Ejecutar al cargar la página
cargarTickets();
