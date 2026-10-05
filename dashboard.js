const IDS_ESTADISTICAS = ["total-clientes", "clientes-sospechosos", "transacciones-totales", "transacciones-por-minuto"];

async function cargarEstadisticas() {
  try {
    const response = await fetch(`${API_URL}/estadisticas`);
    if (!response.ok) throw new Error("Error al obtener estadísticas");
    const data = await response.json();

    document.getElementById("total-clientes").textContent = data.total_clientes;
    document.getElementById("clientes-sospechosos").textContent = data.porcentaje_clientes_sospechosos.toFixed(2) + "%";
    document.getElementById("transacciones-totales").textContent = data.total_transacciones;
    document.getElementById("transacciones-por-minuto").textContent = Math.round(data.promedio_transacciones_por_minuto);
  } catch (error) {
    console.error("No se pudieron cargar las estadísticas:", error);
    IDS_ESTADISTICAS.forEach((id) => (document.getElementById(id).textContent = "Error de carga"));
  }

  cargarGraficoClientes();
}

async function cargarGraficoClientes() {
  const container = document.getElementById("grafico-clientes");
  try {
    const response = await fetch(`${API_URL}/anomalias/graficos/clientes_sospechosos`);
    if (!response.ok) throw new Error("Error al cargar gráfico");
    container.innerHTML = await response.text();

    // innerHTML no ejecuta los <script> que trae el HTML de Plotly, así que hay que recrearlos.
    for (const original of container.getElementsByTagName("script")) {
      const script = document.createElement("script");
      if (original.src) {
        script.src = original.src;
      } else {
        script.text = original.innerHTML;
      }
      document.body.appendChild(script);
    }
  } catch (error) {
    console.error("No se pudo cargar el gráfico:", error);
    container.innerHTML = "<p class='text-danger'>Error al cargar gráfico</p>";
  }
}

cargarEstadisticas();
