// producto.html?id=p0  ->  ficha de un servicio del catálogo (catalogo.js)
(function () {
  var SZ = window.SZ, el = SZ.el, root = SZ.$("#pd"), extra = SZ.$("#extra");
  var P = window.CATALOGO_SZ || [];
  var id = new URLSearchParams(location.search).get("id");
  var p = P.filter(function (x) { return x.id === id; })[0];

  if (!p) {
    document.title = "Servicio no encontrado | StreamZone";
    root.className = "nf";
    root.append(el("h1", "", "Servicio no encontrado"), el("p", "", "Ese servicio no existe o ya no está disponible."));
    var back = el("a", "btn btn-r", "Ver todos los servicios"); back.href = "servicios.html";
    root.appendChild(back);
    return;
  }

  document.title = p.n + " | StreamZone";
  var md = document.querySelector('meta[name="description"]'); if (md) md.content = p.d;
  var og = document.querySelector('meta[property="og:title"]'); if (og) og.content = p.n + " | StreamZone";

  // Imagen
  var art = el("div", "pd-art"), a = el("div", "art"); a.setAttribute("aria-hidden", "true");
  if (p.dsc) a.appendChild(el("span", "dsc", "-" + p.dsc + "%"));
  a.insertAdjacentHTML("beforeend", '<i class="fa-solid ' + p.i + '"></i>');
  art.appendChild(a);

  // Información
  var info = el("div", "pd-info"), qty = 1, MAX = 30;
  info.append(el("span", "mono", p.c), el("h1", "", p.n), el("p", "largo", p.largo));

  var ul = el("ul", "list-ok");
  p.incluye.forEach(function (t) { var li = el("li"); li.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i>'; li.appendChild(el("span", "", t)); ul.appendChild(li); });
  info.appendChild(ul);

  var pr = el("div", "pd-price"); pr.append(el("strong", "", "Precio por confirmar"), el("span", "", "Se confirma por WhatsApp"));
  info.appendChild(pr);

  info.appendChild(el("span", "lb mono", "Cantidad"));
  var qs = el("div", "qs"); qs.setAttribute("role", "group"); qs.setAttribute("aria-label", "Cantidad");
  var minus = el("button"), plus = el("button"), out = el("output", "", "1");
  minus.type = plus.type = "button";
  minus.innerHTML = '<i class="fa-solid fa-minus" aria-hidden="true"></i>'; minus.setAttribute("aria-label", "Quitar una unidad");
  plus.innerHTML = '<i class="fa-solid fa-plus" aria-hidden="true"></i>'; plus.setAttribute("aria-label", "Agregar una unidad");
  out.setAttribute("aria-live", "polite");
  function pintar() { out.textContent = qty; minus.disabled = qty <= 1; plus.disabled = qty >= MAX; }
  minus.addEventListener("click", function () { qty = Math.max(1, qty - 1); pintar(); });
  plus.addEventListener("click", function () { qty = Math.min(MAX, qty + 1); pintar(); });
  qs.append(minus, out, plus); info.appendChild(qs); pintar();

  var btns = el("div", "btns");
  var add = el("button", "btn btn-r"); add.type = "button";
  add.innerHTML = '<i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>Añadir al carrito';
  add.addEventListener("click", function () { SZ.agregar(p.id, p.n, qty); window.szToast(qty + (qty === 1 ? " unidad añadida" : " unidades añadidas") + " al carrito"); });
  var buy = el("button", "btn btn-g"); buy.type = "button";
  buy.innerHTML = '<i class="fa-solid fa-bolt" aria-hidden="true"></i>Comprar ya';
  buy.addEventListener("click", function () { SZ.agregar(p.id, p.n, qty); location.href = "carrito.html"; });
  btns.append(add, buy); info.appendChild(btns);

  var ask = el("a", "btn btn-wa"); ask.innerHTML = '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i>Preguntar por WhatsApp';
  window.szWa(ask, "Hola StreamZone, quiero información sobre: " + p.n);
  var wrapAsk = el("div", "btns"); wrapAsk.appendChild(ask); info.appendChild(wrapAsk);
  info.appendChild(el("p", "note", "Máximo 30 unidades por pedido. Desde 5 unidades aplican descuentos por volumen."));

  root.append(art, info);

  // Preguntas del producto
  if (p.faq && p.faq.length) {
    var h = el("h2", "sec-t", "Preguntas sobre este servicio"), fq = el("div", "faq");
    p.faq.forEach(function (f) {
      var d = document.createElement("details"), s = document.createElement("summary");
      s.append(document.createTextNode(f.q + " ")); s.insertAdjacentHTML("beforeend", '<i class="fa-solid fa-chevron-down" aria-hidden="true"></i>');
      d.append(s, el("p", "", f.a)); fq.appendChild(d);
    });
    extra.append(h, fq);
  }

  // Otros servicios
  var otros = P.filter(function (x) { return x.id !== p.id; }).slice(0, 3);
  if (otros.length) {
    extra.appendChild(el("h2", "sec-t", "También te puede interesar"));
    var g = el("div", "grid");
    otros.forEach(function (o) {
      var c = el("article", "card"), ar = el("div", "art"); ar.setAttribute("aria-hidden", "true");
      if (o.dsc) ar.appendChild(el("span", "dsc", "-" + o.dsc + "%"));
      ar.insertAdjacentHTML("beforeend", '<i class="fa-solid ' + o.i + '"></i>');
      var inf = el("div", "inf"); inf.append(el("span", "cat mono", o.c), el("h3", "", o.n), el("p", "", o.d));
      var l = el("a", "btn btn-g", "Ver producto"); l.href = "producto.html?id=" + o.id;
      inf.appendChild(l); c.append(ar, inf); g.appendChild(c);
    });
    extra.appendChild(g);
  }
})();
