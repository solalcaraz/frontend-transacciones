// Tabla con búsqueda y paginación del lado del navegador. Los datos se traen una sola vez
// y se filtran en memoria porque la API no tiene un endpoint de búsqueda.
// Espera en la página un #searchInput, un #btnLimpiar, un #searchInfo y un #pagination.
function crearTabla({ tbodyId, columnas, camposBusqueda, renderFila }) {
  const TAMANIO_PAGINA = 30;
  const tbody = document.getElementById(tbodyId);
  const searchInput = document.getElementById("searchInput");
  const searchInfo = document.getElementById("searchInfo");
  const pagination = document.getElementById("pagination");

  let todos = [];
  let filtrados = [];
  let paginaActual = 1;

  const totalPaginas = () => Math.max(1, Math.ceil(filtrados.length / TAMANIO_PAGINA));

  function renderTabla() {
    const inicio = (paginaActual - 1) * TAMANIO_PAGINA;
    const pagina = filtrados.slice(inicio, inicio + TAMANIO_PAGINA);

    if (pagina.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="${columnas}" class="text-center text-muted p-4">
            <i class="bi bi-inbox fs-1"></i>
            <p class="mb-0 mt-2">No se encontraron resultados</p>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = "";
    pagina.forEach((item, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = renderFila(item, inicio + i + 1);
      tbody.appendChild(tr);
    });
  }

  function botonPagina(texto, pagina, activo = false) {
    const li = document.createElement("li");
    li.className = `page-item ${activo ? "active" : ""}`;
    li.innerHTML = `<a class="page-link" href="#">${texto}</a>`;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      irAPagina(pagina);
    });
    return li;
  }

  function renderPaginacion() {
    pagination.innerHTML = "";
    const total = totalPaginas();
    if (total <= 1) return;

    const maxVisibles = 5;
    let desde = Math.max(1, paginaActual - Math.floor(maxVisibles / 2));
    let hasta = desde + maxVisibles - 1;
    if (hasta > total) {
      hasta = total;
      desde = Math.max(1, hasta - maxVisibles + 1);
    }

    if (paginaActual > 1) {
      pagination.appendChild(botonPagina("« Primero", 1));
      pagination.appendChild(botonPagina("‹", paginaActual - 1));
    }
    for (let i = desde; i <= hasta; i++) {
      pagination.appendChild(botonPagina(i, i, i === paginaActual));
    }
    if (paginaActual < total) {
      pagination.appendChild(botonPagina("›", paginaActual + 1));
      pagination.appendChild(botonPagina("Último »", total));
    }
  }

  function render() {
    renderTabla();
    renderPaginacion();
  }

  function irAPagina(pagina) {
    paginaActual = pagina;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function buscar() {
    const consulta = searchInput.value.trim().toLowerCase();
    if (!consulta) {
      filtrados = [...todos];
      searchInfo.innerHTML = "";
    } else {
      filtrados = todos.filter((item) =>
        camposBusqueda.some((campo) => item[campo] != null && String(item[campo]).toLowerCase().includes(consulta))
      );
      searchInfo.innerHTML = `<i class="bi bi-info-circle"></i> Encontrados <strong>${filtrados.length}</strong> resultado(s) para "<strong>${escapeHtml(consulta)}</strong>"`;
    }
    paginaActual = 1;
    render();
  }

  function limpiarBusqueda() {
    searchInput.value = "";
    buscar();
  }

  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") buscar();
    if (e.key === "Escape") limpiarBusqueda();
  });
  document.getElementById("btnLimpiar").addEventListener("click", limpiarBusqueda);

  // Espera a que se deje de tipear para no filtrar miles de filas en cada tecla.
  let timeoutBusqueda;
  searchInput.addEventListener("input", () => {
    clearTimeout(timeoutBusqueda);
    timeoutBusqueda = setTimeout(buscar, 400);
  });

  tbody.innerHTML = `
    <tr>
      <td colspan="${columnas}" class="text-center p-4">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mb-0 mt-2">Cargando datos...</p>
      </td>
    </tr>`;

  return {
    cargar(datos) {
      todos = datos;
      filtrados = [...todos];
      render();
    },
    buscarPorId: (id) => todos.find((item) => item.id == id),
    agregar(item) {
      todos.unshift(item);
      buscar();
    },
    actualizar(id, cambios) {
      todos = todos.map((item) => (item.id == id ? { ...item, ...cambios } : item));
      filtrados = filtrados.map((item) => (item.id == id ? { ...item, ...cambios } : item));
      renderTabla();
    },
    eliminar(id) {
      todos = todos.filter((item) => item.id != id);
      filtrados = filtrados.filter((item) => item.id != id);
      paginaActual = Math.min(paginaActual, totalPaginas());
      render();
    },
  };
}
