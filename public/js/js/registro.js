var userBien = false;
var passBien = false;
var emailBien = false;
var debounceTimer;

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-,._$€]).{6,}$/;

function register(e){
    e.preventDefault();

    const user = document.getElementById("user").value;
    const pass = document.getElementById("passwd1").value;
    const pass2 = document.getElementById("passwd2").value;
    const email = document.getElementById("email1").value;
    const email2 = document.getElementById("email2").value;
    const nombre = document.getElementById("nombre").value;
    const apellidos = document.getElementById("apellidos").value;

    // Validación final del regex de contraseña
    if (!passwordRegex.test(pass)) {
        const error = document.getElementById("error-pass");
        const passwd1 = document.getElementById("passwd1");
        passwd1.style.borderColor = "red";
        passwd1.style.outline = "1px solid red";
        passwd1.style.boxShadow = "0 0 5px red";
        error.style.display = "block";
        error.textContent = "La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un carácter especial (-,._$€)";
        error.style.color = "red";
        passBien = false;
        return;
    }

    if(userBien){
        if(passBien){
            if(emailBien){
                const data = {
                    user: user,
                    passwd: pass,
                    email: email,
                    nombre: nombre,
                    apellidos: apellidos
                };

                fetch('https://nutret.es/Principal/signIn', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la red: ' + response.statusText);
                    }

                    return response.json();
                }).then(jsonResponse => {
                    window.location.replace(jsonResponse.url)
                })
                .catch(error => console.error('Error:', error));
            }
        }
    }

}


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("user").addEventListener("input", function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            fetch("https://nutret.es/Principal/existeUsername", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: this.value }),
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Error en la red: ' + response.statusText);
                }
                
                return response.json();
            }).then(jsonResponse => {
                const input = document.getElementById("user");
                const error = document.getElementById("error-user");

                if(jsonResponse.result == "Exists"){
                    input.style.borderColor = "red";
                    input.style.outline = "1px solid red";  // <-- añade esto
                    input.style.boxShadow = "0 0 5px red";
                    error.style.display = "block";
                    error.textContent = "El nombre de usuario ya existe";
                    error.style.color = "red";
                    userBien = false;
                    
                }else{
                    input.style.borderColor = "green";
                    input.style.outline = "1px solid green";
                    input.style.boxShadow = "0 0 5px green";
                    error.style.display = "none";
                    userBien = true;
                }
            })
            .catch(error => console.error('Error:', error));
        }, 400);
        
        
    });

    document.getElementById("email1").addEventListener("input", function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            fetch("https://nutret.es/Principal/existeEmail", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: this.value })
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Error en la red: ' + response.statusText);
                }
                
                return response.json();
            }).then(jsonResponse => {
                const error = document.getElementById("error-email");
                if(jsonResponse.result === "Exists"){
                    this.style.borderColor = "red";
                    this.style.outline = "1px solid red";
                    this.style.boxShadow = "0 0 5px red";
                    error.style.display = "block";
                    error.textContent = "El email ya esta siendo utilizado por otro usuario";
                    error.style.color = "red";
                    emailBien = false;
                }else{
                    this.style.borderColor = "green";
                    this.style.outline = "1px solid green";
                    this.style.boxShadow = "0 0 5px green";
                    error.style.display = "none";
                    emailBien = true;
                }
            }).catch(error => console.error('Error:', error));
        }, 400);
        
    });

    document.getElementById("email2").addEventListener("input", function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const email1 = document.getElementById("email1");
            const error = document.getElementById("error-email");

            if(email1.value !== this.value){
                this.style.borderColor = "red";
                this.style.outline = "1px solid red";
                this.style.boxShadow = "0 0 5px red";
                email1.style.borderColor = "red";
                email1.style.outline = "1px solid red";
                email1.style.boxShadow = "0 0 5px red";
                error.style.display = "block";
                error.textContent = "Los emails tienen que coincidir";
                error.style.color = "red";
                emailBien = false;
            } else {
                // Coinciden — ahora verificamos si ya existe
                fetch("https://nutret.es/Principal/existeEmail", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: this.value })
                })
                .then(response => response.json())
                .then(jsonResponse => {
                    if(jsonResponse.result === "Exists"){
                        // Pinta los dos en rojo
                        [email1, this].forEach(input => {
                            input.style.borderColor = "red";
                            input.style.outline = "1px solid red";
                            input.style.boxShadow = "0 0 5px red";
                        });
                        error.style.display = "block";
                        error.textContent = "El email ya está siendo utilizado por otro usuario";
                        error.style.color = "red";
                        emailBien = false;
                    } else {
                        // Todo bien
                        [email1, this].forEach(input => {
                            input.style.borderColor = "green";
                            input.style.outline = "1px solid green";
                            input.style.boxShadow = "0 0 5px green";
                        });
                        error.style.display = "none";
                        emailBien = true;
                    }
                })
                .catch(err => console.error('Error:', err));
            }
        }, 400);
    });

    document.getElementById("email1").addEventListener("input", function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const email1 = this;
            const email2 = document.getElementById("email2");
            const error = document.getElementById("error-email");

            if (email2.value && email1.value !== email2.value) {
                this.style.borderColor = "red";
                this.style.outline = "1px solid red";
                this.style.boxShadow = "0 0 5px red";
                email2.style.borderColor = "red";
                email2.style.outline = "1px solid red";
                email2.style.boxShadow = "0 0 5px red";
                error.style.display = "block";
                error.textContent = "Los emails tienen que coincidir";
                error.style.color = "red";
                emailBien = false;
            } else if (email2.value && email1.value === email2.value) {
                // Coinciden — ahora verificamos si ya existe
                fetch("https://nutret.es/Principal/existeEmail", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: this.value })
                })
                .then(response => response.json())
                .then(jsonResponse => {
                    if(jsonResponse.result === "Exists"){
                        // Pinta los dos en rojo
                        [email1, email2].forEach(input => {
                            input.style.borderColor = "red";
                            input.style.outline = "1px solid red";
                            input.style.boxShadow = "0 0 5px red";
                        });
                        error.style.display = "block";
                        error.textContent = "El email ya está siendo utilizado por otro usuario";
                        error.style.color = "red";
                        emailBien = false;
                    } else {
                        // Todo bien
                        [email1, email2].forEach(input => {
                            input.style.borderColor = "green";
                            input.style.outline = "1px solid green";
                            input.style.boxShadow = "0 0 5px green";
                        });
                        error.style.display = "none";
                        emailBien = true;
                    }
                })
                .catch(err => console.error('Error:', err));
            } else {
                // email2 vacío, quitar estilos de error
                this.style.borderColor = "";
                this.style.outline = "";
                this.style.boxShadow = "";
                email2.style.borderColor = "";
                email2.style.outline = "";
                email2.style.boxShadow = "";
                error.style.display = "none";
                emailBien = false;
            }
        }, 400);

    });

    document.getElementById("passwd1").addEventListener("input", function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const passwd1 = this;
            const passwd2 = document.getElementById("passwd2");
            const error = document.getElementById("error-pass");

            // Validar regex de la contraseña
            if (!passwordRegex.test(this.value)) {
                this.style.borderColor = "red";
                this.style.outline = "1px solid red";
                this.style.boxShadow = "0 0 5px red";
                error.style.display = "block";
                error.textContent = "La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un carácter especial (-,._$€)";
                error.style.color = "red";
                passBien = false;
                return;
            }

            // Si el regex pasa, verificar coincidencia con passwd2
            if (passwd2.value && this.value !== passwd2.value) {
                this.style.borderColor = "red";
                this.style.outline = "1px solid red";
                this.style.boxShadow = "0 0 5px red";
                passwd2.style.borderColor = "red";
                passwd2.style.outline = "1px solid red";
                passwd2.style.boxShadow = "0 0 5px red";
                error.style.display = "block";
                error.textContent = "Las contraseñas tienen que coincidir";
                error.style.color = "red";
                passBien = false;
            } else if (passwd2.value && this.value === passwd2.value) {
                this.style.borderColor = "green";
                this.style.outline = "1px solid green";
                this.style.boxShadow = "0 0 5px green";
                passwd2.style.borderColor = "green";
                passwd2.style.outline = "1px solid green";
                passwd2.style.boxShadow = "0 0 5px green";
                error.style.display = "none";
                passBien = true;
            } else {
                // Solo regex válido, passwd2 vacío
                this.style.borderColor = "green";
                this.style.outline = "1px solid green";
                this.style.boxShadow = "0 0 5px green";
                error.style.display = "none";
                passBien = false; // No marcar como bien hasta que coincidan
            }
        }, 400);

    });

    document.getElementById("passwd2").addEventListener("input", function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const passwd1 = document.getElementById("passwd1");
            const passwd2 = this;
            const error = document.getElementById("error-pass");

            // Primero verificar que passwd1 cumpla con el regex
            if (!passwordRegex.test(passwd1.value)) {
                passwd1.style.borderColor = "red";
                passwd1.style.outline = "1px solid red";
                passwd1.style.boxShadow = "0 0 5px red";
                this.style.borderColor = "red";
                this.style.outline = "1px solid red";
                this.style.boxShadow = "0 0 5px red";
                error.style.display = "block";
                error.textContent = "La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un carácter especial (-,._$€)";
                error.style.color = "red";
                passBien = false;
                return;
            }

            // Verificar coincidencia
            if (passwd1.value !== this.value) {
                this.style.borderColor = "red";
                this.style.outline = "1px solid red";
                this.style.boxShadow = "0 0 5px red";
                passwd1.style.borderColor = "red";
                passwd1.style.outline = "1px solid red";
                passwd1.style.boxShadow = "0 0 5px red";
                error.style.display = "block";
                error.textContent = "Las contraseñas tienen que coincidir";
                error.style.color = "red";
                passBien = false;
            } else {
                this.style.borderColor = "green";
                this.style.outline = "1px solid green";
                this.style.boxShadow = "0 0 5px green";
                passwd1.style.borderColor = "green";
                passwd1.style.outline = "1px solid green";
                passwd1.style.boxShadow = "0 0 5px green";
                error.style.display = "none";
                passBien = true;
            }
        }, 400);

    });
});