/* =====================================================================
   BoticariaCenter · app.js
   Lógica del sitio: utilidades, componentes, vistas y enrutador.
   Requiere que data.js se cargue antes (define TIPOS, CATS y P).
   ===================================================================== */
 
 
/* ---------------------------------------------------------------------
   1. UTILIDADES
   --------------------------------------------------------------------- */
 
/** Atajo para obtener un elemento por id. */
const $ = id => document.getElementById(id);
 
/** Busca un tipo o categoría por su id dentro de TIPOS o CATS. */
const by = (lista, id) => lista.find(item => item[0] === id);
 
/** Código de espécimen según la posición en P (ej. FL-001). */
const code = p => "FL-" + String(P.indexOf(p) + 1).padStart(3, "0");
 
/** Migas de pan: bc('<a ...>Tipos</a>', 'Hierbas') */
const bc = (...partes) => `<div class="cr">${partes.join(" › ")}</div>`;
 
 
/* ---------------------------------------------------------------------
   2. ILUSTRACIÓN SVG (flor generada cuando la planta no tiene imagen)
   --------------------------------------------------------------------- */
 
const HUE = [120, 330, 350, 270, 25, 300, 160, 200, 0, 100, 150, 140, 60, 345, 330];
 
function art(p) {
  const i = P.indexOf(p);
  const h = HUE[i % HUE.length];     // color base de la flor
  const n = 5 + (i % 4);             // número de pétalos
 
  // Luces desenfocadas del fondo
  let luces = "";
  for (let k = 0; k < 5; k++) {
    luces += `<circle cx="${(i * 37 + k * 53) % 200}" cy="${(i * 23 + k * 41) % 150}" r="${14 + k * 4}"
      fill="hsl(${h} 50% 30%)" opacity=".35" filter="url(#b${i})"/>`;
  }
 
  // Pétalos distribuidos en círculo
  let petalos = "";
  for (let k = 0; k < n; k++) {
    petalos += `<ellipse cx="100" cy="52" rx="${13 + (i % 3) * 2}" ry="30"
      fill="url(#g${i})" opacity=".85" transform="rotate(${k * 360 / n} 100 75)"/>`;
  }
 
  return `
    <svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="g${i}">
          <stop offset="0" stop-color="hsl(${h} 70% 82%)"/>
          <stop offset="1" stop-color="hsl(${h} 55% 30%)"/>
        </radialGradient>
        <filter id="b${i}"><feGaussianBlur stdDeviation="6"/></filter>
      </defs>
      <rect width="200" height="150" fill="#030a0f"/>
      ${luces}
      ${petalos}
      <circle cx="100" cy="75" r="7" fill="#f6d77a"/>
    </svg>`;
}
 
 
/* ---------------------------------------------------------------------
   3. COMPONENTES (devuelven HTML)
   --------------------------------------------------------------------- */
 
/** Etiqueta de color según categoría (prioridad: tóxica > medicinal > aromática > ornamental). */
function tag(p) {
  if (p.k.includes("toxicas"))      return '<span class="tg bad">Tóxica</span>';
  if (p.k.includes("medicinales"))  return '<span class="tg ok">Medicinal</span>';
  if (p.k.includes("aromaticas"))   return '<span class="tg ac">Aromática</span>';
  if (p.k.includes("ornamentales")) return '<span class="tg ac">Ornamental</span>';
  return "";
}
 
/** Imagen real de la planta (si define img) o la flor SVG generada. */
const imagen = p => p.img
  ? `<img src="${p.img}" alt="${p.n}" style="width:100%;height:100%;object-fit:cover">`
  : art(p);
 
/** Tarjeta de planta (catálogo, listas por tipo y por categoría). */
const pc = p => `
  <a class="cd" href="#/planta/${p.id}">
    <div class="im">
      <span class="cdn">${code(p)}</span>${tag(p)}${imagen(p)}
    </div>
    <div class="cb">
      <div class="c">${by(TIPOS, p.t)[1]}</div>
      <h3>${p.n}</h3>
      <div class="sf">${p.c}</div>
      <div class="l">Uso primario</div>
      <p>${p.u}</p>
      <div class="go"><span>Abrir expediente</span><span>→</span></div>
    </div>
  </a>`;
 
/** Tarjeta genérica para tipos y categorías. */
const gc = (href, emoji, titulo, subtitulo, codigo) => `
  <a class="cd" href="${href}">
    <div class="im">
      <span class="cdn">${codigo}</span>
      <div class="ph">${emoji}</div>
    </div>
    <div class="cb">
      <div class="c">${subtitulo}</div>
      <h3>${titulo}</h3>
      <div class="go" style="margin-top:12px"><span>Abrir sección</span><span>→</span></div>
    </div>
  </a>`;
 
