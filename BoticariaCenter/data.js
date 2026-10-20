/* =====================================================================
   BoticariaCenter · data.js
   Datos del sitio. Para ampliar el contenido solo edita este archivo.
   Debe cargarse ANTES que app.js.
   ===================================================================== */
 
 
/* ---------------------------------------------------------------------
   1. TIPOS DE PLANTAS
   Formato de cada fila: [id, nombre, emoji, descripción]
   --------------------------------------------------------------------- */
const TIPOS = [
  ["hierbas", "Hierbas", "🌿", "Plantas de tallo blando y ciclo corto; base de la alimentación y la medicina tradicional."],
  ["arbustos", "Arbustos", "🌳", "Plantas leñosas de varios tallos desde la base, de hasta unos 5 m."],
  ["arboles", "Árboles", "🌲", "Plantas leñosas de un tronco principal; regulan clima y agua y albergan ecosistemas."],
  ["suculentas", "Plantas suculentas", "🌵", "Almacenan agua en hojas o tallos para resistir la sequía."],
  ["trepadoras", "Plantas trepadoras", "🌱", "Alcanzan la luz usando soportes: zarcillos, raíces adventicias o tallos volubles."],
  ["epifitas", "Epífitas y hemiepífitas", "🌺", "Crecen sobre otras plantas sin parasitarlas; las hemiepífitas buscan el suelo después."],
  ["parasitas", "Parásitas", "🍃", "Toman agua y nutrientes de un huésped mediante haustorios."],
  ["saprofitas", "Saprófitas", "🍂", "Se nutren de materia en descomposición, a menudo vía hongos asociados."],
  ["hongos", "Hongos (Higerones)", "🍄", "Reino Fungi: no son plantas, pero se estudian junto a ellas. Reciclan la vida."],
  ["helechos", "Helechos", "🌾", "Plantas vasculares sin flores ni semillas; se reproducen por esporas."],
  ["musgos", "Musgos", "🟢", "Plantas no vasculares pequeñas que retienen agua y colonizan suelos pobres."],
  ["hepaticas", "Hepáticas", "🍀", "Briofitas de cuerpo aplanado (talo) de ambientes húmedos."],
  ["carnivoras", "Plantas carnívoras", "🪤", "Capturan insectos para complementar nutrientes en suelos pobres."]
];
 
 
/* ---------------------------------------------------------------------
   2. CATEGORÍAS DE USO
   Formato de cada fila: [id, nombre, emoji, descripción]
   --------------------------------------------------------------------- */
const CATS = [
  ["aromaticas", "Plantas aromáticas", "🌸", "Producen aceites esenciales que perfuman y condimentan."],
  ["ornamentales", "Plantas / flores ornamentales", "💐", "Cultivadas por su belleza: color, forma o aroma."],
  ["medicinales", "Plantas medicinales", "⚕️", "Con principios activos usados en medicina tradicional; base de muchos fármacos."],
  ["toxicas", "Plantas tóxicas o venenosas", "☠️", "Contienen compuestos dañinos; conocerlas previene accidentes."]
];
 
 
/* ---------------------------------------------------------------------
   3. PLANTAS
   Campos de cada planta:
     id  identificador único (se usa en la ruta #/planta/:id)
     n   nombre común
     c   nombre científico
     t   id del tipo (debe existir en TIPOS)
     k   ids de categorías (deben existir en CATS; puede ir vacío [])
     d   descripción
     p   propiedades
     h   hábitat
     cl  clasificación (familia botánica)
     u   uso primario
     img (opcional) ruta de una foto real, ej. "imagenes/ortiga.jpg"
     l   (opcional) leyenda: n nombre del relato, o país o civilización,
                              x texto del relato, b bibliografía
   --------------------------------------------------------------------- */
