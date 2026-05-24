async function loadDatosBasicos(){
    try {
        const response = await fetch('https://nutret.es/Principal/logged', {
            method: 'GET',
        });
        
        if (!response.ok) {
            throw new Error('Error en la red: ' + response.statusText);
        }
        
        const data = await response.json();
        
        const datos = data;
        
        displayDatosBasicos(datos);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayDatosBasicos(datos) {

    let url = window.location.href;
    let actionURL = url.split("/");
    actionURL = actionURL[actionURL.length - 1];

    const divnavUser = document.getElementById("divnavUser");
    
    if(divnavUser){
        if(actionURL !== "loginView"){
            if(datos.result){
                if(datos.imagenUser !== null){
                    divnavUser.innerHTML = `<a href="/Perfil" class="enlaces urls"><img class="iconoPerfil" src="${datos.url}/storage/uploads/profile/${datos.imagenUser}" alt="Icono de el usuario" style="height: 40px; width: 40px; min-width: 40px; border-radius: 50%; border: 3px solid #fff; object-fit: cover; display: block;"></a>`;
                }else{
                    divnavUser.innerHTML = `<a href="/Perfil" class="enlaces urls"><img class="iconoPerfil urls" src="/public/img/user.png" alt="Icono de el usuario" style="height: 2.5vh; width: 2.5vh;"></a>`;
                }
            }else{
                divnavUser.innerHTML = `<a class="enlaces urls" href="/Principal/loginView">Inicio Sesión</a>
                            <a class="enlaces urls" id="registro" href="/Principal/resgistro">Registrarse</a>`;
            }
        }
    }
    
    
    let urlBase = datos.url;
    
    document.querySelectorAll(".urls").forEach(element => {
        
        if(element.hasAttribute("href")){
            element.setAttribute("href", urlBase + element.getAttribute("href"));    
        }else if(element.hasAttribute("src")){
            element.setAttribute("src", urlBase + element.getAttribute("src"));
        }else if(element.hasAttribute("action")){
            element.setAttribute("action", urlBase + element.getAttribute("action"));
        }

    });
        
}

window.addEventListener("load", function() {
    loadDatosBasicos();
});

var peticionesRestantes = null;
var nombresDeRecetasYaMostradas = [];
var recetaActual = null;
var nombreDeElArchivo = null;
var cantidadPersonas = 2;



async function loadPeticionesRestantes(){
    try {
        const response = await fetch('https://nutret.es/Generar/getPeticionesRestantes', {
            method: 'GET',
        });
        
        if (!response.ok) {
            throw new Error('Error en la red: ' + response.statusText);
        }
        
        const data = await response.json();
        
        peticionesRestantes = data.peticionesRestantes;
        document.getElementById("btnGenerar").textContent = `Generar (${peticionesRestantes} restantes)`;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function checkTotalIngredientes(){
    try {
        const response = await fetch('https://nutret.es/Despensa/totalIngredientesDespensa', {
            method: 'GET',
        });
        
        if (!response.ok) {
            throw new Error('Error en la red: ' + response.statusText);
        }
        
        const data = await response.json();
        
        const totalIngredientes = data.totalIngredientes;
        const btnGenerar = document.getElementById("btnGenerar");
        const advertenciaDiv = document.getElementById("advertenciaIngredientes");
        
        if (totalIngredientes < 5) {
            btnGenerar.disabled = true;
            btnGenerar.classList.add("opacity-50", "cursor-not-allowed");
            if (advertenciaDiv) {
                advertenciaDiv.style.display = "block";
            }
        } else {
            btnGenerar.disabled = false;
            btnGenerar.classList.remove("opacity-50", "cursor-not-allowed");
            if (advertenciaDiv) {
                advertenciaDiv.style.display = "none";
            }
        }
    } catch (error) {
        console.error('Error al verificar ingredientes:', error);
    }
}

window.onload = function() {
    loadPeticionesRestantes();
    checkTotalIngredientes();
};

function recogerDatos() {
    const datosArray = [];
    
    // Radio buttons
    datosArray.push(document.querySelector('input[name="tipo"]:checked')?.value);
    datosArray.push(document.querySelector('input[name="tiempo"]:checked')?.value);
    datosArray.push(document.querySelector('input[name="dificultad"]:checked')?.value);
    //datosArray.push(document.querySelector('input[name="porciones"]:checked')?.value);
    datosArray.push(cantidadPersonas + " personas");
    
    // Checkboxes - agregar cada uno al array
    document.querySelectorAll('#dieta input:checked').forEach(cb => {
        datosArray.push(cb.value);
    });
    
    document.querySelectorAll('#cocina input:checked').forEach(cb => {
        datosArray.push(cb.value);
    });
    
    return datosArray;
}



async function loadPeticionGenerar(event){
    event.preventDefault();
    document.getElementById("btnGenerar").disabled = true;
    let recetasExcluidas = null;

    if(nombresDeRecetasYaMostradas.length == 0){
        recetasExcluidas = null;
    }else{
        recetasExcluidas = nombresDeRecetasYaMostradas;
    }
    
    
    try {

        const caracteristicasSeleccionadas = recogerDatos();
        const response = await fetch('https://nutret.es/Generar/generarRecetas', {
            method: 'POST',
            body: JSON.stringify({
                recetasExcluidas: recetasExcluidas,
                caracteristicas: caracteristicasSeleccionadas
            }),
        });
        
        if (!response.ok) {
            throw new Error('Error en la red: ' + response.statusText);
        }

        //const dataText = await response.text();
        
        const data = await response.json();

        if (data.result === 'Correct' && data.receta) {
            guardarReceta(data.receta);
            displayPeticionGenerar(data.receta);
            loadPeticionesRestantes();
        } else if(data.result === 'Error generating recipe') {
            alert("Ha ocurrido algo inesperado. Espera un momento.")
            loadPeticionesRestantes();
        } else {
            console.warn('No se ha recibido receta válida:', data);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

function displayPeticionGenerar(recetaData) {
    // ── Extraer la receta correctamente según la estructura del servidor ──────
    // Estructura: recetaData.receta.recipe
    const recipe = recetaData?.receta?.recipe
                || recetaData?.recipe
                || recetaData?.recipes?.[0]
                || recetaData;
 
    if (!recipe) {
        console.error('Receta inválida recibida:', recetaData);
        return;
    }
 
    nombresDeRecetasYaMostradas.push(recipe.name);
    document.getElementById("btnGenerar").disabled = false;
    recetaActual = recetaData;
 
    const DIFF_LABEL = {
        beginner:     'Principiante',
        easy:         'Fácil',
        fácil:        'Fácil',
        intermediate: 'Intermedio',
        advanced:     'Avanzado',
    };
 
    // ── Ingredientes ──────────────────────────────────────────────────────────
    const ingredientesHTML = Array.isArray(recipe.ingredients)
        ? recipe.ingredients.map(i => `
            <li class="flex items-center gap-4 text-on-surface-variant font-medium">
                <span class="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                ${i.quantity ?? '-'} ${i.unit ?? ''} de <strong>${escapeHtml(i.item ?? '')}</strong>
            </li>`).join('')
        : '<li>No hay ingredientes disponibles.</li>';
 
    // ── Pasos ─────────────────────────────────────────────────────────────────
    const pasosHTML = Array.isArray(recipe.steps)
        ? recipe.steps.map((s, idx) => `
            <div class="flex gap-4">
                <span class="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm">
                    ${idx + 1}
                </span>
                <p class="text-on-surface-variant leading-relaxed">
                    ${s.technique ? `<strong>${escapeHtml(s.technique)}:</strong> ` : ''}
                    ${escapeHtml(s.description || '')}
                    ${s.timeMin ? `<em class="text-sm opacity-60"> (${s.timeMin} min)</em>` : ''}
                </p>
            </div>`).join('')
        : '<p>No hay pasos disponibles.</p>';
 
    // ── Variaciones (opcional) ────────────────────────────────────────────────
    const variacionesHTML = Array.isArray(recipe.variations) && recipe.variations.length
        ? `<div class="mt-10">
            <h3 class="text-xl font-bold flex items-center gap-3 border-b border-outline-variant/15 pb-4 mb-6">
                <span class="bg-primary/10 p-2 rounded-lg">
                    <span class="material-symbols-outlined text-primary">tune</span>
                </span>
                Variaciones
            </h3>
            <ul class="space-y-3">
                ${recipe.variations.map(v => `
                    <li class="flex items-start gap-3 text-on-surface-variant">
                        <span class="w-2 h-2 bg-secondary rounded-full flex-shrink-0 mt-2"></span>
                        <span><strong>${escapeHtml(v.name)}:</strong> ${escapeHtml(v.modification)}</span>
                    </li>`).join('')}
            </ul>
           </div>`
        : '';
 
    // ── Errores comunes (opcional) ────────────────────────────────────────────
    const erroresHTML = Array.isArray(recipe.commonMistakes) && recipe.commonMistakes.length
        ? `<div class="mt-10">
            <h3 class="text-xl font-bold flex items-center gap-3 border-b border-outline-variant/15 pb-4 mb-6">
                <span class="bg-primary/10 p-2 rounded-lg">
                    <span class="material-symbols-outlined text-primary">warning</span>
                </span>
                Errores comunes
            </h3>
            <ul class="space-y-3">
                ${recipe.commonMistakes.map(e => `
                    <li class="flex items-start gap-3 text-on-surface-variant">
                        <span class="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></span>
                        <span>${escapeHtml(e.mistake)}</span>
                    </li>`).join('')}
            </ul>
           </div>`
        : '';
 
    // ── Nutrición (opcional) ──────────────────────────────────────────────────
    const nutr = recipe.nutritionPer100g;
    const nutricionHTML = nutr
        ? `<div class="mt-10">
            <h3 class="text-xl font-bold flex items-center gap-3 border-b border-outline-variant/15 pb-4 mb-6">
                <span class="bg-primary/10 p-2 rounded-lg">
                    <span class="material-symbols-outlined text-primary">nutrition</span>
                </span>
                Nutrición por 100g
            </h3>
            <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
                ${nutr.calories  != null ? `<div class="bg-surface-container rounded-xl p-3 text-center"><p class="font-bold text-lg">${nutr.calories}</p><p class="text-xs text-on-surface-variant">kcal</p></div>` : ''}
                ${nutr.protein   != null ? `<div class="bg-surface-container rounded-xl p-3 text-center"><p class="font-bold text-lg">${nutr.protein}g</p><p class="text-xs text-on-surface-variant">proteína</p></div>` : ''}
                ${nutr.carbs     != null ? `<div class="bg-surface-container rounded-xl p-3 text-center"><p class="font-bold text-lg">${nutr.carbs}g</p><p class="text-xs text-on-surface-variant">carbos</p></div>` : ''}
                ${nutr.fat       != null ? `<div class="bg-surface-container rounded-xl p-3 text-center"><p class="font-bold text-lg">${nutr.fat}g</p><p class="text-xs text-on-surface-variant">grasa</p></div>` : ''}
                ${nutr.fiber     != null ? `<div class="bg-surface-container rounded-xl p-3 text-center"><p class="font-bold text-lg">${nutr.fiber}g</p><p class="text-xs text-on-surface-variant">fibra</p></div>` : ''}
                ${nutr.sodium    != null ? `<div class="bg-surface-container rounded-xl p-3 text-center"><p class="font-bold text-lg">${nutr.sodium}mg</p><p class="text-xs text-on-surface-variant">sodio</p></div>` : ''}
            </div>
           </div>`
        : '';
 
    // ── HTML completo del contenido ───────────────────────────────────────────
    const modalContentHTML = `
        <!-- Botón cerrar — esquina superior izquierda -->
        <div class="relative p-4">
            <button
                class="w-10 h-10 bg-surface hover:bg-surface-container text-on-surface rounded-full flex items-center justify-center transition-all active:scale-90 shadow-sm border border-outline-variant/20"
                id="modalGenerarRecetaClose" onclick="closeModal()">
                <span class="material-symbols-outlined text-xl">close</span>
            </button>
        </div>
 
        <div class="modal-body p-8 md:p-12 pt-2 relative">
            <div class="bg-surface rounded-xl p-8 shadow-sm">
 
                <!-- Cabecera: título + botón favoritos -->
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div class="space-y-2">
                        <span class="text-primary font-bold text-sm uppercase tracking-widest">Receta Generada</span>
                        <h2 class="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight">
                            ${escapeHtml(recipe.name || 'Receta')}
                        </h2>
                        <div class="flex flex-wrap gap-4 pt-4">
                            ${recipe.servings ? `
                            <div class="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full text-sm font-semibold">
                                <span class="material-symbols-outlined text-primary text-lg">group</span>
                                ${recipe.servings} Porciones
                            </div>` : ''}
                            ${recipe.difficulty ? `
                            <div class="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full text-sm font-semibold">
                                <span class="material-symbols-outlined text-primary text-lg">bolt</span>
                                ${DIFF_LABEL[recipe.difficulty] || recipe.difficulty}
                            </div>` : ''}
                            ${recipe.totalTimeMin ? `
                            <div class="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full text-sm font-semibold">
                                <span class="material-symbols-outlined text-primary text-lg">schedule</span>
                                ${recipe.totalTimeMin} min
                            </div>` : ''}
                            ${recipe.cuisine ? `
                            <div class="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full text-sm font-semibold">
                                <span class="material-symbols-outlined text-primary text-lg">restaurant</span>
                                ${escapeHtml(recipe.cuisine)}
                            </div>` : ''}
                        </div>
                    </div>
 
                    <button
                        class="flex items-center gap-3 bg-tertiary-container text-on-tertiary-container hover:bg-tertiary text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 whitespace-nowrap"
                        id="openModalBtn" onclick="openModal()">
                        <span class="material-symbols-outlined" data-weight="fill">favorite</span>
                        Añadir a favoritos
                    </button>
                </div>
 
                <!-- Ingredientes + Pasos -->
                <div class="grid md:grid-cols-2 gap-16">
 
                    <div class="space-y-8">
                        <h3 class="text-xl font-bold flex items-center gap-3 border-b border-outline-variant/15 pb-4">
                            <span class="bg-primary/10 p-2 rounded-lg">
                                <span class="material-symbols-outlined text-primary">shopping_basket</span>
                            </span>
                            Ingredientes
                        </h3>
                        <ul class="space-y-4">
                            ${ingredientesHTML}
                        </ul>
                    </div>
 
                    <div class="space-y-8">
                        <h3 class="text-xl font-bold flex items-center gap-3 border-b border-outline-variant/15 pb-4">
                            <span class="bg-primary/10 p-2 rounded-lg">
                                <span class="material-symbols-outlined text-primary">skillet</span>
                            </span>
                            Pasos de Preparación
                        </h3>
                        <div class="space-y-6">
                            ${pasosHTML}
                        </div>
                    </div>
 
                </div>
 
                <!-- Secciones opcionales -->
                ${nutricionHTML}
                ${variacionesHTML}
                ${erroresHTML}
 
            </div>
        </div>
    `;
 
    // ── Inyectar estilos una sola vez ─────────────────────────────────────────
    injectModalStyles();
 
    // ── Reutilizar modal existente o crear uno nuevo ──────────────────────────
    const existing = document.getElementById('modalGenerarReceta');
    if (existing) {
        const content = existing.querySelector('.modal-receta-content');
        if (content) {
            content.innerHTML = modalContentHTML;
        } else {
            existing.innerHTML = `
                <div class="modal-receta-backdrop" id="modalGenerarRecetaBackdrop"></div>
                <div class="modal-receta-content">${modalContentHTML}</div>
            `;
        }
        existing.classList.add('open');
        existing.style.display = 'flex';
        bindModalEvents(existing);
        return;
    }
 
    const modal = document.createElement('div');
    modal.id = 'modalGenerarReceta';
    modal.className = 'modal-receta open';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-receta-backdrop" id="modalGenerarRecetaBackdrop"></div>
        <div class="modal-receta-content">
            ${modalContentHTML}
        </div>
    `;

    const contentEl = document.querySelector('.modal-receta-content');
    if (contentEl) {
        contentEl.style.width = '100%';
        contentEl.style.maxWidth = '1100px';
    }
 
    document.body.appendChild(modal);
    bindModalEvents(modal);
}
 
// ── Eventos del modal ─────────────────────────────────────────────────────────
function bindModalEvents(modal) {
    const closeModal = () => {
        modal.classList.remove('open');
        modal.style.display = 'none';
    };
 
    const closeBtn = document.getElementById('modalGenerarRecetaClose');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
 
    const backdrop = document.getElementById('modalGenerarRecetaBackdrop');
    if (backdrop) backdrop.addEventListener('click', closeModal);
 
    const saveBtn = document.getElementById('openModalBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            try {
                document.getElementById('feedbackModal').style.display = 'flex';
            } catch (err) {
                console.error('Error abriendo modal de favoritos:', err);
            }
        });
    }

    // Event listeners for feedback modal
    const closeFeedbackBtn = document.getElementById('closeFeedbackModal');
    if (closeFeedbackBtn) {
        closeFeedbackBtn.addEventListener('click', () => {
            document.getElementById('feedbackModal').style.display = 'none';
        });
    }

    const cancelFeedbackBtn = document.getElementById('cancelFeedbackBtn');
    if (cancelFeedbackBtn) {
        cancelFeedbackBtn.addEventListener('click', () => {
            document.getElementById('feedbackModal').style.display = 'none';
        });
    }

    const feedbackModalBackdrop = document.querySelector('#feedbackModal > div:first-child');
    if (feedbackModalBackdrop) {
        feedbackModalBackdrop.addEventListener('click', () => {
            document.getElementById('feedbackModal').style.display = 'none';
        });
    }
 
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    });
}
 
// ── Estilos ───────────────────────────────────────────────────────────────────
function injectModalStyles() {
    const existing = document.getElementById('modalGenerarRecetaStyles') 
                  || document.getElementById('modal-receta-styles');
    if (existing) existing.remove();

    const style = document.createElement('style');
    style.id = 'modal-receta-styles';
    style.textContent = `
        .modal-receta {
            position: fixed;
            inset: 0;
            z-index: 1000;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }
 
        .modal-receta-backdrop {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
        }
 
        .modal-receta-content {
            position: relative;
            z-index: 10;
            background: white;
            border-radius: 20px;
            width: 95% !important;
            max-width: 1100px !important;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
            animation: modalIn 0.25s ease;
        }
 
        @keyframes modalIn {
            from { opacity: 0; transform: translateY(20px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
        }
 
        .modal-receta-content::-webkit-scrollbar { width: 5px; }
        .modal-receta-content::-webkit-scrollbar-track { background: transparent; }
        .modal-receta-content::-webkit-scrollbar-thumb {
            background: rgba(0,0,0,0.15);
            border-radius: 10px;
        }
    `;
 
    document.head.appendChild(style);
}

document.getElementById("btnMas").addEventListener("click", function(){
    if(cantidadPersonas < 20){
        cantidadPersonas++;
        document.getElementById("cantidadPersonas").textContent = cantidadPersonas;
    }
});

document.getElementById("btnMenos").addEventListener("click", function(){
    if(cantidadPersonas > 1){
        cantidadPersonas--;
        document.getElementById("cantidadPersonas").textContent = cantidadPersonas;
    }
});

async function guardarReceta(recetaData) {
    const response = await fetch('https://nutret.es/Recetas/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "receta": recetaData ,
            "categoria": recetaData.course || "main"
        })
    });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`HTTP ${response.status}: ${body}`);
    }

    const result = await response.json();
    
    if (!result.result || result.result !== 'Correct') {
        throw new Error('Respuesta del servidor inválida: ' + JSON.stringify(result));
    }
    nombreDeElArchivo = result.nombreArchivo;

    return result;
}

function injectModalStyles2() {
    if (document.getElementById('modalGenerarRecetaStyles')) return;

    const style = document.createElement('style');
    style.id = 'modalGenerarRecetaStyles';
    style.textContent = `
        .modal-receta {
            position: fixed;
            inset: 0;
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            background: rgba(0, 0, 0, 0.6);
        }
        .modal-receta.open {
            display: flex;
        }
        .modal-receta-content {
            background: #fff;
            border-radius: 8px;
            max-width: 90%;
            max-height: 90%;
            overflow-y: auto;
            box-shadow: 0 8px 24px rgba(0,0,0,0.35);
            padding: 1.2rem;
            width: min(760px, 100%);
            position: relative;
        }
        .modal-receta-close {
            position: absolute;
            top: 10px;
            right: 10px;
            border: none;
            background: transparent;
            font-size: 1.8rem;
            cursor: pointer;
        }
        .modal-receta-backdrop {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.5);
        }
        .modal-body {
            position: relative;
            z-index: 1;
        }
    `;
    document.head.appendChild(style);
}


function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function marcarBotonFavoritoComoActivo() {
    const favoritoBtn = document.getElementById("openModalBtn");
    if (!favoritoBtn) return;

    favoritoBtn.className = 'flex items-center gap-3 bg-primary text-on-primary px-8 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 whitespace-nowrap';
    favoritoBtn.innerHTML = '<span class="material-symbols-outlined" data-weight="fill">favorite</span> En favoritos';
    favoritoBtn.onclick = openModal;
}

async function guardarRecetaEnFavoritos() {
    try {
        const rating = document.querySelector('input[name="rating"]:checked');
        const comentario = document.getElementById("commentInput").value;

        if (!rating) {
            alert("Selecciona una valoración");
            return;
        }

        const response = await fetch('https://nutret.es/Recetas/guardarFavorito', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {
                "nombreArchivo" : nombreDeElArchivo,
                "calificacion" : rating.value,
                "comentario" : comentario
            } )
        });
        
        if (!response.ok) {
            throw new Error('Error en la red: ' + response.statusText);
        }
        
        const data = await response.json();
        
        const datos = data;
        
        alert("Añadido con éxito a favoritos");
        document.getElementById("feedbackModal").style.display = "none";
        marcarBotonFavoritoComoActivo();
    } catch (error) {
        console.error('Error:', error);
    }

}

const modal = document.getElementById("feedbackModal");
const openBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementById("closeModalBtn");
const confirmBtn = document.getElementById("confirmBtn");

openBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});

function openModal(){
    modal.style.display = "flex";
}

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

function closeModal(){
    modal.style.display = "none";
}