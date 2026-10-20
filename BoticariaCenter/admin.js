/* BoticariaCenter · administración local del herbario. */
const STORAGE_KEY = "boticariacenter-v2";
const DEFAULT_PLANT_IMAGES = {
  ortiga: "assets/ortiga.jpg",
  ahuehuete: "assets/ahuehuete.jpg",
  amanita: "assets/amanita.jpg",
  romero: "assets/romero.jpg",
  nochebuena: "assets/nochebuena.jpg",
  sabila: "assets/sabila.jpg",
  dionea: "assets/carnivoras.jpg",
  amanita: "assets/amanita.jpg"
};
const DEFAULT_COPY = {
  hero: "Explora la inteligencia oculta de las plantas: un archivo vivo sobre sus tipos, propiedades, usos, hábitats y las leyendas que cada cultura ha tejido en torno a ellas.",
  sobre: "BoticariaCenter es una enciclopedia digital organizada por tipo de planta y por categoría de uso, con fichas científicas, hábitat, propiedades y leyendas con bibliografía.",
  autora: "Soy Cel, estudiante de Ingeniería en Desarrollo de Software. Creé este archivo para unir tecnología y naturaleza y acercar el conocimiento botánico a todos.",
  descubrir: "Cómo se clasifican las plantas, cuáles curan, cuáles son peligrosas, dónde viven y qué mitos las acompañan.",
  sectionHeaders: {sobre:"Sobre el proyecto",autora:"Quién soy y mi propósito",descubrir:"Lo que descubrirás"},
  extraSections: []
};
let BC_COPY = {...DEFAULT_COPY};
let adminTab = "plantas";
let editingPlantId = "";
let editingTaxonomyId = "";

