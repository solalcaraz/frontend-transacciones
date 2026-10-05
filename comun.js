const API_URL = "http://127.0.0.1:8000";

function escapeHtml(text) {
  if (text === null || text === undefined) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function formatDateTime(dateTimeString) {
  const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
  return new Date(Date.parse(dateTimeString)).toLocaleDateString("es-ES", options);
}

function showError(message) {
  document.querySelectorAll(".alert").forEach((alert) => alert.remove());

  const alert = document.createElement("div");
  alert.className = "alert alert-danger alert-dismissible fade show";
  alert.innerHTML = `
    <i class="bi bi-exclamation-triangle"></i> ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  const main = document.querySelector("main");
  main.insertBefore(alert, main.querySelector(".card"));
  setTimeout(() => alert.remove(), 8000);
}

// La API pagina con skip/limit, así que primero se pide el total para traer todo en un solo pedido.
async function traerTodos(endpoint) {
  const countRes = await fetch(`${endpoint}/count`);
  if (!countRes.ok) throw new Error(`${countRes.status} ${countRes.statusText}`);
  const total = await countRes.json();

  const res = await fetch(`${endpoint}/?skip=0&limit=${total}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

// Las transacciones guardan solo el id del tipo; este mapa permite mostrar el nombre.
async function cargarTiposTransacciones() {
  const tiposMap = {};
  try {
    const res = await fetch(`${API_URL}/tipos_transacciones/`);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    (await res.json()).forEach((t) => (tiposMap[t.id] = t.nombre));
  } catch (error) {
    console.error("Error cargando tipos de transacciones:", error);
  }
  return tiposMap;
}
