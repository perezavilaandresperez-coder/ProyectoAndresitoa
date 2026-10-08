document.addEventListener("DOMContentLoaded", function () {

  // ===== UTILIDADES DE ALMACENAMIENTO (seguras) =====
  const CLAVE = "streamzone_cart";

  function leerCarrito() {
    try {
      const datos = JSON.parse(localStorage.getItem(CLAVE));
      return Array.isArray(datos) ? datos : [];
    } catch (e) {
      return [];
    }
  }

  function guardarCarrito(carrito) {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(carrito));
    } catch (e) {
      console.warn("No se pudo guardar el carrito.");
    }
  }

  // ===== MENÚ MÓVIL =====
  const menuButton = document.querySelector(".menu-button");
  const navMenu = document.querySelector(".nav-menu");

  function establecerMenu(abierto) {
    if (!menuButton || !navMenu) return;
    navMenu.classList.toggle("active", abierto);
    menuButton.setAttribute("aria-expanded", String(abierto));
    menuButton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    const icono = menuButton.querySelector("i");
    if (icono) {
      icono.classList.toggle("fa-xmark", abierto);
      icono.classList.toggle("fa-bars", !abierto);
    }
  }

  if (menuButton && navMenu) {
    menuButton.addEventListener("click", function () {
      establecerMenu(!navMenu.classList.contains("active"));
    });
    navMenu.querySelectorAll("a").forEach(function (enlace) {
      enlace.addEventListener("click", function () { establecerMenu(false); });
    });
    document.addEventListener("click", function (e) {
      if (navMenu.classList.contains("active") &&
          !navMenu.contains(e.target) && !menuButton.contains(e.target)) {
        establecerMenu(false);
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") establecerMenu(false);
    });
  }

  // ===== CARRITO =====
  const contadorCarrito = document.querySelector(".cart-count");

  function actualizarContador() {
    if (!contadorCarrito) return;
    const total = leerCarrito().reduce(function (suma, item) {
      return suma + item.cantidad;
    }, 0);
    contadorCarrito.textContent = total;
  }

  // Migración: antes se guardaba solo un número
  (function migrar() {
    try {
      const crudo = localStorage.getItem(CLAVE);
      if (crudo !== null && !Array.isArray(JSON.parse(crudo))) {
        localStorage.removeItem(CLAVE);
      }
    } catch (e) {
      try { localStorage.removeItem(CLAVE); } catch (e2) { /* nada */ }
    }
  })();

  actualizarContador();

  document.querySelectorAll(".add-cart").forEach(function (boton) {
    boton.addEventListener("click", function () {
      const id = boton.dataset.product;
      if (!id) return;
      const tarjeta = boton.closest(".service-card");
      const nombre = tarjeta ? tarjeta.dataset.name || id : id;

      const carrito = leerCarrito();
      const existente = carrito.find(function (item) { return item.id === id; });
      if (existente) {
        existente.cantidad++;
      } else {
        carrito.push({ id: id, nombre: nombre, cantidad: 1 });
      }
      guardarCarrito(carrito);
      actualizarContador();

      boton.classList.add("added");
      setTimeout(function () { boton.classList.remove("added"); }, 300);
    });
  });

  // ===== BUSCADOR (filtra mientras se escribe) =====
  const botonBuscar = document.querySelector(".search-button");
  const barraBusqueda = document.querySelector(".search-bar");
  const inputBusqueda = document.getElementById("searchInput");
  const botonLimpiar = document.querySelector(".search-clear");
  const tarjetas = document.querySelectorAll(".service-card");
  const sinResultados = document.querySelector(".no-results");

  function normalizar(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  }

  function filtrar() {
    const texto = normalizar(inputBusqueda.value);
    let visibles = 0;
    tarjetas.forEach(function (tarjeta) {
      const coincide = texto === "" || normalizar(tarjeta.textContent).includes(texto);
      tarjeta.hidden = !coincide;
      if (coincide) visibles++;
    });
    if (sinResultados) sinResultados.hidden = visibles > 0;
  }

  function limpiarBusqueda() {
    inputBusqueda.value = "";
    filtrar();
    inputBusqueda.focus();
  }

  if (botonBuscar && barraBusqueda && inputBusqueda) {
    botonBuscar.addEventListener("click", function () {
      const abrir = barraBusqueda.hidden;
      barraBusqueda.hidden = !abrir;
      botonBuscar.setAttribute("aria-expanded", String(abrir));
      if (abrir) {
        inputBusqueda.focus();
      } else {
        inputBusqueda.value = "";
        filtrar();
      }
    });

    inputBusqueda.addEventListener("input", function () {
      filtrar();
      const primera = Array.from(tarjetas).find(function (t) { return !t.hidden; });
      if (primera && inputBusqueda.value.trim() !== "") {
        document.getElementById("servicios").scrollIntoView({ behavior: "smooth" });
      }
    });

    inputBusqueda.addEventListener("keydown", function (e) {
      if (e.key === "Escape") botonBuscar.click();
    });

    if (botonLimpiar) botonLimpiar.addEventListener("click", limpiarBusqueda);
  }

  // ===== FORMULARIO DE CONTACTO =====
  // Nota: solo simula el envío. Conéctalo a un backend o servicio (Formspree, EmailJS, etc.)
  const formulario = document.querySelector(".contact-form");

  if (formulario) {
    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      const boton = formulario.querySelector('button[type="submit"]');
      if (!boton || boton.disabled) return;

      const textoOriginal = boton.innerHTML;
      boton.disabled = true;
      boton.innerHTML = '<i class="fa-solid fa-check"></i> Mensaje enviado';

      setTimeout(function () {
        formulario.reset();
        boton.disabled = false;
        boton.innerHTML = textoOriginal;
      }, 2500);
    });
  }

  // ===== AÑO AUTOMÁTICO =====
  const parrafoFooter = document.querySelector(".footer-bottom p");
  if (parrafoFooter) {
    parrafoFooter.textContent = parrafoFooter.textContent.replace(
      /©\s*\d{4}/, "© " + new Date().getFullYear()
    );
  }

  // ===== ENLACE ACTIVO SEGÚN SCROLL =====
  const enlaces = document.querySelectorAll(".nav-menu a[href^='#']");
  const secciones = Array.from(enlaces).map(function (enlace) {
    return document.querySelector(enlace.getAttribute("href"));
  });

  function marcarActivo() {
    const posicion = window.scrollY + 140;
    let actual = 0;
    secciones.forEach(function (seccion, i) {
      if (seccion && seccion.offsetTop <= posicion) actual = i;
    });
    enlaces.forEach(function (enlace, i) {
      enlace.classList.toggle("active", i === actual);
    });
  }

  window.addEventListener("scroll", marcarActivo, { passive: true });
  marcarActivo();

});
