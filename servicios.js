// Los ids (p0-p4) coinciden con el CATALOGO de carrito.html y con el index.
const SERVICIOS = window.CATALOGO_SZ || [];
const KEY = "streamzone_cart", SES = "streamzone_session";
const $ = s => document.querySelector(s);
const norm = t => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
const leer = () => { try { const d = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(d) ? d : []; } catch (e) { return []; } };
const guardar = c => { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} };
const pintar = () => { $(".cart-count").textContent = leer().reduce((s, i) => s + i.cantidad, 0); };
function el(t, c, x) { const e = document.createElement(t); if (c) e.className = c; if (x !== undefined) e.textContent = x; return e; }

// Sesión
try { const s = JSON.parse(localStorage.getItem(SES)); if (s && s.nombre) { $("#whoTxt").textContent = s.nombre.split(" ")[0]; $("#who").setAttribute("aria-label", "Mi cuenta de " + s.nombre); } } catch (e) {}

// Tarjetas
let cat = "Todos", tt = null;
const grid = $("#grid");
SERVICIOS.forEach(s => {
  const card = el("article", "card"); card.dataset.cat = s.c;
  const art = el("div", "art"); art.setAttribute("aria-hidden", "true");
  if (s.dsc) art.appendChild(el("span", "dsc", "-" + s.dsc + "%"));
  art.insertAdjacentHTML("beforeend", '<i class="fa-solid ' + s.i + '"></i>');
  const inf = el("div", "inf");
  inf.append(el("span", "cat mono", s.c), el("h3", "", s.n), el("p", "", s.d));
  const pr = el("div", "pr"); pr.append(el("strong", "", "Por confirmar"), el("span", "", "Se confirma por WhatsApp"));
  const b = el("button", "btn btn-r add"); b.type = "button"; b.dataset.product = s.id;
  b.setAttribute("aria-label", "Añadir " + s.n + " al carrito");
  b.innerHTML = '<i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>Añadir al carrito';
  const ver = el("a", "btn btn-g", "Ver producto"); ver.href = "producto.html?id=" + s.id; ver.setAttribute("aria-label", "Ver producto: " + s.n);
  const bt = el("div", "bt"); bt.append(ver, b); inf.append(pr, bt); card.append(art, inf); grid.appendChild(card);
});
const cards = Array.from(grid.children);

// Categorías
const chips = $("#chips");
["Todos"].concat(Array.from(new Set(SERVICIOS.map(s => s.c)))).forEach(c => {
  const b = el("button", "chip", c); b.type = "button"; b.setAttribute("aria-pressed", c === "Todos");
  b.addEventListener("click", () => { cat = c; chips.querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", x === b)); filtrar(); });
  chips.appendChild(b);
});

function filtrar() {
  const t = norm($("#q").value); let v = 0;
  cards.forEach(c => { const ok = (cat === "Todos" || c.dataset.cat === cat) && (!t || norm(c.textContent).includes(t)); c.hidden = !ok; if (ok) v++; });
  $("#nores").hidden = v > 0;
  $("#live").textContent = v + (v === 1 ? " servicio encontrado" : " servicios encontrados");
}
$("#q").addEventListener("input", filtrar);

// Añadir al carrito (misma clave y formato que index y carrito)
grid.addEventListener("click", e => {
  const b = e.target.closest(".add"); if (!b) return;
  const s = SERVICIOS.find(x => x.id === b.dataset.product), c = leer(), x = c.find(i => i.id === s.id);
  if (x) x.cantidad++; else c.push({ id: s.id, nombre: s.n, cantidad: 1 });
  guardar(c); pintar();
  b.classList.add("added"); setTimeout(() => b.classList.remove("added"), 350);
  $("#tmsg").textContent = s.n + " añadido"; $("#toast").hidden = false;
  clearTimeout(tt); tt = setTimeout(() => { $("#toast").hidden = true; }, 4000);
});

pintar();
