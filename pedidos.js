// pedidos.html -> historial de pedidos de la cuenta con sesión iniciada
(function () {
  var SZ = window.SZ, el = SZ.el, root = SZ.$("#lista"), tools = SZ.$("#tools");
  var s = SZ.sesion();

  function mensaje(icono, titulo, texto, botones) {
    var v = el("div", "vacio");
    v.innerHTML = '<i class="fa-solid ' + icono + '" aria-hidden="true"></i>';
    v.append(el("h2", "", titulo), el("p", "", texto));
    var b = el("div", "btns");
    botones.forEach(function (x) { var a = el("a", "btn " + x.c, x.t); a.href = x.h; b.appendChild(a); });
    v.appendChild(b); root.textContent = ""; root.appendChild(v);
  }

  if (!s) {
    tools.hidden = true;
    mensaje("fa-user-lock", "Inicia sesión para ver tus pedidos", "Aquí aparecerá el historial de los pedidos que hagas con tu cuenta.",
      [{ c: "btn-r", t: "Iniciar sesión", h: "login.html?volver=pedidos.html" }, { c: "btn-g", t: "Consultar por número", h: "seguimiento.html" }]);
    return;
  }

  function render() {
    var mios = SZ.pedidos().filter(function (o) { return o.email === s.email; })
      .sort(function (a, b) { return a.fecha < b.fecha ? 1 : -1; });
    root.textContent = "";
    tools.hidden = !mios.length;
    if (!mios.length) {
      mensaje("fa-box-open", "Aún no tienes pedidos", "Cuando finalices un pedido con tu sesión iniciada, lo verás aquí.",
        [{ c: "btn-r", t: "Ver servicios", h: "servicios.html" }]);
      return;
    }
    mios.forEach(function (o) {
      var c = el("article", "ord"), h = el("div", "ord-h"), l = el("div");
      l.append(el("strong", "", o.id), document.createElement("br"), el("small", "", SZ.fecha(o.fecha)));
      h.append(l, el("span", "badge", o.estado || "Enviado"));
      var ul = el("ul");
      o.items.forEach(function (i) { ul.appendChild(el("li", "", i.cantidad + " × " + i.n)); });
      var t = el("div", "ord-t"); t.append(el("span", "", "Total"), el("strong", "", o.total === null ? "Por confirmar" : SZ.fmt(o.total)));
      var f = el("div", "btns");
      var seg = el("a", "btn btn-g", "Ver seguimiento"); seg.href = "seguimiento.html?pedido=" + encodeURIComponent(o.id);
      var rep = el("button", "btn btn-g", "Repetir pedido"); rep.type = "button";
      rep.addEventListener("click", function () {
        o.items.forEach(function (i) { SZ.agregar(i.id, i.n, i.cantidad); });
        location.href = "carrito.html";
      });
      f.append(seg, rep); c.append(h, ul, t, f); root.appendChild(c);
    });
  }

  SZ.$("#borrar").addEventListener("click", function () {
    if (!confirm("¿Borrar el historial de pedidos de esta cuenta en este navegador?")) return;
    SZ.guardarPedidos(SZ.pedidos().filter(function (o) { return o.email !== s.email; }));
    render();
  });
  render();
})();