function loadAdminData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved) {
      if (Array.isArray(saved.plants)) P.splice(0, P.length, ...saved.plants);
      if (Array.isArray(saved.types)) TIPOS.splice(0, TIPOS.length, ...saved.types);
      if (Array.isArray(saved.categories)) CATS.splice(0, CATS.length, ...saved.categories);
      BC_COPY = {...DEFAULT_COPY, ...(saved.copy || {})};
    }
  } catch (error) { console.warn("No se pudieron cargar los cambios locales.", error); }
  P.forEach(plant => { if (!plant.img && DEFAULT_PLANT_IMAGES[plant.id]) plant.img = DEFAULT_PLANT_IMAGES[plant.id]; });
}
function saveAdminData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({plants:P, types:TIPOS, categories:CATS, copy:BC_COPY}));
    const status = document.getElementById("admin-save-status");
    if (status) status.textContent = "Cambios guardados en este navegador";
    return true;
  } catch (error) {
    alert("No se pudieron guardar los cambios. Reduce el tamaño de las imágenes e inténtalo de nuevo.");
    return false;
  }
}
const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const field = (label, key, value, wide=false, area=false, placeholder="") => `<label class="admin-field ${wide?"wide":""}"><span>${label}</span>${area?`<textarea name="${key}" rows="3" placeholder="${placeholder}">${esc(value)}</textarea>`:`<input name="${key}" value="${esc(value)}" placeholder="${placeholder}" ${key==="id"?"required":""}>`}</label>`;
const selectField = (label,key,options,value) => `<label class="admin-field"><span>${label}</span><select name="${key}">${options.map(([id,name])=>`<option value="${esc(id)}" ${id===value?"selected":""}>${esc(name)}</option>`).join("")}</select></label>`;
function adminPlantList() {
  return `<div class="admin-list"><div class="admin-list-head"><span>ESPECIE</span><span>TIPO</span><span>IMAGEN</span><span>ACCIONES</span></div>${P.map(p=>`<div class="admin-list-row"><div class="admin-specimen">${p.img?`<img src="${esc(p.img)}" alt="">`:`<span class="admin-thumb-empty">＋</span>`}<span><b>${esc(p.n)}</b><small>${esc(p.c)}</small></span></div><span>${esc(by(TIPOS,p.t)?.[1]||"Sin clasificar")}</span><span class="admin-image-state ${p.img?"has-image":""}">${p.img?"Fotografía lista":"Sin imagen"}</span><span class="admin-row-actions"><button type="button" class="admin-small" data-edit-plant="${esc(p.id)}">Editar</button><button type="button" class="admin-small danger" data-delete-plant="${esc(p.id)}">Eliminar</button></span></div>`).join("")||`<p class="admin-empty">Aún no hay plantas. Añade la primera ficha.</p>`}</div>`;
}
function plantForm(plant={id:"",n:"",c:"",t:TIPOS[0]?.[0]||"",k:[],d:"",p:"",h:"",cl:"",u:"",img:""}) {
  const categories = CATS.map(([id,name])=>`<label class="admin-check"><input type="checkbox" name="category" value="${esc(id)}" ${plant.k?.includes(id)?"checked":""}>${esc(name)}</label>`).join("");
  return `<form id="plant-form" class="admin-form"><div class="admin-form-title"><div><span class="admin-eyebrow">${plant.id?"EDITAR EXPEDIENTE":"NUEVO EXPEDIENTE"}</span><h3>${plant.id?esc(plant.n):"Registrar una planta"}</h3></div>${plant.id?`<button type="button" class="admin-text-button" data-cancel-edit>Cancelar edición</button>`:""}</div><div class="admin-fields">${field("Identificador de ruta *","id",plant.id)}${field("Nombre común *","n",plant.n)}${field("Nombre científico","c",plant.c)}${selectField("Tipo de planta","t",TIPOS.map(t=>[t[0],t[1]]),plant.t)}<fieldset class="admin-field wide admin-category-set"><legend>Categorías</legend><div class="admin-checks">${categories}</div></fieldset>${field("Descripción","d",plant.d,true,true)}${field("Propiedades","p",plant.p,true,true)}${field("Hábitat","h",plant.h,true,true)}${field("Clasificación","cl",plant.cl)}${field("Uso principal","u",plant.u)}<label class="admin-field wide"><span>URL o ruta de la fotografía</span><input name="img" value="${esc(plant.img)}" placeholder="assets/mi-planta.jpg o https://…"><small>La ruta del catálogo o una URL de imagen.</small><input type="file" id="plant-image-file" accept="image/*"><small>También puedes seleccionar una foto; se optimiza y se guarda en este navegador.</small><img id="plant-image-preview" class="admin-image-preview ${plant.img?"visible":""}" src="${esc(plant.img)}" alt="Vista previa"></label></div><div class="admin-form-actions"><button class="admin-primary" type="submit">${plant.id?"Guardar cambios":"Añadir planta"}</button><span>Los cambios se aplican al catálogo al guardar.</span></div></form>`;
}
function taxonomyList(kind) {
  const isType=kind==="tipos", items=isType?TIPOS:CATS;
  return `<div class="admin-taxonomy-grid">${items.map((item,i)=>`<article class="admin-tax-card"><div class="admin-tax-icon">${item[4]?`<img src="${esc(item[4])}" alt="">`:esc(item[2])}</div><div><span class="admin-eyebrow">${isType?"TIPO":"CATEGORÍA"} · ${String(i+1).padStart(2,"0")}</span><h3>${esc(item[1])}</h3><p>${esc(item[3])}</p><small>${isType?P.filter(p=>p.t===item[0]).length:P.filter(p=>p.k.includes(item[0])).length} plantas asociadas</small></div><div class="admin-row-actions"><button type="button" class="admin-small" data-edit-tax="${esc(item[0])}" data-kind="${kind}">Editar</button><button type="button" class="admin-small danger" data-delete-tax="${esc(item[0])}" data-kind="${kind}">Eliminar</button></div></article>`).join("")}</div>`;
}
function taxonomyForm(kind,item=null) {
  const title=kind==="tipos"?"tipo de planta":"categoría";
  return `<form id="tax-form" class="admin-form"><div class="admin-form-title"><div><span class="admin-eyebrow">ESTRUCTURA DEL CATÁLOGO</span><h3>${item?"Editar":"Añadir"} ${title}</h3></div>${item?`<button type="button" class="admin-text-button" data-cancel-tax>Cancelar edición</button>`:""}</div><input type="hidden" name="kind" value="${kind}"><div class="admin-fields">${field("Identificador *","id",item?.[0]||"")}${field("Nombre visible *","name",item?.[1]||"")}${field("Símbolo de respaldo","emoji",item?.[2]||"🌿")}${field("Descripción","description",item?.[3]||"",true,true)}<label class="admin-field wide"><span>Imagen para la tarjeta (opcional)</span><input name="image" value="${esc(item?.[4]||"")}" placeholder="assets/helechos.jpg o https://…"><small>Usa una ruta dentro de assets/ o pega la URL de una imagen.</small><input type="file" id="taxonomy-image-file" accept="image/*"><small>O selecciona un archivo; se optimiza y guarda en este navegador.</small><img id="taxonomy-image-preview" class="admin-image-preview ${item?.[4]?"visible":""}" src="${esc(item?.[4]||"")}" alt="Vista previa"></label></div><div class="admin-form-actions"><button class="admin-primary">${item?"Guardar cambios":"Añadir"}</button></div></form>`;
}
const COPY_LABELS={hero:"Texto de portada",sobre:"Sobre el proyecto",autora:"Quién soy y mi propósito",descubrir:"Lo que descubrirás"};
function copyPanel(){return `<form id="copy-form" class="admin-form"><div class="admin-form-title"><div><span class="admin-eyebrow">CONTENIDO EDITORIAL</span><h3>Textos de la página</h3></div></div><div class="admin-fields">${Object.entries(COPY_LABELS).map(([key,label])=>`<label class="admin-field wide"><span>${label}</span><textarea name="${key}" rows="4">${esc(BC_COPY[key])}</textarea></label>`).join("")}</div><div class="admin-form-actions"><button class="admin-primary">Guardar textos</button><span>Se muestran en la página principal.</span></div></form><div class="admin-info-note"><b>Alcance de los cambios</b><p>Las modificaciones se guardan en el almacenamiento local de este navegador. No se publican ni se sincronizan en otros dispositivos.</p></div>`;}
function sectionsPanel(){
  const headings=[...[ ["sobre","Sobre el proyecto"],["autora","Quién soy y mi propósito"],["descubrir","Lo que descubrirás"] ].map(([id,placeholder])=>`<label class="admin-field"><span>Encabezado · ${placeholder}</span><input name="${id}" value="${esc(BC_COPY.sectionHeaders?.[id]||placeholder)}"></label>`)].join("");
  return `<form id="section-headings-form" class="admin-form"><div class="admin-form-title"><div><span class="admin-eyebrow">PORTADA · SECCIONES FIJAS</span><h3>Editar encabezados</h3></div></div><div class="admin-fields">${headings}</div><div class="admin-form-actions"><button class="admin-primary">Guardar encabezados</button></div></form><div class="admin-subhead sections-subhead"><div><span class="admin-eyebrow">PORTADA · BLOQUES AÑADIDOS</span><h3>Secciones personalizadas <span>${BC_COPY.extraSections?.length||0}</span></h3></div><button type="button" class="admin-primary" data-add-section>＋ Nueva sección</button></div><div class="admin-custom-sections">${(BC_COPY.extraSections||[]).map((item,index)=>`<form class="admin-form custom-section-form" data-section-index="${index}"><div class="admin-form-title"><div><span class="admin-eyebrow">SECCIÓN ${String(index+1).padStart(2,"0")}</span><h3>${esc(item.title||"Nueva sección")}</h3></div><div class="admin-row-actions"><button type="button" class="admin-small" data-move-section="up" data-index="${index}" aria-label="Mover sección arriba">↑</button><button type="button" class="admin-small" data-move-section="down" data-index="${index}" aria-label="Mover sección abajo">↓</button><button type="button" class="admin-small danger" data-delete-section="${index}">Eliminar</button></div></div><div class="admin-fields">${field("Título","title",item.title,true)}${field("Texto","text",item.text,true,true)}</div><div class="admin-form-actions"><button class="admin-primary">Guardar sección</button></div></form>`).join("")||`<p class="admin-empty">No hay bloques personalizados. Añade una sección para ampliar la portada.</p>`}</div>`;
}
function adminPage() {
  const tabs=[["plantas","Plantas",P.length],["tipos","Tipos",TIPOS.length],["categorias","Categorías",CATS.length],["secciones","Secciones",(BC_COPY.extraSections?.length||0)+3],["textos","Textos","✎"]];
  let body="";
  if(adminTab==="plantas") body=`<div class="admin-layout"><div class="admin-list-wrap"><div class="admin-subhead"><div><span class="admin-eyebrow">ARCHIVO VIVO</span><h3>Fichas de plantas <span>${P.length}</span></h3></div><button type="button" class="admin-primary" data-new-plant>＋ Nueva planta</button></div>${adminPlantList()}</div><aside class="admin-editor">${plantForm(editingPlantId?P.find(p=>p.id===editingPlantId)||{}:undefined)}</aside></div>`;
  else if(adminTab==="tipos"||adminTab==="categorias") {const isType=adminTab==="tipos";const item=(isType?TIPOS:CATS).find(x=>x[0]===editingTaxonomyId); body=`<div class="admin-subhead"><div><span class="admin-eyebrow">ORGANIZACIÓN</span><h3>${isType?"Tipos de plantas":"Categorías de uso"}</h3></div><button type="button" class="admin-primary" data-new-tax data-kind="${adminTab}">＋ Añadir ${isType?"tipo":"categoría"}</button></div>${taxonomyList(adminTab)}<div class="admin-editor taxonomy-editor">${taxonomyForm(adminTab,editingTaxonomyId?item:null)}</div>`;}
  else if(adminTab==="secciones") body=sectionsPanel();
  else body=copyPanel();
  return `<section class="admin-shell"><div class="admin-banner"><div><span class="admin-eyebrow">CENTRO DE CONTROL · EDICIÓN LOCAL</span><h1>Administración <i>botánica</i></h1><p>Gestiona las fichas, categorías y textos del archivo. Todo se edita manualmente.</p></div><div class="admin-banner-stat"><strong>${P.length.toString().padStart(2,"0")}</strong><span>ESPECÍMENES</span></div></div><div class="admin-notice"><span>●</span> MODO DE EDICIÓN LOCAL <small>Este navegador · sin sincronización remota</small><span id="admin-save-status">Cambios guardados en este navegador</span></div><div class="admin-tabs">${tabs.map(([id,label,count])=>`<button type="button" class="${adminTab===id?"active":""}" data-admin-tab="${id}">${label}<span>${count}</span></button>`).join("")}</div>${body}<div class="admin-footer-actions"><button type="button" class="admin-outline" data-export>Descargar copia de seguridad</button><label class="admin-outline admin-import-button">Restaurar copia JSON<input type="file" id="admin-import" accept="application/json,.json" hidden></label><a href="#/" class="admin-back-link">← Volver al sitio</a></div></section>`;
}
function adminInit() {
  const root=document.getElementById("app");
  root.querySelectorAll("[data-admin-tab]").forEach(button=>button.addEventListener("click",()=>{adminTab=button.dataset.adminTab;editingPlantId="";editingTaxonomyId="";route();}));
  root.querySelector("[data-new-plant]")?.addEventListener("click",()=>{editingPlantId=""; route(); root.querySelector("#plant-form input[name='id']")?.focus();});
  root.querySelectorAll("[data-edit-plant]").forEach(button=>button.addEventListener("click",()=>{editingPlantId=button.dataset.editPlant;route();}));
  root.querySelectorAll("[data-delete-plant]").forEach(button=>button.addEventListener("click",()=>{const p=P.find(x=>x.id===button.dataset.deletePlant);if(!p||!confirm(`¿Eliminar la ficha de ${p.n}? Esta acción no se puede deshacer.`))return;P.splice(P.indexOf(p),1);editingPlantId="";saveAdminData();route();}));
  root.querySelector("[data-cancel-edit]")?.addEventListener("click",()=>{editingPlantId="";route();});
  root.querySelector("#plant-form")?.addEventListener("submit",event=>{event.preventDefault();const f=new FormData(event.currentTarget);const id=String(f.get("id")).trim().toLowerCase().replace(/[^a-z0-9-]/g,"-");if(!id||!f.get("n").trim()){alert("El identificador y el nombre común son obligatorios.");return;}const obj={id,n:f.get("n").trim(),c:f.get("c").trim(),t:f.get("t"),k:[...root.querySelectorAll("input[name='category']:checked")].map(x=>x.value),d:f.get("d").trim(),p:f.get("p").trim(),h:f.get("h").trim(),cl:f.get("cl").trim(),u:f.get("u").trim(),img:f.get("img").trim()};const index=P.findIndex(x=>x.id===editingPlantId);if(index<0&&P.some(x=>x.id===id)){alert("Ese identificador ya existe. Elige uno diferente.");return;}if(index>=0){if(id!==editingPlantId&&P.some(x=>x.id===id)){alert("Ese identificador ya existe.");return;}P[index]=obj;}else P.push(obj);editingPlantId=id;saveAdminData();route();});
  root.querySelector("#plant-image-file")?.addEventListener("change",event=>{const file=event.target.files?.[0];if(!file)return;if(!file.type.startsWith("image/")){alert("Selecciona un archivo de imagen.");return;}const img=new Image();const reader=new FileReader();reader.onload=()=>{img.onload=()=>{const scale=Math.min(1,1000/Math.max(img.width,img.height));const canvas=document.createElement("canvas");canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);const url=canvas.toDataURL("image/jpeg",.78);root.querySelector("input[name='img']").value=url;const preview=root.querySelector("#plant-image-preview");preview.src=url;preview.classList.add("visible");};img.src=reader.result;};reader.readAsDataURL(file);});
  root.querySelectorAll("[data-new-tax]").forEach(button=>button.addEventListener("click",()=>{editingTaxonomyId="";route();document.querySelector("#tax-form input[name='id']")?.focus();}));
  root.querySelectorAll("[data-edit-tax]").forEach(button=>button.addEventListener("click",()=>{editingTaxonomyId=button.dataset.editTax;adminTab=button.dataset.kind;route();}));
  root.querySelectorAll("[data-cancel-tax]").forEach(button=>button.addEventListener("click",()=>{editingTaxonomyId="";route();}));
  root.querySelectorAll("[data-delete-tax]").forEach(button=>button.addEventListener("click",()=>{const type=button.dataset.kind==="tipos",list=type?TIPOS:CATS,item=list.find(x=>x[0]===button.dataset.deleteTax);if(!item)return;const used=P.some(p=>type?p.t===item[0]:p.k.includes(item[0]));if(used){alert("No se puede eliminar: hay plantas que todavía usan este elemento. Edita sus fichas primero.");return;}if(!confirm(`¿Eliminar “${item[1]}”?`))return;list.splice(list.indexOf(item),1);editingTaxonomyId="";saveAdminData();route();}));
  root.querySelector("#taxonomy-image-file")?.addEventListener("change",event=>{const file=event.target.files?.[0];if(!file)return;if(!file.type.startsWith("image/")){alert("Selecciona un archivo de imagen.");return;}const img=new Image(),reader=new FileReader();reader.onload=()=>{img.onload=()=>{const scale=Math.min(1,1000/Math.max(img.width,img.height)),canvas=document.createElement("canvas");canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);const url=canvas.toDataURL("image/jpeg",.78);root.querySelector("#tax-form input[name='image']").value=url;const preview=root.querySelector("#taxonomy-image-preview");preview.src=url;preview.classList.add("visible");};img.src=reader.result;};reader.readAsDataURL(file);});
  root.querySelector("#tax-form")?.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const isType = formData.get("kind") === "tipos";
    const list = isType ? TIPOS : CATS;
    const id = String(formData.get("id")).trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const name = String(formData.get("name")).trim();
    if (!id || !name) { alert("El identificador y el nombre son obligatorios."); return; }
    if (!editingTaxonomyId && list.some(item => item[0] === id)) { alert("Ese identificador ya existe."); return; }
    const item = [id, name, String(formData.get("emoji")).trim() || "🌿", String(formData.get("description")).trim(), String(formData.get("image") || "").trim()];
    const index = list.findIndex(entry => entry[0] === editingTaxonomyId);
    if (index >= 0) {
      if (id !== editingTaxonomyId && list.some(entry => entry[0] === id)) { alert("Ese identificador ya existe."); return; }
      if (id !== editingTaxonomyId && isType) P.forEach(plant => { if (plant.t === editingTaxonomyId) plant.t = id; });
      if (id !== editingTaxonomyId && !isType) P.forEach(plant => { plant.k = plant.k.map(category => category === editingTaxonomyId ? id : category); });
      list[index] = item;
    } else list.push(item);
    editingTaxonomyId = id;
    saveAdminData();
    route();
  });
  root.querySelector("#copy-form")?.addEventListener("submit",event=>{event.preventDefault();const f=new FormData(event.currentTarget);Object.keys(COPY_LABELS).forEach(key=>BC_COPY[key]=String(f.get(key)).trim());saveAdminData();route();});
  root.querySelector("#section-headings-form")?.addEventListener("submit",event=>{event.preventDefault();const f=new FormData(event.currentTarget);BC_COPY.sectionHeaders={sobre:String(f.get("sobre")).trim(),autora:String(f.get("autora")).trim(),descubrir:String(f.get("descubrir")).trim()};saveAdminData();route();});
  root.querySelector("[data-add-section]")?.addEventListener("click",()=>{BC_COPY.extraSections=BC_COPY.extraSections||[];BC_COPY.extraSections.push({title:"Nueva sección",text:""});saveAdminData();route();});
  root.querySelectorAll(".custom-section-form").forEach(form=>form.addEventListener("submit",event=>{event.preventDefault();const index=Number(form.dataset.sectionIndex),f=new FormData(form);BC_COPY.extraSections[index]={title:String(f.get("title")).trim(),text:String(f.get("text")).trim()};saveAdminData();route();}));
  root.querySelectorAll("[data-delete-section]").forEach(button=>button.addEventListener("click",()=>{const index=Number(button.dataset.deleteSection);if(!confirm("¿Eliminar esta sección de la portada?"))return;BC_COPY.extraSections.splice(index,1);saveAdminData();route();}));
  root.querySelectorAll("[data-move-section]").forEach(button=>button.addEventListener("click",()=>{const index=Number(button.dataset.index),target=index+(button.dataset.moveSection==="up"?-1:1),items=BC_COPY.extraSections;if(target<0||target>=items.length)return;[items[index],items[target]]=[items[target],items[index]];saveAdminData();route();}));
  root.querySelector("[data-export]")?.addEventListener("click",()=>{const blob=new Blob([JSON.stringify({plants:P,types:TIPOS,categories:CATS,copy:BC_COPY},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="boticariacenter-respaldo.json";a.click();URL.revokeObjectURL(a.href);});
  root.querySelector("#admin-import")?.addEventListener("change",event=>{const file=event.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(reader.result);if(!Array.isArray(data.plants)||!Array.isArray(data.types)||!Array.isArray(data.categories))throw Error("Formato incompleto");if(!confirm("Restaurar la copia reemplazará el contenido actual en este navegador. ¿Continuar?"))return;P.splice(0,P.length,...data.plants);TIPOS.splice(0,TIPOS.length,...data.types);CATS.splice(0,CATS.length,...data.categories);BC_COPY={...DEFAULT_COPY,...(data.copy||{})};saveAdminData();route();}catch(error){alert("El archivo no contiene una copia válida de BoticariaCenter.");}};reader.readAsText(file);});
}
loadAdminData();