/** Encabezado de sección: etiqueta pequeña + título (+ contenido extra a la derecha). */
const encabezado = (etiqueta, titulo, extra = "") => `
  <div class="sh">
    <div><small>${etiqueta}</small><h2>${titulo}</h2></div>
    ${extra}
  </div>`;
 
/** Panel informativo con título opcional. */
const panel = (texto, titulo = "") =>
  `<div class="pn">${titulo ? `<h3>${titulo}</h3>` : ""}<p>${texto}</p></div>`;
 
 
/* ---------------------------------------------------------------------
   4. ESTADO, BÚSQUEDA Y FILTROS (catálogo de la página de inicio)
   --------------------------------------------------------------------- */
 
let F = "todos";   // filtro activo
let Q = "";        // texto de búsqueda (en minúsculas)
 
const FILTROS = [
  ["todos", "Todos"],
  ["medicinales", "Medicinales"],
  ["toxicas", "Tóxicas"],
  ["aromaticas", "Aromáticas"],
  ["ornamentales", "Ornamentales"]
];
 
/** Aplica filtro y búsqueda, redibuja tarjetas, contador y pestañas. */
function draw() {
  const lista = P.filter(p =>
    (F === "todos" || p.k.includes(F)) &&
    (p.n + p.c + p.u).toLowerCase().includes(Q)
  );
 
  $("g").innerHTML = lista.map(pc).join("") || "<p>Sin resultados.</p>";
  $("rc").textContent = lista.length + " REGISTROS";
 
  document.querySelectorAll(".tabs button").forEach(b =>
    b.classList.toggle("on", b.dataset.f === F)
  );
}
 
const setF = filtro => { F = filtro; draw(); };
const setQ = texto  => { Q = texto.toLowerCase(); draw(); };
 
 
/* ---------------------------------------------------------------------
   5. VISTAS (una función por página)
   --------------------------------------------------------------------- */
 
