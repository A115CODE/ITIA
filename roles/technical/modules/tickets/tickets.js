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
DEPLOY_TH("FECHA aCTUALIZACION");
DEPLOY_TH("ACCIONES");

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
    console.log("Token obtenido:", obtenerToken());
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
      window.location.href = "./login_tikets.html";
      return;
    }
    // Llama al webhook de n8n
    const res = await fetch("http://localhost:5678/webhook/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }), //JWT
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
          <td>${new Date(ticket.fecha_actualizacion).toLocaleString()}</td>
          <td>
            <div class="acciones-dropdown">
              <button class="acciones-btn">Acciones</button>
              <div class="acciones-menu" style="display:none;position:absolute;z-index:10;background:#fff;border:1px solid #ccc;">
                <button class="asignar-btn">Asignármelo</button>
                <button class="enviar-btn">Enviar a otro equipo</button>
              </div>
            </div>
          </td>
        `;

      // Lógica para mostrar/ocultar el menú
      const accionesBtn = tr.querySelector(".acciones-btn");
      const accionesMenu = tr.querySelector(".acciones-menu");
      accionesBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        accionesMenu.style.display =
          accionesMenu.style.display === "block" ? "none" : "block";
      });

      // Cerrar el menú si se hace clic fuera
      document.addEventListener("click", () => {
        accionesMenu.style.display = "none";
      });

      // Eventos para los botones del menú
      tr.querySelector(".asignar-btn").addEventListener("click", () => {
        alert(`Ticket #${ticket.id_ticket} asignado a ti.`);
        accionesMenu.style.display = "none";
        // Aquí puedes agregar la lógica para asignar el ticket
        // Función que maneja la asignación del ticket
        async function asignarTicket() {
          // 1. Obtener el JWT del sessionStorage
          const token = sessionStorage.getItem("jwt"); // Asegúrate que la clave sea correcta
          if (!token) {
            alert("No hay token de autenticación. Por favor, inicia sesión.");
            return;
          }
          try {
            // 2. Enviar petición POST al webhook
            const res = await fetch(
              "http://localhost:5678/webhook/asignar/ticket",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
              }
            );
            // 3. Manejar respuesta
            if (res.ok) {
              alert("¡Ticket asignado correctamente!");
              // Puedes actualizar la UI aquí, por ejemplo:
              cargarTickets()
              // location.reload();  // si quieres recargar
              // o actualizar un elemento del DOM
            } else {
              alert("Error al asignar el ticket. Intenta nuevamente.");
            }
          } catch (error) {
            console.error("Error en la petición:", error);
            alert("Hubo un problema de conexión.");
          }
        }
        // Asignar evento al botón
        document
          .querySelector(".asignar-btn")
          .addEventListener("click", asignarTicket);
      });


      tr.querySelector(".enviar-btn").addEventListener("click", () => {
        alert(`Enviar ticket #${ticket.id_ticket} a otro equipo.`);
        accionesMenu.style.display = "none";
        // Aquí puedes agregar la lógica para enviar el ticket
      });

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error cargando tickets:", error);
  }
}

// Ejecutar al cargar la página
cargarTickets();
