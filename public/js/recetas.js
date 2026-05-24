// Funciones de indicador de carga para recetas
function createRecetasLoadingStyles() {
    if (document.getElementById('recetas-loading-styles')) return;

    const style = document.createElement('style');
    style.id = 'recetas-loading-styles';
    style.textContent = `
        @keyframes recetas-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .recetas-loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 99999;
            gap: 1rem;
            font-family: 'Manrope', sans-serif;
            color: #222;
            text-align: center;
            padding: 1rem;
        }
        .recetas-loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(0, 0, 0, 0.15);
            border-top-color: #2D6A4F;
            border-radius: 50%;
            animation: recetas-spin 1s linear infinite;
        }
        .recetas-loading-text {
            font-size: 1rem;
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);
}

function showRecetasLoading() {
    createRecetasLoadingStyles();
    if (document.getElementById('recetasLoadingOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'recetasLoadingOverlay';
    overlay.className = 'recetas-loading-overlay';
    overlay.innerHTML = `
        <div class="recetas-loading-spinner"></div>
        <div class="recetas-loading-text">Cargando recetas...</div>
    `;
    document.body.appendChild(overlay);
}

function hideRecetasLoading() {
    const overlay = document.getElementById('recetasLoadingOverlay');
    if (overlay) {
        overlay.remove();
    }
}

// Función para cargar y mostrar las recetas al iniciar la página
async function loadRecetas() {
    showRecetasLoading();
    try {
        const response = await fetch('https://nutret.es/Recetas/recetasGeneradas', {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Error en la red: ' + response.statusText);
        }

        const data = await response.json();

        if (data.result === 'Correct' && data.recetasGeneradas) {
            displayRecetas(data.recetasGeneradas);
        } else {
            console.warn('❌ No se han recibido recetas válidas:', data);
        }

    } catch (error) {
        console.error('❌ Error al cargar recetas:', error);
    } finally {
        hideRecetasLoading();
    }
}

// Función para mostrar las recetas en las secciones correspondientes
function displayRecetas(recetas) {
    // Validar y obtener todas las secciones
    const sections = {
        fav: document.getElementById('recetasFav'),
        main: document.getElementById('recetasMain'),
        dessert: document.getElementById('recetasDessert'),
        snack: document.getElementById('recetasSnack'),
        side: document.getElementById('recetasSide'),
        breakfast: document.getElementById('recetasBreakfast'),
        starter: document.getElementById('recetasStarter')
    };

    // Verificar que las secciones existan
    const missingElements = Object.entries(sections)
        .filter(([, el]) => !el)
        .map(([key]) => key);
    
    if (missingElements.length > 0) {
        console.error('❌ Elementos HTML no encontrados:', missingElements);
        return;
    }

    // Limpiar contenido solo de secciones que serán populadas dinámicamente
    // Nota: recetasMain y recetasBreakfast tienen contenido estático, no los limpiamos
    const dynamicSections = ['recetasDessert', 'recetasSnack', 'recetasSide', 'recetasStarter'];
    dynamicSections.forEach(sectionId => {
        if (sections[sectionId]) {
            sections[sectionId].innerHTML = '';
        }
    });

    // Contador de recetas por sección
    const count = { main: 0, dessert: 0, snack: 0, side: 0, breakfast: 0, starter: 0 };

    // Procesar cada receta
    recetas.forEach((receta, index) => {
        try {
            // Parse del JSON
            const recetaData = JSON.parse(receta.receta);
            const recipe = recetaData.recipe || recetaData;

            // Determinar la categoría (course)
            const course = (recipe.course || 'main').toLowerCase();
            const sectionKey = mapCourseToSection(course);


            if (sections[sectionKey]) {
                const cardHTML = createRecipeCard(receta, recipe);
                sections[sectionKey].innerHTML += cardHTML;
                count[sectionKey]++;
            } else {
                console.warn(`  ⚠️  No existe sección para: ${sectionKey}`);
            }
        } catch (error) {
            console.error(`❌ Error procesando receta ${index + 1}:`, receta, error);
        }
    });

    // Agregar mensajes en secciones vacías y mostrar/ocultar secciones
    const staticSections = ['recetasMain', 'recetasBreakfast']; // Estas tienen contenido HTML estático

    Object.entries(count).forEach(([section, total]) => {
        const sectionElement = sections[section];
        const containerElement = sectionElement.closest('.mb-16');

        if (dynamicSections.includes(section)) {
            // Para secciones dinámicas: mostrar solo si tienen recetas
            if (total === 0) {
                if (containerElement) {
                    containerElement.style.display = 'none';
                }
            } else {
                if (containerElement) {
                    containerElement.style.display = 'block';
                }
            }
        }
        // Para secciones estáticas: siempre visibles (tienen contenido HTML)
    });

    // Mostrar resumen
    //Object.entries(count).forEach(([section, total]) => {
    //    console.log(`  ${section}: ${total} recetas`);
    //});
}

// Función para mapear el course a la sección del HTML
function mapCourseToSection(course) {
    const mapping = {
        'main': 'main',
        'plato principal': 'main',
        'principal': 'main',
        'dessert': 'dessert',
        'postre': 'dessert',
        'snack': 'snack',
        'side': 'side',
        'acompañamiento': 'side',
        'breakfast': 'breakfast',
        'desayuno': 'breakfast',
        'starter': 'starter',
        'entrante': 'starter',
        'appetizer': 'starter'
    };
    return mapping[course] || 'main'; // Default a main
}

// Función para crear el HTML de una tarjeta de receta
function createRecipeCard(receta, recipe) {
    const nombre = receta.nombre || recipe.name || 'Sin título';
    const dificultad = recipe.difficulty || 'Media';
    const tiempo = recipe.totalTimeMin || 'N/A';
    const porciones = recipe.servings || 'N/A';
    const descripcion = recipe.description || 'Una deliciosa receta para disfrutar.';
    const imagen = receta.imagen || 'https://via.placeholder.com/400x256/374e19/ffffff?text=Receta';

    // Determinar tags basados en la dificultad y tipo
    const tags = [];
    if (dificultad && dificultad.toLowerCase().includes('fácil')) tags.push('Fácil');
    if (dificultad && dificultad.toLowerCase().includes('media')) tags.push('Intermedio');
    if (dificultad && dificultad.toLowerCase().includes('difícil')) tags.push('Avanzado');

    // Agregar tags basados en el curso/plato
    const course = recipe.course || '';
    if (course.toLowerCase().includes('postre') || course.toLowerCase().includes('dessert')) {
        tags.push('Postre');
    } else if (course.toLowerCase().includes('desayuno') || course.toLowerCase().includes('breakfast')) {
        tags.push('Desayuno');
    } else if (course.toLowerCase().includes('principal') || course.toLowerCase().includes('main')) {
        tags.push('Principal');
    } else {
        tags.push('Proteína'); // Default
    }

    // Limitar a máximo 2 tags
    const displayTags = tags.slice(0, 2);

    return `
        <div class="recipe-card bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col group">
            <div class="relative h-64 overflow-hidden">
                <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                     alt="Imagen de ${escapeHtml(nombre)}"
                     src="${imagen}">
                <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">schedule</span> ${tiempo} min
                </div>
            </div>
            <div class="card-content p-6 flex flex-col flex-grow">
                <h3 class="card-title text-xl font-headline font-bold text-on-surface mb-2 leading-snug">${escapeHtml(nombre)}</h3>
                <p class="text-on-surface-variant text-sm mb-4 line-clamp-2">${escapeHtml(descripcion)}</p>
                <div class="mt-auto flex items-center justify-between">
                    <div class="flex gap-2">
                        ${displayTags.map(tag => `<span class="px-2 py-1 bg-surface-container rounded-md text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">${tag}</span>`).join('')}
                    </div>
                    <button class="btn-show organic-gradient text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:opacity-90 transition-opacity" onclick="showRecipeModal(${receta.id})">Ver Detalles</button>
                </div>
            </div>
        </div>
    `;
}

// Función para mostrar el modal con detalles de la receta
async function showRecipeModal(recetaId, favorite = false) {
    try {
        const response = await fetch('https://nutret.es/Recetas/recetaGenerada/' + recetaId, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Error al obtener recetas');
        }

        const data = await response.json();
        
        // Acceder directamente al objeto, sin .find()
        const receta = data.recetaGenerada;

        if (!receta) {
            alert('Receta no encontrada');
            return;
        }

        const recetaData = JSON.parse(receta.receta);
        const recipe = recetaData.recipe || recetaData;

        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = generateRecipeHTML(recipe);

        toggleModal(recetaData, recetaId, receta, data.esFavorito, data.calificacion, data.comentario);
    } catch (error) {
        console.error('Error al mostrar receta:', error);
        alert('Error al cargar la receta');
    }
}

function toggleModal(recetaData, recetaId, data, esFavorita, calificacion, comentario) {
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

    const imagenHTML = data.imagen 
    ? `<div class="relative -mt-14 z-0">
            <img src="${data.imagen}" alt="Imagen de la receta" class="w-full h-64 object-cover rounded-t-xl"/>
            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-surface rounded-t-xl"></div>
       </div>` 
    : ''; // Si no hay imagen, string vacío = no se renderiza nada

    //Comprobaciones para ver si es favorito o no, y mostrar el botón en consecuencia
    const clasesBotonFavorito = esFavorita 
        ? 'flex items-center gap-3 bg-primary text-on-primary px-8 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 whitespace-nowrap'
        : 'flex items-center gap-3 bg-tertiary-container text-on-tertiary-container hover:bg-tertiary text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 whitespace-nowrap';

    const iconoFavorito = esFavorita ? 'favorite' : 'favorite_border';
    const textoFavorito = esFavorita ? 'En favoritos' : 'Añadir a favoritos';
    const onclickFavorito = esFavorita ? `onclick="loadEliminarRecetaFavoritos(${recetaId})"` : `onclick="openModalRate(${recetaId})"`;
    const idFavorito = esFavorita ? `id="deleteBtn"` : `id="openModalBtn"`;

    // ── HTML completo del contenido ───────────────────────────────────────────
    const modalContentHTML = `
        <!-- Botón cerrar — esquina superior izquierda -->
        <div class="relative p-4 z-10">
            <button
                class="w-10 h-10 bg-surface hover:bg-surface-container text-on-surface rounded-full flex items-center justify-center transition-all active:scale-90 shadow-sm border border-outline-variant/20"
                id="modalGenerarRecetaClose" onclick="closeModal()">
                <span class="material-symbols-outlined text-xl">close</span>
            </button>
        </div>

        ${imagenHTML}
 
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
                    <div class="flex flex-col gap-4">
                        <button
                            class="flex items-center gap-3 bg-tertiary-container text-on-tertiary-container hover:bg-tertiary text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 whitespace-nowrap"
                                id="openModalImgBtn" onclick="openModalImage(${recetaId})">
                                <span class="material-symbols-outlined" data-weight="fill">image</span>
                                Añadir una imagen personalizada
                        </button>
                        <button
                            class="${clasesBotonFavorito}"
                            ${idFavorito} ${onclickFavorito}>
                            <span class="material-symbols-outlined" data-weight="fill" id="textoFavorito">
                                ${iconoFavorito}
                            </span>
                            ${textoFavorito}
                        </button>
                    </div>
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
                ${esFavorita && calificacion ? `
                <div class="mt-10 bg-surface-container rounded-xl p-6">
                    <h3 class="text-xl font-bold mb-4">Tu valoración</h3>
                    <div class="flex gap-1 mb-3">
                        ${Array.from({length:5}, (_,i) => `<span class="material-symbols-outlined text-2xl" style="color: ${i < calificacion ? '#FACC15' : '#D1D5DB'}">${'star'}</span>`).join('')}
                    </div>
                    ${comentario ? `<p class="text-on-surface-variant italic">"${comentario}"</p>` : ''}
                </div>` : ''}
 
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
                <div class="modal-receta-content" id="modalRecetaContent">${modalContentHTML}</div>
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
        <div class="modal-receta-content" id="modalRecetaContent">
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

const modal = document.getElementById("feedbackModal");
let recetaIdGlobal;

function openModalRate(recetaId){
    recetaIdGlobal = recetaId;
    modal.style.display = "flex";
}

function openModalImage(recetaId){
    document.getElementById("imageModal").classList.remove("hidden");
    recetaIdGlobal = recetaId;
}

document.getElementById("closeImageModal").onclick = function() {
    document.getElementById("imageModal").classList.add("hidden");
    document.getElementById("imageInput").value = "";
    document.getElementById("imagePreview").classList.add("hidden");
};

document.getElementById("cancelImageBtn").onclick = function() {
    document.getElementById("imageModal").classList.add("hidden");
    document.getElementById("imageInput").value = "";
    document.getElementById("imagePreview").classList.add("hidden");
};

async function guardarRecetaEnFavoritos() {
    try {
        const rating = document.querySelector('input[name="rating"]:checked');
        const comentario = document.getElementById("commentInput").value;

        if (!rating) {
            alert("Selecciona una valoración");
            return;
        }

        const response = await fetch('https://nutret.es/Recetas/guardarFavorito/' + recetaIdGlobal, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {
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
    } catch (error) {
        console.error('Error:', error);
    }

}

async function subirImagen() {
    try{
        const input = document.getElementById("imageInput");
        const archivo = input.files[0];

        if (!archivo) {
            alert("Selecciona una imagen");
            return;
        }

        const formData = new FormData();
        formData.append("imagen", archivo);
        formData.append("recetaId", recetaIdGlobal);

        const response = await fetch("https://nutret.es/Recetas/guardarImagen/" + recetaIdGlobal, {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        document.getElementById("imageModal").classList.add("hidden");
        document.getElementById("imageInput").value = "";
        document.getElementById("imagePreview").classList.add("hidden");
    }catch(error){
        console.error('Error:', error);
    }
}

async function loadRecetasFavoritas(){
    try{
        const response = await fetch('https://nutret.es/Recetas/recetasFavoritas', {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Error en la red: ' + response.statusText);
        }

        const data = await response.json();
        

        if (data.result === 'Correct' && data.recetasFavoritas) {
            displayRecetasFavoritas(data.recetasFavoritas);
        }
    }catch(error){
        console.error('Error:', error);
    }
}

function displayRecetasFavoritas(recetas) {
    // Validar y obtener todas las secciones
    const sections = {
        fav: document.getElementById('recetasFav'),
        main: document.getElementById('recetasMain'),
        dessert: document.getElementById('recetasDessert'),
        snack: document.getElementById('recetasSnack'),
        side: document.getElementById('recetasSide'),
        breakfast: document.getElementById('recetasBreakfast'),
        starter: document.getElementById('recetasStarter')
    };

    // Verificar que las secciones existan
    const missingElements = Object.entries(sections)
        .filter(([, el]) => !el)
        .map(([key]) => key);
    
    if (missingElements.length > 0) {
        console.error('❌ Elementos HTML no encontrados:', missingElements);
        return;
    }

    // Limpiar contenido solo de secciones que serán populadas dinámicamente
    // Nota: recetasMain y recetasBreakfast tienen contenido estático, no los limpiamos
    const dynamicSections = ['recetasDessert', 'recetasSnack', 'recetasSide', 'recetasStarter'];
    dynamicSections.forEach(sectionId => {
        if (sections[sectionId]) {
            sections[sectionId].innerHTML = '';
        }
    });

    // Contador de recetas por sección
    const count = { main: 0, dessert: 0, snack: 0, side: 0, breakfast: 0, starter: 0 };

    // Procesar cada receta
    recetas.forEach((receta, index) => {
        try {
            // Parse del JSON
            const recetaData = JSON.parse(receta.receta);
            const recipe = recetaData.recipe || recetaData;

            // Determinar la categoría (course)
            const course = (recipe.course || 'main').toLowerCase();
            const sectionKey = mapCourseToSection(course);

            const cardHTML = createRecipeCard(receta, recipe);
            document.getElementById("recetasFav").innerHTML += cardHTML;

            
        } catch (error) {
            console.error(`❌ Error procesando receta ${index + 1}:`, receta, error);
        }
    });

    // Agregar mensajes en secciones vacías y mostrar/ocultar secciones
    const staticSections = ['recetasMain', 'recetasBreakfast']; // Estas tienen contenido HTML estático

    Object.entries(count).forEach(([section, total]) => {
        const sectionElement = sections[section];
        const containerElement = sectionElement.closest('.mb-16');

        if (dynamicSections.includes(section)) {
            // Para secciones dinámicas: mostrar solo si tienen recetas
            if (total === 0) {
                if (containerElement) {
                    containerElement.style.display = 'none';
                }
            } else {
                if (containerElement) {
                    containerElement.style.display = 'block';
                }
            }
        }
        // Para secciones estáticas: siempre visibles (tienen contenido HTML)
    });
}

async function loadEliminarRecetaFavoritos(recetaId){
    try{
        const response = await fetch("https://nutret.es/Recetas/eliminarFavorito/" + recetaId, {
            method: "DELETE"
        });
        
        if (!response.ok) {
            throw new Error('Error en la red: ' + response.statusText);
        }

        const data = await response.json();

        const boton = document.getElementById("deleteBtn");

        boton.className = 'flex items-center gap-3 bg-tertiary-container text-on-tertiary-container hover:bg-tertiary text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 whitespace-nowrap';
        boton.setAttribute("id", "openModalBtn");
        boton.setAttribute("onclick", "openModalRate(" + recetaId + ")");

        document.getElementById("textoFavorito").textContent = "favorite_border";
        boton.textContent = "Añadir a favoritos";
        
        
    }catch(error){
        console.error('Error:', error);
    }
}

// Función para generar el HTML de la receta completa
function generateRecipeHTML(recipe) {
    let html = `
        <h3>${escapeHtml(recipe.name || 'Receta')}</h3>
        <p><strong>Porciones:</strong> ${recipe.servings || '-'} | <strong>Dificultad:</strong> ${recipe.difficulty || '-'} | <strong>Cocina:</strong> ${recipe.cuisine || '-'} | <strong>Curso:</strong> ${recipe.course || '-'}</p>
        <p><strong>Tiempo total:</strong> ${recipe.totalTimeMin || 0} min</p>
    `;

    // Ingredientes
    html += '<h4>Ingredientes</h4><ul>';
    if (Array.isArray(recipe.ingredients)) {
        recipe.ingredients.forEach(i => {
            html += `<li>${i.quantity ?? '-'} ${i.unit ?? ''} ${escapeHtml(i.item ?? '')}</li>`;
        });
    }
    html += '</ul>';

    // Pasos
    html += '<h4>Pasos</h4><ol>';
    if (Array.isArray(recipe.steps)) {
        recipe.steps.forEach(s => {
            html += `<li><strong>${s.technique || ''}</strong> (${s.timeMin || ''} min): ${escapeHtml(s.description || '')}</li>`;
        });
    }
    html += '</ol>';

    // Opcionales
    if (Array.isArray(recipe.variations) && recipe.variations.length > 0) {
        html += '<h4>Variaciones</h4><ul>';
        recipe.variations.forEach(v => {
            html += `<li><strong>${escapeHtml(v.name || '')}</strong>: ${escapeHtml(v.modification || '')}</li>`;
        });
        html += '</ul>';
    }

    if (Array.isArray(recipe.commonMistakes) && recipe.commonMistakes.length > 0) {
        html += '<h4>Errores comunes</h4><ul>';
        recipe.commonMistakes.forEach(e => {
            html += `<li>${escapeHtml(e.mistake || '')}</li>`;
        });
        html += '</ul>';
    }

    return html;
}

// Función para escapar HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Ejecutar al cargar la página
window.addEventListener('load', loadRecetas);
window.addEventListener('load', loadRecetasFavoritas);

// ─── UTILIDADES ─────────────────────────────────────────────────────────────
const DIFF_LABEL = {
  beginner:     'Principiante',
  easy:         'Fácil',
  fácil:        'Fácil',
  intermediate: 'Intermedio',
  advanced:     'Avanzado',
};

const COURSE_LABEL = {
  main:      'Plato principal',
  dessert:   'Postre',
  snack:     'Snack',
  appetizer: 'Entrante',
};

function parseReceta(raw) {
  try {
    const parsed = JSON.parse(raw);
    return parsed.recipe || null;
  } catch {
    return null;
  }
}

// ─── MODAL (único, reutilizable) ─────────────────────────────────────────────
function createModal() {
  const overlay = document.createElement('div');
  overlay.id = 'recipeModal';
  overlay.className = 'modal-overlay';
  overlay.style.display = 'none';

  overlay.innerHTML = `
    <div class="modal-content">
      <span class="close-modal" id="closeModalBtn">&times;</span>
      <div class="modal-body" id="modalBody"></div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Cerrar con la X
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);

  // Cerrar al hacer clic fuera del contenido
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  // Cerrar con Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal(recipe) {
  const nutr  = recipe.nutritionPer100g || {};
  const diff  = DIFF_LABEL[recipe.difficulty]  || recipe.difficulty  || '';
  const course = COURSE_LABEL[recipe.course]   || recipe.course      || '';
  const tags  = (recipe.tags || []).slice(0, 4);

  // Ingredientes
  const ingrHTML = (recipe.ingredients || [])
    .map(i => `<li>${i.quantity} ${i.unit} de <strong>${i.item}</strong></li>`)
    .join('');

  // Pasos
  const stepsHTML = (recipe.steps || [])
    .map(s => `<li>
      <strong>${s.technique ? capitalize(s.technique) : 'Paso ' + s.number}:</strong>
      ${s.description}
      ${s.timeMin ? `<em style="color:#999; font-size:0.85rem;"> (${s.timeMin} min)</em>` : ''}
    </li>`)
    .join('');

  // Variaciones
  const varsHTML = (recipe.variations || []).length
    ? `<h3>Variaciones</h3><ul>${recipe.variations.map(v =>
        `<li><strong>${v.name}:</strong> ${v.modification}</li>`
      ).join('')}</ul>`
    : '';

  // Errores comunes
  const mistakesHTML = (recipe.commonMistakes || []).length
    ? `<h3>Errores comunes</h3><ul>${recipe.commonMistakes.map(m =>
        `<li>⚠️ ${m.mistake}</li>`
      ).join('')}</ul>`
    : '';

  // Nutrición
  const nutrHTML = Object.keys(nutr).length
    ? `<div style="background:#fff3f3; padding:15px; border-radius:8px; margin-top:20px;">
        <strong>💡 Nutrición por 100g:</strong>
        ${nutr.calories != null ? ` ${nutr.calories} kcal` : ''}
        ${nutr.protein  != null ? ` · ${nutr.protein}g proteína` : ''}
        ${nutr.carbs    != null ? ` · ${nutr.carbs}g carbos` : ''}
        ${nutr.fat      != null ? ` · ${nutr.fat}g grasa` : ''}
        ${nutr.fiber    != null ? ` · ${nutr.fiber}g fibra` : ''}
      </div>`
    : '';

  document.getElementById('modalBody').innerHTML = `
    <h2>${recipe.name}</h2>
    <p>
      ${recipe.totalTimeMin ? `<span class="tag">⏱️ ${recipe.totalTimeMin} min</span>` : ''}
      ${diff                ? `<span class="tag">👤 ${diff}</span>`                     : ''}
      ${recipe.servings     ? `<span class="tag">🍽️ ${recipe.servings} porciones</span>` : ''}
      ${course              ? `<span class="tag">🍳 ${course}</span>`                   : ''}
      ${tags.map(t => `<span class="tag">${t}</span>`).join('')}
    </p>

    <h3>Ingredientes</h3>
    <ul>${ingrHTML}</ul>

    <h3>Preparación</h3>
    <ol>${stepsHTML}</ol>

    ${nutrHTML}
    ${varsHTML}
    ${mistakesHTML}
  `;

  const modal = document.getElementById('recipeModal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('recipeModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// ─── RENDER TARJETAS ────────────────────────────────────────────────────────
function renderRecetas(data) {
  const container = document.getElementById('recetas');
  if (!container) {
    console.error('No se encontró el elemento #recetas en el DOM.');
    return;
  }

  // Limpiar contenido previo (por si se regenera)
  container.innerHTML = '';

  const recetas = data.recetasGeneradas.filter(r => parseReceta(r.receta));

  if (recetas.length === 0) {
    container.innerHTML = '<p style="color:#666;">No se encontraron recetas válidas.</p>';
    return;
  }

  recetas.forEach(r => {
    const recipe = parseReceta(r.receta);

    const card = document.createElement('div');
    card.className = 'recipe-card';

    card.innerHTML = `
      <div class="card-content">
        <h2 class="card-title">${recipe.name}</h2>
        <button class="btn-show">Mostrar más</button>
      </div>
    `;

    card.querySelector('.btn-show').addEventListener('click', () => openModal(recipe));
    container.appendChild(card);
  });
}

// ─── FETCH AL SERVIDOR ──────────────────────────────────────────────────────
async function cargarRecetas() {
  try {
    // Cambia esta URL por el endpoint real de tu servidor
    const response = await fetch('https://nutret.es/Recetas/recetasGeneradas', {
      method: 'GET',            // Ajusta el método según tu API (GET o POST)
      headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify({ ... })  // Descomenta y ajusta si necesitas enviar datos
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    renderRecetas(data);

  } catch (error) {
    console.error('Error al cargar recetas:', error);
    const container = document.getElementById('recetas');
    if (container) {
      container.innerHTML = `<p style="color: var(--primary);">Error al cargar las recetas. Inténtalo de nuevo.</p>`;
    }
  }
}

// ─── INICIO ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  createModal();
  cargarRecetas();
});

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}