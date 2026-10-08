// ===== CONFIGURACIÓN: edita aquí =====
const WHATSAPP = (window.STREAMZONE && window.STREAMZONE.whatsapp) || "57XXXXXXXXXX"; // se configura en config.js
const CATALOGO = { // id (data-product del index) -> nombre, precio (null = por definir), ícono
  p0: { n: "Streaming de series y películas", p: null, i: "fa-film" },
  p1: { n: "Streaming de contenido premium", p: null, i: "fa-tv" },
  p2: { n: "Suscripción musical", p: null, i: "fa-music" },
  p3: { n: "Servicios para videojuegos", p: null, i: "fa-gamepad" },
  p4: { n: "Herramientas digitales", p: null, i: "fa-wand-magic-sparkles" },
  "demo-0": { n: "Servicio de ejemplo - 1 mes", p: 10000, i: "fa-film" },
  "demo-1": { n: "Servicio de ejemplo - 6 meses", p: 50000, i: "fa-film" }
};
const TRAMOS = [[5, 3], [10, 5], [25, 10]]; // [cantidad mínima, % de descuento]
const CUPONES = { BIENVENIDO5: 5 };          // código -> % de descuento (ejemplo)
const METODOS = [
  { id: "Transferencia bancaria", i: "fa-building-columns" },
  { id: "Billetera digital", i: "fa-wallet" },
  { id: "Tarjeta", i: "fa-credit-card" }
];
const MAX = 30;
// =====================================

const KEY = "streamzone_cart", KORD = "streamzone_order";
const $ = s => document.querySelector(s);
const fmt = n => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
const dsc = q => TRAMOS.reduce((d, t) => q >= t[0] ? t[1] : d, 0);
const info = it => CATALOGO[it.id] || { n: it.nombre || it.id, p: null, i: "fa-bag-shopping" };
function leer() { try { const d = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(d) ? d.filter(i => i && i.id && i.cantidad > 0) : []; } catch (e) { return []; } }
function guardar(c) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} }
function el(t, c, x) { const e = document.createElement(t); if (c) e.className = c; if (x !== undefined) e.textContent = x; return e; }
function anunciar(t) { const l = $("#live"); l.textContent = ""; setTimeout(() => { l.textContent = t; }, 60); }

let orden = { nombre: "", metodo: METODOS[0].id, notas: "", cupon: "" }, ultimo = null, borrado = null, tt = null;
try { Object.assign(orden, JSON.parse(localStorage.getItem(KORD)) || {}); } catch (e) {}
function guardarOrden() { try { localStorage.setItem(KORD, JSON.stringify(orden)); } catch (e) {} }
if (!CUPONES[orden.cupon]) orden.cupon = "";

function totales(c) {
  let bruto = 0, neto = 0, sin = 0;
  c.forEach(it => { const d = info(it), n = Math.min(it.cantidad, MAX); if (d.p === null) { sin++; return; } bruto += d.p * n; neto += d.p * n * (1 - dsc(n) / 100); });
  const cp = orden.cupon ? CUPONES[orden.cupon] : 0, cd = neto * cp / 100;
  return { bruto, neto, cp, cd, total: neto - cd, sin, hay: sin < c.length };
}