const R = {
 
  /* ---- Inicio: hero, buscador, información y catálogo ---- */
  home() {
    setTimeout(draw);   // dibuja el catálogo cuando el HTML ya está en el DOM
 
    const pestanas = FILTROS.map(([id, nombre]) =>
      `<button data-f="${id}" onclick="setF('${id}')">${nombre}</button>`
    ).join("");
 
    return `
      <section class="hero">
        <span class="bd">HERBARIO DIGITAL · EDICIÓN 01</span>
        <p class="sf">Scientia naturae</p>
        <h1 class="o">BOTICARIA<br><span class="ol">CENTER</span></h1>
        <p>Explora la inteligencia oculta de las plantas: un archivo vivo sobre sus tipos, propiedades, usos, hábitats y las leyendas que cada cultura ha tejido en torno a ellas.</p>
        <div class="sr">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2de2d0" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
          <input placeholder="Buscar por nombre, especie o uso..." oninput="setQ(this.value)">
          <span id="rc"></span>
        </div>
      </section>
 
      ${panel("BoticariaCenter es una enciclopedia digital organizada por tipo de planta y por categoría de uso, con fichas científicas, hábitat, propiedades y leyendas con bibliografía.", "Sobre el proyecto")}
      ${panel("Soy Cel, estudiante de Ingeniería en Desarrollo de Software. Creé este archivo para unir tecnología y naturaleza y acercar el conocimiento botánico a todos.", "Quién soy y mi propósito")}
      ${panel("Cómo se clasifican las plantas, cuáles curan, cuáles son peligrosas, dónde viven y qué mitos las acompañan.", "Lo que descubrirás")}
 
      ${encabezado("01 / COLECCIÓN", "Especímenes catalogados", `<div class="tabs">${pestanas}</div>`)}
      <div class="grid" id="g"></div>`;
  },
 
  /* ---- Tipos de plantas ---- */
  tipos() {
    const tarjetas = TIPOS.map((t, i) => gc(
      "#/tipos/" + t[0], t[2], t[1],
      P.filter(p => p.t === t[0]).length + " especímenes",
      "TP-" + String(i + 1).padStart(2, "0")
    )).join("");
 
    return `
      ${encabezado("02 / CLASIFICACIÓN", "Tipos de plantas")}
      ${panel("Clasificar las plantas nos permite entender cómo se organizan, qué función cumplen en su ecosistema y cómo se relacionan con nosotros: producen el oxígeno que respiramos, alimento, medicinas y materiales, y estabilizan suelo y clima. Cada tipo es una estrategia distinta de vida.")}
      <div class="grid">${tarjetas}</div>`;
  },
 
  /* ---- Lista de plantas de un tipo ---- */
  tipo(id) {
    const t = by(TIPOS, id);
    if (!t) return R.nf();
 
    const plantas = P.filter(p => p.t === id).map(pc).join("") || "<p>Próximamente más especímenes.</p>";
 
    return `
      ${bc('<a href="#/tipos">Tipos</a>', t[1])}
      ${encabezado("TIPO / " + t[1].toUpperCase(), `${t[2]} ${t[1]}`)}
      ${panel(t[3] + " Bienvenido a un nuevo mundo de conocimiento: elige una planta para abrir su expediente.")}
      <div class="grid">${plantas}</div>`;
  },
 
  /* ---- Categorías ---- */
  cats() {
    const tarjetas = CATS.map((c, i) => gc(
      "#/categorias/" + c[0], c[2], c[1],
      P.filter(p => p.k.includes(c[0])).length + " especímenes",
      "CT-0" + (i + 1)
    )).join("");
 
    return `
      ${encabezado("03 / USO", "Categorías")}
      ${panel("Las plantas también se agrupan por su relación con las personas: las que perfuman, adornan, curan o ponen en riesgo la salud. Una misma planta puede pertenecer a varias categorías.")}
      <div class="grid">${tarjetas}</div>`;
  },
 
  /* ---- Lista de plantas de una categoría ---- */
  cat(id) {
    const c = by(CATS, id);
    if (!c) return R.nf();
 
    return `
      ${bc('<a href="#/categorias">Categorías</a>', c[1])}
      ${encabezado("CATEGORÍA / " + c[1].toUpperCase(), `${c[2]} ${c[1]}`)}
      ${panel(c[3])}
      <div class="grid">${P.filter(p => p.k.includes(id)).map(pc).join("")}</div>`;
  },
 
  /* ---- Ficha de una planta ---- */
  planta(id) {
    const p = P.find(x => x.id === id);
    if (!p) return R.nf();
 
    const t = by(TIPOS, p.t);
    const pildoras =
      `<a class="pill" href="#/tipos/${t[0]}">${t[1]}</a>` +
      p.k.map(k => `<a class="pill" href="#/categorias/${k}">${by(CATS, k)[1]}</a>`).join("");
 
    const leyenda = p.l ? `
      <div class="pn" style="margin-top:24px">
        <h3>Leyenda · ${p.l.n}</h3>
        <p><b>Origen:</b> ${p.l.o}</p>
        <p style="margin-top:8px">${p.l.x}</p>
        <div class="bib">📚 Bibliografía: ${p.l.b}</div>
      </div>` : "";
 
    return `
      ${bc('<a href="#/tipos">Tipos</a>', `<a href="#/tipos/${t[0]}">${t[1]}</a>`, p.n)}
      <div class="fi">
        <div class="im">
          <span class="cdn">${code(p)}</span>${tag(p)}${imagen(p)}
        </div>
        <div>
          <div class="c" style="font-size:9px;letter-spacing:.25em;color:var(--ac)">EXPEDIENTE ${code(p)}</div>
          <h1 class="o" style="margin:6px 0 0;font-size:clamp(1.6rem,5vw,2.6rem)">${p.n}</h1>
          <div class="sf" style="font-size:18px;color:var(--mu)">${p.c}</div>
          <dl>
            <dt>Descripción</dt><dd>${p.d}</dd>
            <dt>Propiedades</dt><dd>${p.p}</dd>
            <dt>Hábitat</dt><dd>${p.h}</dd>
            <dt>Uso</dt><dd>${p.u}</dd>
            <dt>Clasificación y categorías</dt><dd>${p.cl}<br>${pildoras}</dd>
          </dl>
        </div>
      </div>
      ${leyenda}`;
  },
 
  /* ---- Error 404 ---- */
  nf: () => `
    <div class="pn">
      <h3>404</h3>
      <p>Sección no encontrada. <a href="#/" style="color:var(--ac)">Volver</a></p>
    </div>`
};
 
 
/* ---------------------------------------------------------------------
   6. ENRUTADOR
   --------------------------------------------------------------------- */
 
function route() {
  const [seccion, id] = (location.hash.slice(2) || "").split("/");
 
  let vista;
  if (!seccion)                     vista = R.home();
  else if (seccion === "tipos")     vista = id ? R.tipo(id) : R.tipos();
  else if (seccion === "categorias") vista = id ? R.cat(id)  : R.cats();
  else if (seccion === "planta")    vista = R.planta(id);
  else                              vista = R.nf();
 
  $("app").innerHTML = vista;
 
  // Resalta el enlace activo del menú (la ficha cuenta como "tipos")
  const activo = seccion === "planta" ? "tipos" : (seccion || "");
  document.querySelectorAll("#nv a").forEach(a =>
    a.classList.toggle("on", a.dataset.k === activo)
  );
 
  scrollTo(0, 0);
}
 
 
/* ---------------------------------------------------------------------
   7. INICIO
   --------------------------------------------------------------------- */
 
addEventListener("hashchange", route);
route();