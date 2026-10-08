document.addEventListener("DOMContentLoaded",function(){
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const K="streamzone_cart";
const leer=()=>{try{const d=JSON.parse(localStorage.getItem(K));return Array.isArray(d)?d:[]}catch(e){return[]}};
const guardar=c=>{try{localStorage.setItem(K,JSON.stringify(c))}catch(e){}};

// Sesión (la crea login.html)
try{const s=JSON.parse(localStorage.getItem("streamzone_session"));if(s&&s.nombre){const u=$('a[href="login.html"]');if(u){u.setAttribute("aria-label","Mi cuenta de "+s.nombre);u.title=s.nombre;u.innerHTML='<b style="font-size:13px">'+s.nombre.trim().charAt(0).toUpperCase().replace(/[<>&]/g,"")+'</b>';u.style.background="rgba(255,46,62,.22)"}}}catch(e){}

// Menú móvil
const mb=$(".mb"),menu=$("#menu");
function setMenu(a){menu.classList.toggle("active",a);mb.setAttribute("aria-expanded",a);mb.setAttribute("aria-label",a?"Cerrar menú":"Abrir menú");const i=mb.querySelector("i");i.classList.toggle("fa-xmark",a);i.classList.toggle("fa-bars",!a)}
mb.addEventListener("click",()=>setMenu(!menu.classList.contains("active")));
menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>setMenu(false)));
document.addEventListener("click",e=>{if(menu.classList.contains("active")&&!menu.contains(e.target)&&!mb.contains(e.target))setMenu(false)});
document.addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false)});

// Carrito
const cc=$(".cart-count");
const pintar=()=>{cc.textContent=leer().reduce((s,i)=>s+i.cantidad,0)};
try{if(localStorage.getItem(K)!==null&&!Array.isArray(JSON.parse(localStorage.getItem(K))))localStorage.removeItem(K)}catch(e){try{localStorage.removeItem(K)}catch(_){}}
pintar();
$$(".add").forEach(b=>b.addEventListener("click",()=>{
  const id=b.dataset.product,card=b.closest(".card"),c=leer(),x=c.find(i=>i.id===id);
  if(x)x.cantidad++;else c.push({id:id,nombre:card.dataset.name||id,cantidad:1});
  guardar(c);pintar();b.classList.add("added");setTimeout(()=>b.classList.remove("added"),350);
}));

// Buscador
const sb=$(".sbar"),q=$("#q"),cards=$$("#servicios .card"),nr=$(".nores");
const norm=t=>t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();
function filtrar(){const t=norm(q.value);let v=0;cards.forEach(c=>{const ok=!t||norm(c.textContent).includes(t);c.hidden=!ok;if(ok)v++});nr.hidden=v>0}
$(".sb").addEventListener("click",function(){const abrir=sb.hidden;sb.hidden=!abrir;this.setAttribute("aria-expanded",abrir);if(abrir)q.focus();else{q.value="";filtrar()}});
q.addEventListener("input",()=>{filtrar();if(q.value.trim())$("#servicios").scrollIntoView({behavior:"smooth"})});
q.addEventListener("keydown",e=>{if(e.key==="Escape")$(".sb").click()});
$(".sc").addEventListener("click",()=>{q.value="";filtrar();q.focus()});

// Formulario (simulado: conéctalo a un backend o servicio de correo)
$("#cf").addEventListener("submit",function(e){
  e.preventDefault();const b=this.querySelector("button");if(b.disabled)return;
  const o=b.innerHTML;b.disabled=true;b.innerHTML='<i class="fa-solid fa-check"></i> Mensaje enviado';
  setTimeout(()=>{this.reset();b.disabled=false;b.innerHTML=o},2500);
});

// Año automático
const fp=$(".fb p");fp.textContent=fp.textContent.replace(/©\s*\d{4}/,"© "+new Date().getFullYear());

// Enlace activo según scroll
const links=$$(".menu a"),secs=Array.from(links).map(a=>$(a.getAttribute("href")));
function act(){const p=scrollY+160;let k=0;secs.forEach((s,i)=>{if(s&&s.offsetTop<=p)k=i});links.forEach((a,i)=>a.classList.toggle("active",i===k))}
addEventListener("scroll",act,{passive:true});act();