function render() {
  const c = leer(), n = c.reduce((s, i) => s + Math.min(i.cantidad, MAX), 0);
  $("#vacio").hidden = c.length > 0; $("#lay").hidden = !c.length; $("#vaciar").hidden = !c.length; $("#mbar").hidden = !c.length;
  $("#cnt").textContent = c.length ? n + (n === 1 ? " producto" : " productos") : "";
  if (!c.length) return;

  const ul = $("#lista"); ul.textContent = "";
  c.forEach(item => {
    const d = info(item), cant = Math.min(item.cantidad, MAX), li = el("li", "it");
    const th = el("div", "th"); th.setAttribute("aria-hidden", "true"); th.innerHTML = '<i class="fa-solid ' + d.i + '"></i>';
    const mid = el("div"), u = el("div", "u"), sub = el("div", "sub");
    mid.appendChild(el("h3", "", d.n));
    if (d.p !== null) {
      const pct = dsc(cant), unit = d.p * (1 - pct / 100);
      if (pct) u.appendChild(el("s", "", fmt(d.p)));
      u.appendChild(document.createTextNode(fmt(unit) + " c/u"));
      if (pct) u.appendChild(el("span", "dd", "-" + pct + "%"));
      sub.textContent = fmt(unit * cant);
    } else { u.textContent = "Precio por confirmar"; sub.textContent = "—"; sub.appendChild(el("small", "", "Se confirma por WhatsApp")); }
    mid.appendChild(u);

    const qt = el("div", "qt"), qs = el("div", "qs");
    qs.setAttribute("role", "group"); qs.setAttribute("aria-label", "Cantidad de " + d.n);
    const mk = (a, ic, lab, dis) => { const b = el("button"); b.type = "button"; b.innerHTML = '<i class="fa-solid ' + ic + '" aria-hidden="true"></i>'; b.setAttribute("aria-label", lab + " " + d.n); b.dataset.a = a; b.dataset.id = item.id; b.disabled = dis; return b; };
    const o = el("output", "", cant); o.setAttribute("aria-label", cant + " unidades");
    qs.append(mk("dec", "fa-minus", "Quitar una unidad de", cant <= 1), o, mk("inc", "fa-plus", "Agregar una unidad de", cant >= MAX));
    const rm = el("button", "rm"); rm.type = "button"; rm.dataset.a = "del"; rm.dataset.id = item.id;
    rm.setAttribute("aria-label", "Eliminar " + d.n + " del carrito"); rm.innerHTML = '<i class="fa-regular fa-trash-can" aria-hidden="true"></i>Quitar';
    qt.append(qs, rm); mid.appendChild(qt);
    li.append(th, mid, sub); ul.appendChild(li);
  });

  const t = totales(c);
  $("#sSub").textContent = t.hay ? fmt(t.bruto) : "—";
  $("#rVol").hidden = !(t.hay && t.bruto - t.neto > 0.5); $("#sVol").textContent = "-" + fmt(t.bruto - t.neto);
  $("#rCup").hidden = !(t.hay && t.cd > 0); $("#lCup").textContent = "Cupón " + orden.cupon + " (-" + t.cp + "%)"; $("#sCup").textContent = "-" + fmt(t.cd);
  const tot = t.hay ? fmt(t.total) : "Por confirmar";
  $("#sTot").textContent = tot; $("#mTot").textContent = tot;
  const p = $("#pend"); p.hidden = !t.sin;
  p.textContent = t.sin + (t.sin === 1 ? " producto aún no tiene precio definido" : " productos aún no tienen precio definido") + ". El total final se confirma al finalizar tu pedido.";

  const cu = $("#cup"), cb = $("#cbtn");
  cu.readOnly = !!orden.cupon; cu.value = orden.cupon || cu.value; cb.textContent = orden.cupon ? "Quitar" : "Aplicar";
  if (ultimo) { const b = document.querySelector('button[data-a="' + ultimo.a + '"][data-id="' + ultimo.id + '"]') || document.querySelector("button[data-a]"); if (b && !b.disabled) b.focus(); else if (b) document.querySelector('button[data-a="del"][data-id="' + ultimo.id + '"]').focus(); ultimo = null; }
}

$("#lista").addEventListener("click", e => {
  const b = e.target.closest("button[data-a]"); if (!b) return;
  let c = leer(); const idx = c.findIndex(i => i.id === b.dataset.id); if (idx < 0) return;
  const it = c[idx], d = info(it); ultimo = { a: b.dataset.a, id: it.id };
  if (b.dataset.a === "inc") { it.cantidad = Math.min(MAX, it.cantidad + 1); anunciar(d.n + ": " + it.cantidad + " unidades"); }
  if (b.dataset.a === "dec") { it.cantidad = Math.max(1, it.cantidad - 1); anunciar(d.n + ": " + it.cantidad + " unidades"); }
  if (b.dataset.a === "del") {
    borrado = { it: it, idx: idx }; c.splice(idx, 1); ultimo = null; guardar(c); render();
    toast(d.n + " eliminado"); anunciar(d.n + " eliminado del carrito. Puedes deshacer.");
    (document.querySelector("button[data-a]") || $("#titulo")).focus(); return;
  }
  guardar(c); render();
});

function toast(m) { $("#tmsg").textContent = m; $("#toast").hidden = false; clearTimeout(tt); tt = setTimeout(() => { $("#toast").hidden = true; borrado = null; }, 7000); }
$("#undo").addEventListener("click", () => {
  if (!borrado) return; const c = leer(); c.splice(Math.min(borrado.idx, c.length), 0, borrado.it); guardar(c);
  $("#toast").hidden = true; anunciar("Producto restaurado"); borrado = null; render();
});

