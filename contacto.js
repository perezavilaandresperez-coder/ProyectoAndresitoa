// contacto.html -> el mensaje se envía por WhatsApp o por correo (sin necesidad de servidor)
(function () {
  var C = window.STREAMZONE || {};
  function $(s) { return document.querySelector(s); }
  var msg = $("#msg");

  function datos() {
    var nombre = $("#nombre").value.trim(), asunto = $("#asunto").value, mensaje = $("#mensaje").value.trim();
    if (!nombre) { msg.className = "msg"; msg.textContent = "Escribe tu nombre."; $("#nombre").focus(); return null; }
    if (!mensaje) { msg.className = "msg"; msg.textContent = "Escribe tu mensaje."; $("#mensaje").focus(); return null; }
    msg.textContent = "";
    return { nombre: nombre, asunto: asunto, mensaje: mensaje, correo: $("#correo").value.trim() };
  }
  function texto(d) {
    return "Hola StreamZone, soy " + d.nombre + ".\nAsunto: " + d.asunto + "\n\n" + d.mensaje + (d.correo ? "\n\nMi correo: " + d.correo : "");
  }

  $("#btnWa").addEventListener("click", function () {
    var d = datos(); if (!d) return;
    if (!(C.configurado && C.configurado())) { window.szToast("Falta configurar tu número de WhatsApp en config.js"); return; }
    window.open(C.waUrl(texto(d)), "_blank", "noopener");
    msg.className = "msg ok"; msg.textContent = "Se abrió WhatsApp con tu mensaje listo para enviar.";
  });

  $("#btnMail").addEventListener("click", function () {
    var d = datos(); if (!d) return;
    location.href = "mailto:" + (C.email || "") + "?subject=" + encodeURIComponent(d.asunto + " - " + d.nombre) + "&body=" + encodeURIComponent(texto(d));
    msg.className = "msg ok"; msg.textContent = "Se abrió tu correo con el mensaje listo para enviar.";
  });

  $("#f").addEventListener("submit", function (e) { e.preventDefault(); });
})();
