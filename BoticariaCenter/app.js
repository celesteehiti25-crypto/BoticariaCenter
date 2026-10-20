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
  return `<div class="photo-placeholder"><span class="placeholder-mark">✳</span><b>REGISTRO BOTÁNICO</b><small>Fotografía por añadir</small></div>`;
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
 
/**
 * Devuelve una fotografía de la planta si existe.
 * En caso contrario, genera una ilustración SVG.
 */
const imagen = p => p.img
    ? `<img class="plant-photo" src="${p.img}" alt="${p.n}" loading="lazy">`
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
const gc = (href, emoji, titulo, subtitulo, codigo, photo = "") => `
  <a class="cd" href="${href}">
    <div class="im">
      <span class="cdn">${codigo}</span>
      ${photo
        ? `<img class="taxonomy-photo" src="${photo}" alt="${titulo}" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="ph" hidden>${emoji}</div>`
        : `<div class="ph">${emoji}</div>`}
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
 
/**
 * Aplica los filtros y la búsqueda al catálogo.
 * Comprueba que los elementos del catálogo existan
 * antes de modificar el documento.
 */
function draw() {

    const grid = $("g");
    const contador = $("rc");

    // Evita errores si la vista actual no contiene el catálogo.
    if (!grid || !contador) {
        return;
    }

    const lista = P.filter(p => {

        const coincideFiltro =
            F === "todos" || p.k.includes(F);

        const texto = `${p.n} ${p.c} ${p.u}`.toLowerCase();

        const coincideBusqueda = texto.includes(Q);

        return coincideFiltro && coincideBusqueda;
    });

    // Actualiza las tarjetas.
    grid.innerHTML = lista.map(pc).join("")
        || "<p>Sin resultados.</p>";

    // Actualiza el contador.
    contador.textContent = `${lista.length} REGISTROS`;

    // Actualiza la apariencia del filtro seleccionado.
    document.querySelectorAll(".tabs button").forEach(b => {
        b.classList.toggle("on", b.dataset.f === F);
    });
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
        <p>${esc(BC_COPY.hero)}</p>
        <div class="sr">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2de2d0" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
          <input placeholder="Buscar por nombre, especie o uso..." oninput="setQ(this.value)">
          <span id="rc"></span>
        </div>
      </section>
 
      ${encabezado("01 / COLECCIÓN", "Especímenes catalogados", `<div class="tabs">${pestanas}</div>`)}
      <div class="grid" id="g"></div>

      <section class="home-about" aria-label="Información del proyecto">
        ${panel(esc(BC_COPY.sobre), esc(BC_COPY.sectionHeaders?.sobre || "Sobre el proyecto"))}
        ${panel(esc(BC_COPY.autora), esc(BC_COPY.sectionHeaders?.autora || "Quién soy y mi propósito"))}
        ${panel(esc(BC_COPY.descubrir), esc(BC_COPY.sectionHeaders?.descubrir || "Lo que descubrirás"))}
        ${(BC_COPY.extraSections || []).map(section => panel(esc(section.text), esc(section.title))).join("")}
      </section>`;
  },
 
  /* ---- Tipos de plantas ---- */
  tipos() {
    const tarjetas = TIPOS.map((t, i) => gc(
      "#/tipos/" + t[0], t[2], t[1],
      P.filter(p => p.t === t[0]).length + " especímenes",
      "TP-" + String(i + 1).padStart(2, "0"), t[4] || ""
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
      "CT-0" + (i + 1), c[4] || ""
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
  else if (seccion === "admin")     vista = adminPage();
  else                              vista = R.nf();
 
  $("app").innerHTML = vista;
 
  // Resalta el enlace activo del menú (la ficha cuenta como "tipos")
  const activo = seccion === "planta" ? "tipos" : (seccion || "");
  document.querySelectorAll("#nv a").forEach(a =>
    a.classList.toggle("on", a.dataset.key === activo)
  );
 
  if (seccion === "admin") adminInit();
  scrollTo(0, 0);
}
 
 
/* ---------------------------------------------------------------------
   7. INICIO
   --------------------------------------------------------------------- */
 
addEventListener("hashchange", route);
route();
