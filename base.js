// Comportamiento base de las páginas nuevas: menú, contador del carrito, sesión y utilidades (window.SZ)
(function () {
  var KEY = "streamzone_cart", SES = "streamzone_session", ORD = "streamzone_orders";
  function $(s) { return document.querySelector(s); }
  function jget(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch (e) { return d; } }
  function jset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }

  var SZ = window.SZ = {
    $: $,
    fmt: function (n) { return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n); },
    el: function (t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x !== undefined) e.textContent = x; return e; },
    carrito: function () {
      var c = jget(KEY, []);
      return Array.isArray(c) ? c.filter(function (i) { return i && i.id && i.cantidad > 0; }) : [];
    },
    guardarCarrito: function (c) { jset(KEY, c); SZ.contador(); },
    agregar: function (id, nombre, cant) {
      var c = SZ.carrito(), x = c.filter(function (i) { return i.id === id; })[0];
      if (x) x.cantidad = Math.min(30, x.cantidad + cant); else c.push({ id: id, nombre: nombre, cantidad: Math.min(30, cant) });
      SZ.guardarCarrito(c);
    },
    contador: function () {
      var el = $(".cart-count");
      if (el) el.textContent = SZ.carrito().reduce(function (s, i) { return s + i.cantidad; }, 0);
    },
    sesion: function () { var s = jget(SES, null); return s && s.email ? s : null; },
    pedidos: function () { var p = jget(ORD, []); return Array.isArray(p) ? p : []; },
    guardarPedidos: function (p) { return jset(ORD, p); },
    fecha: function (iso) {
      try { return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso)); } catch (e) { return ""; }
    }
  };

  // Menú móvil
  var mb = $(".mb"), menu = $("#menu");
  function setMenu(a) {
    if (!mb || !menu) return;
    menu.classList.toggle("active", a);
    mb.setAttribute("aria-expanded", String(a));
    mb.setAttribute("aria-label", a ? "Cerrar menú" : "Abrir menú");
    var i = mb.querySelector("i"); i.classList.toggle("fa-xmark", a); i.classList.toggle("fa-bars", !a);
  }
  if (mb && menu) {
    mb.addEventListener("click", function () { setMenu(!menu.classList.contains("active")); });
    document.addEventListener("click", function (e) { if (menu.classList.contains("active") && !menu.contains(e.target) && !mb.contains(e.target)) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  // Enlace activo
  var actual = document.body.getAttribute("data-nav") || (location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".menu a").forEach(function (a) {
    if (a.getAttribute("href") === actual) { a.classList.add("active"); a.setAttribute("aria-current", "page"); }
  });

  // Carrito y sesión
  SZ.contador();
  var s = SZ.sesion();
  if (s && s.nombre) {
    var t = $("#whoTxt"), w = $("#who");
    if (t) t.textContent = s.nombre.split(" ")[0];
    if (w) w.setAttribute("aria-label", "Mi cuenta de " + s.nombre);
  }
})();