const dlg = $("#dlg");
$("#vaciar").addEventListener("click", () => { if (dlg.showModal) dlg.showModal(); else if (confirm("¿Vaciar todo el carrito?")) { guardar([]); render(); } });
$("#dno").addEventListener("click", () => dlg.close());
$("#dsi").addEventListener("click", () => { guardar([]); dlg.close(); render(); anunciar("Carrito vaciado"); $("#titulo").focus(); });

$("#cbtn").addEventListener("click", () => {
  const m = $("#cmsg");
  if (orden.cupon) { orden.cupon = ""; $("#cup").value = ""; guardarOrden(); m.className = "cm"; m.textContent = "Cupón quitado."; render(); return; }
  const code = $("#cup").value.trim().toUpperCase();
  if (CUPONES[code]) { orden.cupon = code; guardarOrden(); m.className = "cm ok"; m.textContent = "Cupón aplicado: " + CUPONES[code] + "% de descuento."; render(); }
  else { m.className = "cm er"; m.textContent = code ? "Ese cupón no es válido." : "Escribe un código de cupón."; }
});
$("#cup").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); $("#cbtn").click(); } });

const mt = $("#metodos");
METODOS.forEach((m, i) => {
  const l = el("label"), r = el("input"); r.type = "radio"; r.name = "metodo"; r.value = m.id; r.checked = orden.metodo === m.id || (i === 0 && !METODOS.some(x => x.id === orden.metodo));
  const ic = el("i", "fa-solid " + m.i); ic.setAttribute("aria-hidden", "true"); l.append(r, ic, el("span", "", m.id)); mt.appendChild(l);
  r.addEventListener("change", () => { orden.metodo = m.id; guardarOrden(); });
});
$("#nom").value = orden.nombre; $("#notas").value = orden.notas;
$("#nom").addEventListener("input", e => { orden.nombre = e.target.value; guardarOrden(); });
$("#notas").addEventListener("input", e => { orden.notas = e.target.value; guardarOrden(); });

function nuevoId() {
  const d = new Date(), p = n => String(n).padStart(2, "0"), a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let r = ""; for (let i = 0; i < 4; i++) r += a[Math.floor(Math.random() * a.length)];
  return "SZ-" + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + "-" + r;
}
function guardarPedido(p) {
  try {
    let l = JSON.parse(localStorage.getItem("streamzone_orders")); if (!Array.isArray(l)) l = [];
    l.push(p); localStorage.setItem("streamzone_orders", JSON.stringify(l.slice(-50)));
  } catch (e) {}
}
function pedir() {
  const c = leer(), msg = $("#msg"); if (!c.length) return;
  if (/X/i.test(WHATSAPP)) { msg.hidden = false; msg.textContent = "Falta configurar tu número de WhatsApp en el archivo config.js."; return; }
  msg.hidden = true;
  const t = totales(c), id = nuevoId();
  const lin = c.map(it => { const d = info(it), n = Math.min(it.cantidad, MAX); if (d.p === null) return "• " + d.n + " x" + n + " (precio por confirmar)"; return "• " + d.n + " x" + n + " = " + fmt(d.p * (1 - dsc(n) / 100) * n); });
  let tx = "Hola StreamZone" + (orden.nombre.trim() ? ", soy " + orden.nombre.trim() : "") + ". Quiero hacer este pedido (" + id + "):\n\n" + lin.join("\n");
  if (orden.cupon && t.hay) tx += "\n\nCupón " + orden.cupon + ": -" + fmt(t.cd);
  tx += "\nTotal: " + (t.sin ? "por confirmar" : fmt(t.total)) + "\nMétodo de pago: " + orden.metodo;
  if (orden.notas.trim()) tx += "\nNotas: " + orden.notas.trim();
  let email = ""; try { const s = JSON.parse(localStorage.getItem("streamzone_session")); if (s && s.email) email = s.email; } catch (e) {}
  guardarPedido({
    id: id, fecha: new Date().toISOString(), estado: "Enviado", email: email,
    nombre: orden.nombre.trim(), metodo: orden.metodo, notas: orden.notas.trim(), cupon: orden.cupon,
    total: t.sin ? null : Math.round(t.total),
    items: c.map(it => ({ id: it.id, n: info(it).n, cantidad: Math.min(it.cantidad, MAX) }))
  });
  guardar([]);
  window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(tx), "_blank", "noopener");
  location.href = "gracias.html?pedido=" + encodeURIComponent(id);
}
$("#pedir").addEventListener("click", pedir); $("#pedir2").addEventListener("click", pedir);

render();
