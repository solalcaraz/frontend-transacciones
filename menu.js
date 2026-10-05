// Dibuja el menú lateral, que es igual en todas las páginas, y marca la actual según la URL.
// Se carga justo después del <nav id="menu"> para que el menú aparezca sin esperar al resto de la página.
(() => {
  const paginas = [
    { href: "index.html", icono: "bi-speedometer2", texto: "Inicio" },
    { href: "reportes.html", icono: "bi-bar-chart", texto: "Reportes" },
    { href: "transacciones.html", icono: "bi-cash-coin", texto: "Transacciones" },
    { href: "clientes.html", icono: "bi-people", texto: "Clientes" },
    { href: "cajeros.html", icono: "bi-device-ssd", texto: "Cajeros" },
    { href: "tipos_transacciones.html", icono: "bi-wallet", texto: "Tipos de transacciones" },
  ];
  const actual = location.pathname.split("/").pop() || "index.html";

  document.getElementById("menu").innerHTML = `
    <h4 class="text-white">Detector de anomalías</h4>
    <ul class="nav flex-column mt-4">
      ${paginas
        .map(
          (p) => `
        <li class="nav-item">
          <a class="nav-link ${p.href === actual ? "active" : ""}" href="${p.href}"><i class="bi ${p.icono}"></i> ${p.texto}</a>
        </li>`
        )
        .join("")}
    </ul>`;
})();
