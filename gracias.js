// gracias.html?pedido=SZ-... -> confirmación después de finalizar el pedido
(function () {
  var SZ = window.SZ, el = SZ.el, box = SZ.$("#detalle");
  var id = (new URLSearchParams(location.search).get("pedido") || "").toUpperCase();
  var o = SZ.pedidos().filter(function (x) { return x.id === id; })[0];

  if (!o) { SZ.$("#aviso").hidden = false; return; }

  SZ.$("#num").textContent = o.id;
  var c = el("article", "ord"), h = el("div", "ord-h");
  h.append(el("strong", "", o.id), el("span", "badge", o.estado || "Enviado"));
  var ul = el("ul"); o.items.forEach(function (i) { ul.appendChild(el("li", "", i.cantidad + " × " + i.n)); });
  var t = el("div", "ord-t"); t.append(el("span", "", "Total"), el("strong", "", o.total === null ? "Por confirmar" : SZ.fmt(o.total)));
  c.append(h, ul, t);
  box.appendChild(c);

  var seg = SZ.$("#seg"); if (seg) seg.href = "seguimiento.html?pedido=" + encodeURIComponent(o.id);
  var w = SZ.$("#wa2"); if (w) window.szWa(w, "Hola StreamZone, te escribo por mi pedido " + o.id);
})();
