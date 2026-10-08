// ===== CONFIGURACIÓN GENERAL: edita solo este archivo =====
window.STREAMZONE = {
  whatsapp: "57XXXXXXXXXX",              // tu número con indicativo, sin signos ni espacios (ej: 573001234567)
  whatsappMostrar: "+57 XXX XXX XXXX",   // cómo se ve el número en las páginas
  email: "contacto@streamzone.com",
  horario: "Lunes a sábado, 8:00 a. m. a 8:00 p. m.", // ajústalo a tu horario real
  ciudad: "Colombia",
  configurado: function () { return !/X/i.test(this.whatsapp); },
  waUrl: function (texto) {
    return "https://wa.me/" + this.whatsapp + (texto ? "?text=" + encodeURIComponent(texto) : "");
  }
};
