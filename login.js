const USERS = "streamzone_users", SES = "streamzone_session";
const $ = s => document.querySelector(s);
const jget = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch (e) { return d; } };
const jset = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };

// Destino tras ingresar: solo páginas internas (evita redirecciones a otros sitios)
function destino() {
  const v = new URLSearchParams(location.search).get("volver") || "";
  return /^[\w\-]+\.html$/.test(v) ? v : "servicios.html";
}

async function hash(pass, salt) {
  if (!(window.crypto && crypto.subtle)) return "plain:" + pass; // contexto no seguro (file://): sin SubtleCrypto
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(salt + pass));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}
function salt() { const a = new Uint8Array(12); (window.crypto || {}).getRandomValues ? crypto.getRandomValues(a) : a.forEach((_, i) => a[i] = Math.random() * 256); return Array.from(a).map(b => b.toString(16).padStart(2, "0")).join(""); }
const okEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

function vista() {
  const s = jget(SES, null), logged = !!(s && s.email);
  $("#auth").hidden = logged; $("#acc").hidden = !logged;
  if (logged) { $("#nm").textContent = s.nombre; $("#em").textContent = s.email; $("#av").textContent = s.nombre.trim().charAt(0).toUpperCase(); }
}

// Pestañas
function tab(up) {
  $("#tIn").setAttribute("aria-selected", !up); $("#tUp").setAttribute("aria-selected", up);
  $("#tIn").tabIndex = up ? -1 : 0; $("#tUp").tabIndex = up ? 0 : -1;
  $("#fIn").hidden = up; $("#fUp").hidden = !up;
  $("#tit").innerHTML = up ? 'Crea tu <span class="grad">cuenta</span>' : 'Bienvenido <span class="grad">de nuevo</span>';
}
$("#tIn").addEventListener("click", () => tab(false));
$("#tUp").addEventListener("click", () => tab(true));
document.querySelector(".tabs").addEventListener("keydown", e => {
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") { const up = e.key === "ArrowRight"; tab(up); (up ? $("#tUp") : $("#tIn")).focus(); }
});
if (location.hash === "#registro") tab(true);

// Mostrar/ocultar contraseña
document.querySelectorAll(".eye").forEach(b => b.addEventListener("click", () => {
  const i = document.getElementById(b.dataset.t), ver = i.type === "password";
  i.type = ver ? "text" : "password";
  b.setAttribute("aria-label", (ver ? "Ocultar" : "Mostrar") + " contraseña");
  b.firstElementChild.className = ver ? "fa-regular fa-eye-slash" : "fa-regular fa-eye";
}));

function msg(id, t, ok) { const m = $(id); m.textContent = t; m.className = "msg" + (ok ? " ok" : ""); }

$("#fUp").addEventListener("submit", async e => {
  e.preventDefault();
  const nombre = $("#upNom").value.trim(), email = $("#upEmail").value.trim().toLowerCase(), pass = $("#upPass").value;
  if (!nombre) return msg("#mUp", "Escribe tu nombre.");
  if (!okEmail(email)) return msg("#mUp", "Escribe un correo válido.");
  if (pass.length < 8) return msg("#mUp", "La contraseña debe tener al menos 8 caracteres.");
  const users = jget(USERS, []);
  if (users.some(u => u.email === email)) return msg("#mUp", "Ya existe una cuenta con ese correo. Ingresa en su lugar.");
  const s = salt();
  users.push({ nombre, email, salt: s, hash: await hash(pass, s) });
  if (!jset(USERS, users)) return msg("#mUp", "No se pudo guardar la cuenta en este navegador.");
  jset(SES, { nombre, email });
  location.href = destino();
});

$("#fIn").addEventListener("submit", async e => {
  e.preventDefault();
  const email = $("#inEmail").value.trim().toLowerCase(), pass = $("#inPass").value;
  if (!okEmail(email) || !pass) return msg("#mIn", "Escribe tu correo y contraseña.");
  const u = jget(USERS, []).find(x => x.email === email);
  if (!u || u.hash !== await hash(pass, u.salt)) return msg("#mIn", "Correo o contraseña incorrectos.");
  jset(SES, { nombre: u.nombre, email: u.email });
  location.href = destino();
});

$("#out").addEventListener("click", () => { try { localStorage.removeItem(SES); } catch (e) {} vista(); tab(false); });

vista();