// Spotlight en tarjetas
$$(".card").forEach(c=>c.addEventListener("mousemove",e=>{const r=c.getBoundingClientRect();c.style.setProperty("--mx",(e.clientX-r.left)+"px");c.style.setProperty("--my",(e.clientY-r.top)+"px")}));

// Aparición al hacer scroll
if("IntersectionObserver" in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
  $$(".rv").forEach((el,i)=>{el.style.transitionDelay=(i%4)*80+"ms";io.observe(el)});
}else $$(".rv").forEach(el=>el.classList.add("in"));

// Carrusel con tarjeta central destacada
const car=$(".car");
function centrar(){const r=car.getBoundingClientRect(),m=r.left+r.width/2;let best=null,bd=1e9;cards.forEach(c=>{c.classList.remove("on");if(c.hidden)return;const b=c.getBoundingClientRect(),d=Math.abs(b.left+b.width/2-m);if(d<bd){bd=d;best=c}});if(best)best.classList.add("on")}
car.addEventListener("scroll",()=>requestAnimationFrame(centrar),{passive:true});
$$(".nx").forEach((b,i)=>b.addEventListener("click",()=>car.scrollBy({left:(i?1:-1)*(cards[0].offsetWidth+26),behavior:"smooth"})));
function inicial(){const c=cards[1]||cards[0];if(c)car.scrollLeft=c.offsetLeft-(car.clientWidth-c.offsetWidth)/2;centrar()}
addEventListener("load",inicial);inicial();
q.addEventListener("input",()=>setTimeout(centrar,50));

// Detalle de producto
const V=[{n:"1 mes",p:10000},{n:"6 meses",p:50000}],T=[[5,3],[10,5],[25,10]],MAX=30;let vi=0,qty=1;
const fmt=n=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(n);
const dsc=n=>T.reduce((d,t)=>n>=t[0]?t[1]:d,0),un=n=>V[vi].p*(1-dsc(n)/100);
function det(){
  $("#vars").innerHTML=V.map((v,i)=>`<button class="var" data-i="${i}" aria-pressed="${i===vi}"><small>0${i+1}</small>${v.n}<em>${fmt(v.p)}</em><u><i class="fa-solid fa-check"></i></u></button>`).join("");
  $("#qv").textContent=qty;
  $("#pz").innerHTML=[1,5,10,25].map(n=>`<button class="pz${n===qty?" on":""}" data-n="${n}">${n}<small>${fmt(un(n))}</small></button>`).join("");
  $("#tb").innerHTML=T.map(t=>`<tr><td>${t[0]}+</td><td>${fmt(V[vi].p*(1-t[1]/100))}</td><td>${t[1]}%</td></tr>`).join("");
  $("#tot").textContent=fmt(un(qty)*qty);
}
$("#vars").addEventListener("click",e=>{const b=e.target.closest(".var");if(b){vi=+b.dataset.i;det()}});
$("#pz").addEventListener("click",e=>{const b=e.target.closest(".pz");if(b){qty=+b.dataset.n;det()}});
$("#qm").addEventListener("click",()=>{qty=Math.max(1,qty-1);det()});
$("#qp").addEventListener("click",()=>{qty=Math.min(MAX,qty+1);det()});
function agregarDet(){const c=leer(),id="demo-"+vi,x=c.find(i=>i.id===id);if(x)x.cantidad+=qty;else c.push({id:id,nombre:"Servicio de ejemplo - "+V[vi].n,cantidad:qty});guardar(c);pintar()}
$("#dAdd").addEventListener("click",function(){agregarDet();this.classList.add("added");setTimeout(()=>this.classList.remove("added"),400)});
$("#dBuy").addEventListener("click",()=>{agregarDet();location.href="carrito.html"});
det();

// Botón subir
const up=$(".up");up.addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));
addEventListener("scroll",()=>{up.hidden=scrollY<600},{passive:true});up.hidden=true;
});
