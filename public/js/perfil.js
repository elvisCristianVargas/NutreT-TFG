var userBien = true; // Variable global para controlar el estado del username - inicia como true
var emailBien = true; // Variable global para controlar el estado del email - inicia como true
var valorPrevioUser = null;
var valorPrevioEmail = null;
var debounceTimer;


document.addEventListener("DOMContentLoaded", function () {
    loadDatosPerfil();
});

function loadDatosPerfil() {
    fetch('https://nutret.es/Perfil/datosUsuario', {
        method: 'GET',

    }).then(response => {
        if (!response.ok) {
            throw new Error('Error en la red: ' + response.statusText);
        }

        return response.json();
    }).then(jsonResponse => displayDatosUsuario(jsonResponse))
        .catch(error => console.error('Error:', error));
}

function displayDatosUsuario(data) {
    document.getElementById("user").textContent = data.datosUsuario.user;
    valorPrevioUser = data.datosUsuario.user;
    document.getElementById("nombre").textContent = data.datosUsuario.nombre;
    document.getElementById("email").textContent = data.datosUsuario.email;
    valorPrevioEmail = data.datosUsuario.email;
    document.getElementById("apellidos").textContent = data.datosUsuario.apellidos;

    if(data.datosUsuario.imagen){
        document.getElementById("imagenUsuario").src = data.url + "/storage/uploads/profile/" + data.datosUsuario.imagen;
    }
}

// IA
let valoresOriginales = {};

function toggleEdit() {
    const campos = document.querySelectorAll('.campo');
    const enEdicion = campos[0].classList.contains('editing');

    if (enEdicion) {
        guardarCambios();
    } else {
        // Resetear validaciones al empezar edición
        userBien = true;
        emailBien = true;
        
        campos.forEach(c => {
            const input = c.querySelector('input');
            const view = c.querySelector('.field-view');
            const edit = c.querySelector('.field-edit');
            const valor = c.querySelector('.valor'); // 👈 el span con el texto

            if (input && valor) {
                valoresOriginales[input.dataset.campo] = valor.textContent; // guarda original
                input.value = valor.textContent; // ✅ mete el valor en el input
            }

            view.style.display = 'none';
            edit.style.display = 'flex';
            c.classList.add('editing');
        });

        document.getElementById('btnEditar').onclick = toggleEdit; // ✅ mantén siempre el mismo onclick
        document.getElementById('btnEditar').innerHTML =
            '<span class="material-symbols-outlined text-xl">save</span> Guardar Cambios';
        document.getElementById('btnCancelar').style.display = 'flex';
    }
}

