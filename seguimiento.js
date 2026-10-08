// seguimiento.html -> consulta de un pedido por su número
(function () {
  var SZ = window.SZ, el = SZ.el, out = SZ.$("#resultado"), form = SZ.$("#f"), inp = SZ.$("#num"), msg = SZ.$("#msg");
  var PASOS = [
    { n: "Enviado", d: "Tu pedido fue enviado por WhatsApp." },
    { n: "En proceso", d: "Estamos gestionando tu pedido." },
    { n: "Entregado", d: "Tu pedido fue entregado." }
  ];

  function buscar(num) {
    num = (num || "").trim().toUpperCase();
    out.textContent = ""; msg.textContent = "";
    if (!num) { msg.textContent = "Escribe tu número de pedido (ej: SZ-261008-AB12)."; return; }
    var o = SZ.pedidos().filter(function (x) { return x.id === num; })[0];
    if (!o) {
      msg.textContent = "No encontramos ese pedido en este navegador. Si lo hiciste desde otro dispositivo, escríbenos por WhatsApp con tu número.";
      var w = el("a", "btn btn-wa"); w.innerHTML = '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i>Escribir por WhatsApp';
      window.szWa(w, "Hola StreamZone, quiero consultar el estado de mi pedido " + num);
      var b = el("div", "btns"); b.appendChild(w); out.appendChild(b);
      return;
    }
    var idx = Math.max(0, PASOS.map(function (p) { return p.n; }).indexOf(o.estado));
    var c = el("article", "ord"), h = el("div", "ord-h"), l = el("div");
    l.append(el("strong", "", o.id), document.createElement("br"), el("small", "", SZ.fecha(o.fecha)));
    h.append(l, el("span", "badge", PASOS[idx].n));
    var ul = el("ul"); o.items.forEach(function (i) { ul.appendChild(el("li", "", i.cantidad + " × " + i.n)); });
    c.append(h, ul);
    var tl = el("ol", "tl"); tl.setAttribute("aria-label", "Estado del pedido");
    PASOS.forEach(function (p, i) {
      var li = el("li", i <= idx ? "done" : ""), b = el("b"), t = el("div");
      b.innerHTML = i <= idx ? '<i class="fa-solid fa-check" aria-hidden="true"></i>' : String(i + 1);
      t.append(el("strong", "", p.n), el("span", "", p.d));
      if (i === idx) li.setAttribute("aria-current", "step");
      li.append(b, t); tl.appendChild(li);
    });
    var nota = el("p", "note", "El estado definitivo de tu pedido te lo confirmamos por WhatsApp. Si tienes dudas, escríbenos con tu número de pedido.");
    var w2 = el("a", "btn btn-wa"); w2.innerHTML = '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i>Consultar por WhatsApp';
    window.szWa(w2, "Hola StreamZone, quiero consultar el estado de mi pedido " + o.id);
    var bb = el("div", "btns"); bb.appendChild(w2);
    out.append(c, tl, nota, bb);
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); buscar(inp.value); });
  var q = new URLSearchParams(location.search).get("pedido");
  if (q) { inp.value = q; buscar(q); }
})();
