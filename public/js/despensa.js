// Función para manejar el boton de modificar y hacer la peticion PUT para actualizar la despensa

document.addEventListener("submit", function(e) {
    const form = e.target.closest("form.productosNuevos, form.formularios");
    if (!form) return; // No es uno de nuestros formularios

    const boton = form.querySelector("input[type='submit']");

    if (boton.value === "Modificar") {
        e.preventDefault();

        form.querySelector("select[name='nombre']").style.pointerEvents = "auto";

        form.querySelectorAll("input[type='text']").forEach(input => {
            input.removeAttribute("readonly");
            input.style.backgroundColor = "#ffffcc";
        });

        // Cambiar el botón Modificar por Guardar y agregar botón Eliminar
        const buttonContainer = boton.parentElement;
        // esto no
        boton.value = "Guardar";
        boton.name = "guardarModificado";
        
        // Verificar si ya existe un botón Eliminar
        if (!buttonContainer.querySelector("input[name='eliminar']")) {
            // Crear botón Eliminar
            const deleteButton = document.createElement("input");
            deleteButton.type = "button";
            deleteButton.value = "Eliminar";
            deleteButton.name = "eliminar";
            deleteButton.className = "px-6 py-2 bg-error hover:bg-error-container hover:text-on-error-container text-on-error font-bold text-sm rounded-full transition-all duration-200 cursor-pointer active:scale-95 ml-2";
            
            // Obtener el ID del ingrediente
            const formData = new FormData(form);
            const id = formData.get("id");
            
            // Asignar el event handler correctamente
            deleteButton.onclick = function() {
                loadEliminarIngrediente(id);
            };

            buttonContainer.appendChild(deleteButton);
        }

    } else if (boton.value === "Guardar") {
        if (!confirm("¿Guardar los cambios?")) {
            e.preventDefault();
        }else{
            e.preventDefault();

            const formData = new FormData(form);

            // Acceder a campos individuales
            const id = formData.get("id");
            const ingrediente = formData.get("ingrediente");
            const stock = formData.get("stock");
            const cantidad = formData.get("cantidad");
            const fecha = formData.get("fecha_insercion");

            const datos = {
                ingrediente: parseInt(formData.get("nombre")),
                stock:       parseInt(formData.get("stock")),
                cantidad:    parseInt(formData.get("cantidad")),
                fecha_insercion: formData.get("fecha_insercion"),
                id:          parseInt(formData.get("id"))
            };
            

            fetch('https://nutret.es/Despensa/actualizarDespensa', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                body: JSON.stringify({
                    "despensa": datos
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la red: ' + response.statusText);
                }
                return response.json();
            })
            .then(jsonResponse => displayActualizarIngrediente(jsonResponse))
            .catch(error => console.error('Error:', error));
        }
    }
});

function displayActualizarIngrediente(data) {
    
    if(data.result === "Correct" && data.actualizado){
        alert("Ingrediente actualizado correctamente");
        window.location.reload();
    }else{
        alert("Error al actualizar el ingrediente. Intenta de nuevo.");
    }
}

window.addEventListener('DOMContentLoaded', function() {
    loadDespensa();
});

// Función para manejar el botón de añadir fila para añadir a la tabla de ingredientes
async function anadirFila() {
    const tbody = document.getElementById("tbodyIngredientes");

    try {
        // Cargar ingredientes para llenar el select
        const response = await fetch('https://nutret.es/Despensa/ingredientes');
        if (!response.ok) throw new Error('Error en la red');
        
        const data = await response.json();
        const ingredientes = data.ingredients; // Guardar los ingredientes completos para usar en el event listener
        
        let opcionesHTML = "";
        const ingredientesOrdenados = ordenarIngredientes(ingredientes);
        ingredientesOrdenados.forEach(([id, info]) => {
            const nombre = typeof info === 'object' ? info.nombre : info;
            opcionesHTML += `<option value="${id}">${nombre}</option>`;
        });

        let html = `
            <tr class="rowAnadir">
            <td class="filaAnadir py-4 pr-2">
            <select class="selectComida w-full bg-surface-container text-on-surface rounded-lg border-none focus:ring-2 focus:ring-primary py-2 px-3 font-medium transition-all" name="ingredientes[]" data-ingredientes='${JSON.stringify(ingredientes)}'>
            <option value="">-- Selecciona --</option>
            ${opcionesHTML}
            </select>
            </td>
            <td class="filaAnadir py-4 px-2">
            <input class="inputsComida w-full bg-surface-container text-on-surface rounded-lg border-none focus:ring-2 focus:ring-primary py-2 px-3 font-medium" name="cantidad[]" type="number" value="0"/>
            </td>
            <td class="filaAnadir py-4 px-2">
            <span class="medicion-display text-on-surface font-medium">--</span>
            </td>
            <td class="filaAnadir py-4 pl-2">
            <input class="inputsComida w-full bg-surface-container text-on-surface rounded-lg border-none focus:ring-2 focus:ring-primary py-2 px-3 font-medium" name="stock[]" type="number" value="1"/>
            </td>
            </tr>
        `;

        tbody.insertAdjacentHTML('beforeend', html);
    } catch (error) {
        console.error('Error al añadir fila:', error);
    }
}