function guardarCambios() {
    // ✅ 1. Primero recoge los datos ANTES de tocar el DOM
    const data = {};
    document.querySelectorAll('[data-campo]').forEach(input => {
        data[input.dataset.campo] = input.value;
    });

    // 2. Luego actualiza los spans visibles y restaura la vista
    document.querySelectorAll('.campo').forEach(c => {
        const input = c.querySelector('input');
        const valor = c.querySelector('.valor');
        const view = c.querySelector('.field-view');
        const edit = c.querySelector('.field-edit');

        if (input && valor) valor.textContent = input.value;

        view.style.display = 'flex';
        edit.style.display = 'none';
        c.classList.remove('editing');
    });

    document.getElementById('btnEditar').onclick = toggleEdit; // ✅ restaura el onclick
    document.getElementById('btnEditar').innerHTML =
        '<span class="material-symbols-outlined text-xl">edit</span> Editar Perfil';
    document.getElementById('btnCancelar').style.display = 'none';
    
    // Solo validar usuario/email si se han modificado
    const userModificado = data.user !== valorPrevioUser;
    const emailModificado = data.email !== valorPrevioEmail;
    
    if ((userModificado && !userBien) || (emailModificado && !emailBien)) {
        return alert("Por favor, corrige los errores antes de guardar.");
    }
    // 3. Envía al servidor
    fetch('https://nutret.es/Perfil/actualizarDatosUsuario', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(r => {let res = r.json();
        })
        .then(res => {
            if (res.result === "Not found") alert('Error al guardar');
        })
        .catch(err => console.error('Error fetch:', err));
}

function cancelarEdit() {
    // Resetear validaciones al cancelar
    userBien = true;
    emailBien = true;
    
    document.querySelectorAll('.campo').forEach(c => {
        const input = c.querySelector('input');
        const view = c.querySelector('.field-view');
        const edit = c.querySelector('.field-edit');

        if (input) input.value = valoresOriginales[input.dataset.campo];

        view.style.display = 'flex';
        edit.style.display = 'none';

        c.classList.remove('editing');
    });

    document.getElementById('btnEditar').innerHTML =
        '<span class="material-symbols-outlined text-xl">edit</span> Editar Perfil';
    document.getElementById('btnCancelar').style.display = 'none';
}

function subirFoto(event) {
    const file = event.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append('imagen', file);

    fetch('https://nutret.es/Perfil/subirFoto', {
        method: 'POST',
        body: formData
    })
    .then(r => {
        return r.json();
    })
    .then(res => {
        alert("Foto subida con éxito")
        document.getElementById("imagenUsuario").src = res.url + "/storage/uploads/profile/" + res.nombreFoto;
    })
    .catch(err => console.error('Error fetch:', err));
}

function logOut(){
    fetch("https://nutret.es/Perfil/logOut")
    .then(r => {
        return r.json(); // text() en vez de json() para ver el raw
    })
    .then(res => window.location.href = res.url + "")
    .catch(err => console.error('Error fetch:', err));
}


document.addEventListener("DOMContentLoaded", function () {
    fetch("https://nutret.es/Perfil/infoUsuario")
    .then(r => {
        return r.json(); // text() en vez de json() para ver el raw
    })
    .then(res => {
        document.getElementById("recetasGeneradas").textContent = res.recetasGeneradas;
        document.getElementById("recetasFavoritas").textContent = res.recetasFavoritas;
    })
    .catch(err => console.error('Error fetch:', err));
    
});

document.getElementById("inputUsuario").addEventListener("input", function(){
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const valor = this.value.trim();
        if(valor.length > 0){
            fetch("https://nutret.es/Principal/existeUsername", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: valor })
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Error en la red: ' + response.statusText);
                }
                
                return response.json();
            }).then(jsonResponse => {
                const input = document.getElementById("user");
                const error = document.getElementById("error-user");

                if(jsonResponse.result == "Exists"){
                    if(valor === valorPrevioUser){
                        input.style.borderColor = "green";
                        input.style.outline = "1px solid green";
                        input.style.boxShadow = "0 0 5px green";
                        error.style.display = "none";
                        userBien = true;
                    }else{
                        input.style.borderColor = "red";
                        input.style.outline = "1px solid red"; 
                        input.style.boxShadow = "0 0 5px red";
                        error.style.display = "block";
                        error.textContent = "El nombre de usuario ya existe";
                        error.style.color = "red";
                        userBien = false;
                    }
                    
                    
                }else{
                    input.style.borderColor = "green";
                    input.style.outline = "1px solid green";
                    input.style.boxShadow = "0 0 5px green";
                    error.style.display = "none";
                    userBien = true;
                }
            })
            .catch(error => console.error('Error:', error));
        }else{
            userBien = false;
            const input = document.getElementById("user");
            const error = document.getElementById("error-user");
            input.style.borderColor = "red";
            input.style.outline = "1px solid red"; 
            input.style.boxShadow = "0 0 5px red";
            error.style.display = "block";
            error.textContent = "El nombre de usuario no puede estar vacío";
            error.style.color = "red";
        }
    }, 400);
    
});

document.getElementById("inputEmail").addEventListener("input", function(){
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const valor = this.value.trim();
        if(valor.length > 0){
            fetch("https://nutret.es/Principal/existeEmail", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: valor })
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Error en la red: ' + response.statusText);
                }
                
                return response.json();
            }).then(jsonResponse => {
                const input = document.getElementById("email");
                const error = document.getElementById("error-email");

                if(jsonResponse.result == "Exists"){
                    if(valor === valorPrevioEmail){
                        input.style.borderColor = "green";
                        input.style.outline = "1px solid green";
                        input.style.boxShadow = "0 0 5px green";
                        error.style.display = "none";
                        emailBien = true;
                    }else{
                        input.style.borderColor = "red";
                        input.style.outline = "1px solid red"; 
                        input.style.boxShadow = "0 0 5px red";
                        error.style.display = "block";
                        error.textContent = "El correo electrónico ya existe";
                        error.style.color = "red";
                        emailBien = false;
                    }
                    
                    
                }else{
                    input.style.borderColor = "green";
                    input.style.outline = "1px solid green";
                    input.style.boxShadow = "0 0 5px green";
                    error.style.display = "none";
                    emailBien = true;
                }
            })
            .catch(error => console.error('Error:', error));
        }else{
            emailBien = false;
            const input = document.getElementById("email");
            const error = document.getElementById("error-email");
            input.style.borderColor = "red";
            input.style.outline = "1px solid red"; 
            input.style.boxShadow = "0 0 5px red";
            error.style.display = "block";
            error.textContent = "El correo electrónico no puede estar vacío";
            error.style.color = "red";
        }
    }, 400);
    
});