const P = [
  /* Ortiga · Hierbas */
  {
    id: "ortiga",
    n:  "Ortiga",
    c:  "Urtica dioica",
    t:  "hierbas",
    k:  ["medicinales"],
    d:  "Hierba perenne de hojas dentadas con pelos urticantes que liberan ácido fórmico e histamina.",
    p:  "Rica en hierro, calcio y vitaminas; diurética y antiinflamatoria tradicional.",
    h:  "Suelos ricos en nitrógeno, orillas de caminos y bosques húmedos templados.",
    cl: "Familia Urticaceae",
    u:  "Infusiones, sopas y fibras textiles",
    l: {
      n: "Los cisnes salvajes",
      o: "Dinamarca",
      x: "Elisa debe tejer once camisas de ortiga con las manos desnudas para romper el hechizo que convirtió a sus hermanos en cisnes.",
      b: "Andersen, H. C. (1838). Los cisnes salvajes (Vilde Svaner)."
    }
  },
 
  /* Romero · Arbustos */
  {
    id: "romero",
    n:  "Romero",
    c:  "Salvia rosmarinus",
    t:  "arbustos",
    k:  ["aromaticas", "medicinales"],
    d:  "Arbusto perenne de hojas lineales aromáticas y flores azul-lila.",
    p:  "Aceites esenciales (cineol, alcanfor); antioxidante y digestivo tradicional.",
    h:  "Costas y laderas soleadas del Mediterráneo; cultivado en todo el mundo.",
    cl: "Familia Lamiaceae",
    u:  "Cocina, perfumería e infusiones",
    l: {
      n: "El manto de la Virgen",
      o: "Tradición cristiana mediterránea",
      x: "Según el relato popular, María tendió su manto sobre un romero y sus flores blancas se volvieron azules.",
      b: "Tradición oral de herbarios populares europeos (verificar edición concreta)."
    }
  },
 
  /* Nochebuena · Arbustos */
  {
    id: "nochebuena",
    n:  "Nochebuena",
    c:  "Euphorbia pulcherrima",
    t:  "arbustos",
    k:  ["ornamentales"],
    d:  "Arbusto cuyas brácteas rojas parecen pétalos; la flor real es pequeña y amarilla.",
    p:  "Valor ornamental; su látex puede irritar la piel.",
    h:  "Bosques secos del sur de México.",
    cl: "Familia Euphorbiaceae",
    u:  "Decoración navideña",
    l: {
      n: "La flor de Nochebuena",
      o: "México",
      x: "Una niña sin regalo para el Niño Jesús ofreció unas ramas humildes que florecieron en rojo al llegar al altar.",
      b: "Tradición popular mexicana (versiones orales; verificar fuente impresa)."
    }
  },
 
  /* Ahuehuete · Árboles */
  {
    id: "ahuehuete",
    n:  "Ahuehuete",
    c:  "Taxodium mucronatum",
    t:  "arboles",
    k:  ["ornamentales"],
    d:  "Árbol longevo de tronco enorme, árbol nacional de México.",
    p:  "Sombra y regulación hídrica en riberas.",
    h:  "Orillas de ríos de México y sur de EE. UU.",
    cl: "Familia Cupressaceae",
    u:  "Ornamental y ecológico",
    l: {
      n: "El Árbol de la Noche Triste",
      o: "México (Imperio azteca)",
      x: "Se cuenta que Hernán Cortés lloró bajo un ahuehuete tras la derrota de 1520.",
      b: "Tradición histórica popular; verificar en crónicas (B. Díaz del Castillo, Historia verdadera...)."
    }
  },
 
  /* Sábila · Plantas suculentas */
  {
    id: "sabila",
    n:  "Sábila",
    c:  "Aloe vera",
    t:  "suculentas",
    k:  ["medicinales", "ornamentales"],
    d:  "Suculenta de hojas carnosas con gel mucilaginoso.",
    p:  "El gel se usa para la piel; el látex es laxante fuerte.",
    h:  "Zonas áridas; originaria de la península arábiga.",
    cl: "Familia Asphodelaceae",
    u:  "Cuidado de la piel"
  },
 
  /* Hiedra · Plantas trepadoras */
  {
    id: "hiedra",
    n:  "Hiedra",
    c:  "Hedera helix",
    t:  "trepadoras",
    k:  ["toxicas", "ornamentales"],
    d:  "Trepadora perenne que se aferra con raíces adventicias.",
    p:  "Bayas y hojas tóxicas si se ingieren; savia irritante.",
    h:  "Bosques y muros de Europa y Asia occidental.",
    cl: "Familia Araliaceae",
    u:  "Cobertura ornamental"
  },
 
  /* Orquídea mariposa · Epífitas y hemiepífitas */
  {
    id: "orquidea",
    n:  "Orquídea mariposa",
    c:  "Phalaenopsis amabilis",
    t:  "epifitas",
    k:  ["ornamentales"],
    d:  "Epífita de raíces aéreas verdosas y flores duraderas.",
    p:  "Indicadora de bosques húmedos sanos.",
    h:  "Selvas del sudeste asiático y Oceanía.",
    cl: "Familia Orchidaceae",
    u:  "Ornamental"
  },
 
  /* Muérdago · Parásitas */
  {
    id: "muerdago",
    n:  "Muérdago",
    c:  "Viscum album",
    t:  "parasitas",
    k:  ["toxicas"],
    d:  "Hemiparásito que crece sobre ramas de árboles.",
    p:  "Bayas tóxicas para humanos.",
    h:  "Bosques de Europa y Asia.",
    cl: "Familia Santalaceae",
    u:  "Adorno navideño",
    l: {
      n: "La muerte de Baldr",
      o: "Mitología nórdica",
      x: "Baldr, invulnerable a todo, murió por una flecha de muérdago, la única planta que no prometió no dañarlo.",
      b: "Snorri Sturluson. Edda prosaica (Gylfaginning), s. XIII."
    }
  },
 
  /* Planta fantasma · Saprófitas */
  {
    id: "monotropa",
    n:  "Planta fantasma",
    c:  "Monotropa uniflora",
    t:  "saprofitas",
    k:  [],
    d:  "Planta blanca sin clorofila que obtiene nutrientes vía hongos micorrícicos (técnicamente micoheterótrofa).",
    p:  "Objeto de estudio de redes fúngicas.",
    h:  "Bosques sombríos de Norteamérica y Asia.",
    cl: "Familia Ericaceae",
    u:  "Estudio científico"
  },
 
  /* Amanita muscaria · Hongos (Higerones) */
  {
    id: "amanita",
    n:  "Amanita muscaria",
    c:  "Amanita muscaria",
    t:  "hongos",
    k:  ["toxicas"],
    d:  "Hongo de sombrero rojo con escamas blancas.",
    p:  "Contiene muscimol e ibotenato; tóxico, no consumir.",
    h:  "Bosques templados con abedules y pinos.",
    cl: "Reino Fungi · Amanitaceae",
    u:  "Icono cultural"
  },
 
  /* Helecho macho · Helechos */
  {
    id: "helecho",
    n:  "Helecho macho",
    c:  "Dryopteris filix-mas",
    t:  "helechos",
    k:  ["ornamentales"],
    d:  "Helecho de frondas grandes que se reproduce por esporas.",
    p:  "Antiparasitario histórico; tóxico en dosis incorrectas.",
    h:  "Bosques húmedos templados.",
    cl: "Familia Dryopteridaceae",
    u:  "Ornamental",
    l: {
      n: "La flor del helecho",
      o: "Folclore eslavo",
      x: "En la noche de San Juan / Kupala el helecho florecería un instante y daría fortuna a quien lo hallara.",
      b: "Folclore eslavo y europeo sobre Kupala (verificar edición)."
    }
  },
 
  /* Musgo de turba · Musgos */
  {
    id: "esfagno",
    n:  "Musgo de turba",
    c:  "Sphagnum sp.",
    t:  "musgos",
    k:  [],
    d:  "Musgo que absorbe muchas veces su peso en agua.",
    p:  "Forma turberas que almacenan carbono.",
    h:  "Turberas frías y húmedas.",
    cl: "Familia Sphagnaceae",
    u:  "Sustrato de jardinería"
  },
 
  /* Hepática común · Hepáticas */
  {
    id: "marchantia",
    n:  "Hepática común",
    c:  "Marchantia polymorpha",
    t:  "hepaticas",
    k:  [],
    d:  "Hepática de talo aplanado con copitas de reproducción asexual.",
    p:  "Organismo modelo en genética vegetal.",
    h:  "Suelos húmedos y perturbados, mundial.",
    cl: "Familia Marchantiaceae",
    u:  "Investigación"
  },
 
  /* Atrapamoscas · Plantas carnívoras */
  {
    id: "dionea",
    n:  "Atrapamoscas",
    c:  "Dionaea muscipula",
    t:  "carnivoras",
    k:  ["ornamentales"],
    d:  "Hojas de dos lóbulos que se cierran al detectar presas.",
    p:  "Digiere insectos para obtener nitrógeno.",
    h:  "Humedales de Carolina del Norte y del Sur (EE. UU.).",
    cl: "Familia Droseraceae",
    u:  "Coleccionismo"
  },
 
  /* Adelfa · Arbustos */
  {
    id: "adelfa",
    n:  "Adelfa",
    c:  "Nerium oleander",
    t:  "arbustos",
    k:  ["toxicas", "ornamentales"],
    d:  "Arbusto de flores rosas muy vistosas.",
    p:  "Todas sus partes contienen glucósidos cardiotóxicos.",
    h:  "Cuencas mediterráneas y subtropicales.",
    cl: "Familia Apocynaceae",
    u:  "Exclusivamente ornamental"
  }
];