document.getElementById('tbodyIngredientes').addEventListener('change', function(e){
    // Verificar si el elemento que cambió tiene la clase 'selectComida'
    if (e.target.classList.contains('selectComida')) {
        // Actualizar la medición correspondiente
        const select = e.target;
        const row = select.closest('tr');
        const medicionDisplay = row.querySelector('.medicion-display');
        
        if (select.value) {
            // Obtener los datos de ingredientes del atributo data
            const ingredientes = JSON.parse(select.getAttribute('data-ingredientes') || '{}');
            const ingredienteInfo = ingredientes[select.value];
            
            if (ingredienteInfo && ingredienteInfo.medicion) {
                medicionDisplay.textContent = ingredienteInfo.medicion;
            } else {
                medicionDisplay.textContent = '--';
            }
        } else {
            medicionDisplay.textContent = '--';
        }
        
        // Obtener todos los selects y verificar si alguno está vacío
        const selectsActuales = document.querySelectorAll('#tbodyIngredientes select.selectComida');
        const haySelectVacio = Array.from(selectsActuales).some(select => select.value === '');
        
        // Si NO hay ningún select vacío (todos tienen valor seleccionado), agregar una fila nueva
        if (!haySelectVacio) {
            anadirFila();
        }
    }
});

//
// Función para cargar los ingrdientes cuando se añada una fila nueva, para que se actualice el select con los ingredientes disponibles
async function loadIngredients() {
    try {
        const response = await fetch('https://nutret.es/Despensa/ingredientes');
        
        if (!response.ok) {
            throw new Error('Error en la red: ' + response.statusText);
        }
        
        const text = await response.text();
        if (!text || !text.trim()) {
            throw new Error('Respuesta JSON vacía en ingredientes');
        }
        let data;
        try {
            data = JSON.parse(text);
        } catch (err) {
            throw new Error('JSON inválido en ingredientes: ' + err.message + ' | body: ' + text);
        }

        const ingredientes = data.ingredients;  // No ordenar aquí, displayIngredients lo hará
        displayIngredients(ingredientes);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para mostrar los ingredientes en el select de añadir fila nueva
function displayIngredients(ingredientes) {
    const tbody = document.getElementById("tbodyIngredientes");
    let opcionesHTML = "";
    
    // Ordenar los ingredientes
    const ingredientesOrdenados = ordenarIngredientes(ingredientes);
    
    // Los ingredientes ya vienen ordenados
    ingredientesOrdenados.forEach(([id, info]) => {
        const nombre = typeof info === 'object' ? info.nombre : info;
        opcionesHTML += `<option value="${id}">${nombre}</option>`;
    });
    
    // Crear la fila inicial con los datos de ingredientes incluidos
    const ingredientesData = {};
    Object.entries(ingredientes).forEach(([id, info]) => {
        if (typeof info === 'object') {
            ingredientesData[id] = info;
        } else {
            // Si es la estructura antigua, crear objeto
            ingredientesData[id] = { nombre: info, medicion: '--' };
        }
    });

    let html = `
        <tr class="rowAnadir">
        <td class="filaAnadir py-4 pr-2">
        <select class="selectComida w-full bg-surface-container text-on-surface rounded-lg border-none focus:ring-2 focus:ring-primary py-2 px-3 font-medium transition-all" name="ingredientes[]" data-ingredientes='${JSON.stringify(ingredientesData)}'>
        <option value="">-- Selecciona --</option>
        ${opcionesHTML}
        </select>
        </td>
        <td class="filaAnadir py-4 px-2">
        <input class="inputsComida w-full bg-surface-container text-on-surface rounded-lg border-none focus:ring-2 focus:ring-primary py-2 px-3 font-medium" name="cantidad[]" type="number" value="1" min="1"/>
        </td>
        <td class="filaAnadir py-4 px-2">
        <span class="medicion-display text-on-surface font-medium">--</span>
        </td>
        <td class="filaAnadir py-4 pl-2">
        <input class="inputsComida w-full bg-surface-container text-on-surface rounded-lg border-none focus:ring-2 focus:ring-primary py-2 px-3 font-medium" name="stock[]" type="number" value="1" min="1"/>
        </td>
        </tr>
    `;
    
    tbody.innerHTML = html;
}

// Función para ordenar los ingredientes alfabéticamente por su nombre, para mostrarlo ordenado en el select
function ordenarIngredientes(ingredientes) {
    const original = Object.entries(ingredientes);
    
    // Ordena alfabéticamente por nombre
    const ordenado = original.sort((a, b) => {
        const nombreA = typeof a[1] === 'object' ? a[1].nombre : a[1];
        const nombreB = typeof b[1] === 'object' ? b[1].nombre : b[1];
        return nombreA.localeCompare(nombreB);
    });
    return ordenado;
}

function getOptionsSelected(ingredientes, idSeleccionado) {
    let opcionesHTML = "";
    
    // Si es array, ya está ordenado
    const ordenado = Array.isArray(ingredientes) 
        ? ingredientes 
        : Object.entries(ingredientes).sort((a, b) => {
            const nombreA = typeof a[1] === 'object' ? a[1].nombre : a[1];
            const nombreB = typeof b[1] === 'object' ? b[1].nombre : b[1];
            return nombreA.localeCompare(nombreB);
        });
    
    ordenado.forEach(([id, info]) => {
        const nombre = typeof info === 'object' ? info.nombre : info;
        const selected = (id == idSeleccionado) ? 'selected' : '';
        opcionesHTML += `<option value="${id}" ${selected}>${nombre}</option>`;
    });
    
    return opcionesHTML;
}

//
// Función para cargar la despensa del usuario, con los ingredientes que tiene y sus cantidades, stock y fecha de insercion
async function loadDespensa(){
    try {
        const response = await fetch('https://nutret.es/Despensa/cargaPagina');
        
        if (!response.ok) {
            throw new Error('Error en la red: ' + response.statusText);
        }
        
        const text = await response.text();
        if (!text || !text.trim()) {
            throw new Error('Respuesta JSON vacía en despensa');
        }
        let data;
        try {
            data = JSON.parse(text);
        } catch (err) {
            throw new Error('JSON inválido en despensa: ' + err.message + ' | body: ' + text);
        }

        const despensa = data;
        displayDespensa(despensa);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayDespensa(despensa) {
    const tbody = document.getElementById("tbodyDespensa");
    tbody.innerHTML = ""; // Limpiar contenido previo
    let despensaEntera = "";

    const data = despensa.despensa; // Array de objetos ingrediente
    const totalDeIngredientes = data.length;
    document.getElementById("articulosTotales").textContent = `${totalDeIngredientes} ${totalDeIngredientes === 1 ? 'Artículo' : 'Artículos'}`;
    
    let listaIngredientes = ordenarIngredientes(despensa.ingredientes); // Array de objetos ingrediente
    

    data.forEach((ingredienteDeLaDespensa) => {

        despensaEntera += `
            <!--<tr class='rowAnadir'>

            <td class='filaDespensa' colspan='5'>
            
            <form class='formularios'>
            
            
            <input type='hidden' name='ingrediente' value='${ingredienteDeLaDespensa.ingredienteID}'>
            
            <select class='inputsDespensa' name='nombre' style='pointer-events: none'>
            ${getOptionsSelected(listaIngredientes, ingredienteDeLaDespensa.ingredienteID)};
            </select>
            <input class='inputsDespensa' type='text' name='stock' value='${ingredienteDeLaDespensa.stock}' readonly>
            <input class='inputsDespensa' type='text' name='cantidad' value='${ingredienteDeLaDespensa.cantidad}' readonly>
            <input class='inputsDespensa' type='text' name='medicion' value='${ingredienteDeLaDespensa.medicion}' readonly>
            <input class='inputsDespensa' type='text' name='fecha_insercion' value='${ingredienteDeLaDespensa.fecha_insercion}' readonly>
               
            <input type='hidden' name='id' value='${ingredienteDeLaDespensa.despensaID}'>
            
            <input type='submit' name='boton' value='Modificar'>
            </form>       
            </td>           
            </tr>-->

            <tr class="rowAnadir group">
            <td class="filaDespensa" colspan="5">
            <form class="formularios bg-surface-container-lowest p-6 rounded-lg flex flex-wrap lg:flex-nowrap items-center gap-4 transition-all duration-300 hover:shadow-md">
            <input name="ingrediente" type="hidden" value="${ingredienteDeLaDespensa.ingredienteID}"/>
            <!-- Product Select (Readonly style) -->
            <div class="flex-1 min-w-[140px]">
            <label class="block text-[10px] font-bold text-outline-variant mb-1 uppercase">Producto</label>
            <select class="inputsDespensa w-full bg-transparent text-primary font-bold border-none p-0 appearance-none pointer-events-none" name="nombre">
            ${getOptionsSelected(listaIngredientes, ingredienteDeLaDespensa.ingredienteID)};
            </select>
            </div>
            <!-- Stock (Readonly style) -->
            <div class="w-20">
            <label class="block text-[10px] font-bold text-outline-variant mb-1 uppercase">Stock</label>
            <input class="inputsDespensa w-full bg-transparent text-on-surface font-medium border-none p-0 cursor-default focus:ring-0" name="stock" readonly="" type="text" value="${ingredienteDeLaDespensa.stock}"/>
            </div>
            <!-- Amount (Readonly style) -->
            <div class="w-24">
            <label class="block text-[10px] font-bold text-outline-variant mb-1 uppercase">Cantidad</label>
            <input class="inputsDespensa w-full bg-transparent text-on-surface font-medium border-none p-0 cursor-default focus:ring-0" name="cantidad" readonly="" type="text" value="${ingredienteDeLaDespensa.cantidad}"/>
            </div>
            <!-- Measurement (Info only) -->
            <div class="w-20">
            <label class="block text-[10px] font-bold text-outline-variant mb-1 uppercase">Medición</label>
            <div class="text-on-surface font-medium">${ingredienteDeLaDespensa.medicion}</div>
            </div>
            <!-- Date (Readonly style) -->
            <div class="w-32">
            <label class="block text-[10px] font-bold text-outline-variant mb-1 uppercase">Fecha</label>
            <input class="inputsDespensa w-full bg-transparent text-on-surface-variant font-medium border-none p-0 cursor-default focus:ring-0" name="fecha_insercion" readonly="" type="text" value="${ingredienteDeLaDespensa.fecha_insercion}"/>
            </div>
            <input name="id" type="hidden" value="${ingredienteDeLaDespensa.despensaID}"/>
            <div class="ml-auto">
            <input class="px-6 py-2 bg-surface-container-high hover:bg-secondary-container hover:text-on-secondary-container text-on-surface-variant font-bold text-sm rounded-full transition-all duration-200 cursor-pointer active:scale-95" name="boton" type="submit" value="Modificar"/>
            </div>
            </form>
            </td>
            </tr>
            `
    });
    
    tbody.insertAdjacentHTML('beforeend', despensaEntera);
}
window.addEventListener("load", function() {
    loadIngredients();
});



// Función para insertar los ingredientes en la base de datos, con la peticion POST
function insertarIngredientes(e){
    e.preventDefault();

    const ingredientes = document.querySelectorAll('select[name="ingredientes[]"]');
    const cantidades = document.querySelectorAll('input[name="cantidad[]"]');
    const stocks = document.querySelectorAll('input[name="stock[]"]');

    const productos = [];
    ingredientes.forEach((select, index) => {
        if (select.value !== '') { // Ignorar filas vacías
            productos.push({
                ingrediente: select.value,
                cantidad: cantidades[index].value,
                stock: stocks[index].value
            });
        }
    });
    
    

    fetch('https://nutret.es/Despensa/insertarIngredientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(productos),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la red: ' + response.statusText);
        }
        return response.json();
    })
    .then(jsonResponse => displayInsertarIngredientes(jsonResponse))
    .catch(error => console.error('Error:', error));
}

function displayInsertarIngredientes(data) {
    
    if(data.result === "Correct" && data.introducido){
        alert("Ingredientes añadidos correctamente");
        window.location.reload();
    }else{
        alert("Error al añadir los ingredientes. Intenta de nuevo.");
    }
}

document.getElementById("filtroDespensa").addEventListener("change", async function() {
    const valor = this.value;
    const filtro = valor.split("-")[0];
    const orden = valor.split("-")[1];

    try {
        const response = await fetch('https://nutret.es/Despensa/filtrarDespensa?filtro=' + filtro + '&orden=' + orden);
        
        if (!response.ok) {
            throw new Error('Error en la red: ' + response.statusText);
        }
        
        const text = await response.text();
        if (!text || !text.trim()) {
            throw new Error('Respuesta JSON vacía en despensa');
        }
        let data;
        try {
            data = JSON.parse(text);
        } catch (err) {
            throw new Error('JSON inválido en despensa: ' + err.message + ' | body: ' + text);
        }

        const despensa = data;
        displayDespensa(despensa);
    } catch (error) {
        console.error('Error:', error);
    }
});

function loadEliminarIngrediente(id){
    if (!confirm("¿Eliminar este ingrediente de la despensa?")) {
        return;
    }else{
        fetch('https://nutret.es/Despensa/eliminarIngrediente', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({ id: id }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red: ' + response.statusText);
            }
            return response.json();
        })
        .then(jsonResponse => {
            if (jsonResponse.result === "Correct") {
                window.location.reload();
            } else {
                alert("Error al eliminar el ingrediente");
            }
        })
        .catch(error => console.error('Error:', error));
    }
}