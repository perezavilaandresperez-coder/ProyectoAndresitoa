// Comportamiento común a TODAS las páginas (WhatsApp, correo, año). Requiere config.js antes.
(function () {
  var C = window.STREAMZONE || {};
  var tt = null;

  window.szToast = function (msg) {
    var t = document.getElementById("szToast");
    if (!t) {
      t = document.createElement("div");
      t.id = "szToast"; t.className = "sz-toast"; t.setAttribute("role", "status"); t.hidden = true;
      document.body.appendChild(t);
    }
    t.textContent = msg; t.hidden = false;
    clearTimeout(tt); tt = setTimeout(function () { t.hidden = true; }, 4500);
  };

  // Conecta un <a> con WhatsApp (si el número no está configurado, avisa en vez de abrir un enlace roto)
  window.szWa = function (a, texto) {
    if (!a) return;
    if (C.configurado && C.configurado()) {
      a.href = C.waUrl(texto || ""); a.target = "_blank"; a.rel = "noopener";
    } else {
      a.href = "#";
      a.addEventListener("click", function (e) {
        e.preventDefault();
        window.szToast("Falta configurar tu número de WhatsApp en config.js");
      });
    }
  };

  document.querySelectorAll("[data-wa]").forEach(function (a) { window.szWa(a, a.getAttribute("data-wa-text") || ""); });
  document.querySelectorAll("[data-wa-display]").forEach(function (n) { n.textContent = C.whatsappMostrar || ""; });
  document.querySelectorAll("[data-email]").forEach(function (a) { if (C.email) a.href = "mailto:" + C.email; });
  document.querySelectorAll("[data-email-text]").forEach(function (n) { n.textContent = C.email || ""; });
  document.querySelectorAll("[data-horario]").forEach(function (n) { n.textContent = C.horario || ""; });
  document.querySelectorAll("[data-ciudad]").forEach(function (n) { n.textContent = C.ciudad || ""; });

  var fb = document.querySelector(".fb p");
  if (fb) fb.textContent = fb.textContent.replace(/©\s*\d{4}/, "© " + new Date().getFullYear());
})();
