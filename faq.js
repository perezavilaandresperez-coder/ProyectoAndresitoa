// faq.html -> buscador de preguntas frecuentes
(function () {
  var q = document.getElementById("q"), nores = document.getElementById("nores");
  var grupos = Array.from(document.querySelectorAll(".fq-g"));
  function norm(t) { return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim(); }
  function filtrar() {
    var t = norm(q.value), total = 0;
    grupos.forEach(function (g) {
      var v = 0;
      g.querySelectorAll("details").forEach(function (d) {
        var ok = !t || norm(d.textContent).indexOf(t) > -1;
        d.hidden = !ok; if (ok) v++;
        if (t && ok) d.open = true; else if (!t) d.open = false;
      });
      g.hidden = v === 0; total += v;
    });
    nores.hidden = total > 0;
  }
  q.addEventListener("input", filtrar);
})();
