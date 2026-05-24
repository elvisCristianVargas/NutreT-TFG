// Nueva función para navegación asíncrona (SPA-like)
async function navigateTo(route) {
    try {
        // Mostrar loader mientras carga
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'flex';

        const response = await fetch(route);
        if (!response.ok) {
            throw new Error('Error al cargar la vista: ' + response.statusText);
        }

        const html = await response.text();
        
        // Limpiar el contenedor principal antes de cargar nuevo contenido (evita acumulación de RAM)
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            // Remover event listeners antiguos para evitar memory leaks
            mainContent.innerHTML = '';
            mainContent.innerHTML = html;
        } else {
            // Si no hay contenedor específico, reemplazar todo el body (menos header/footer si los tienes)
            document.body.innerHTML = html;
        }

        // Actualizar la URL del navegador sin recargar (para navegación browser-friendly)
        history.pushState(null, '', route);

        // Ocultar loader
        if (loader) loader.style.display = 'none';

        // Re-ejecutar scripts o inicializaciones si es necesario (ej. volver a llamar loadPrincipal si aplica)
        // Ejemplo: Si la nueva vista necesita datos, llama a funciones específicas aquí

    } catch (error) {
        console.error('Error en navegación:', error);
        if (loader) loader.style.display = 'none';
        // Mostrar error en UI
        alert('Error al cargar la página. Intenta recargar.');
    }
}

// Manejar navegación del browser (botones atrás/adelante)
window.addEventListener('popstate', function(event) {
    // Recargar la página actual al navegar con browser buttons (o implementar lógica para recargar vista)
    window.location.reload();
});

// 
function sendData(e){
    e.preventDefault();

    const user = document.getElementById("user").value;
    const pass = document.getElementById("passwd").value;
    const recordar = document.getElementById("recordar").checked;

    const data = {
        user: user,
        passwd: pass,
        recordar: recordar ? "on" : "off"
    };
    

    fetch('https://nutret.es/Principal/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then(response => {
        if (!response.ok) {
            throw new Error('Error en la red: ' + response.statusText);
        }
        
        let res=  response.json();
        return res;
        
    }).then(jsonResponse => displayResponse(jsonResponse))
    .catch(error => console.error('Error:', error));
}

function displayResponse(data) {
    
    if (data.result == "Correct" && !data.logged) {
        document.getElementById("error").style.display = "block";

    }else if(data.result == "Correct" && data.logged){
        window.location.replace(data.url + "/Principal");

    }else{
        document.getElementById("error").style.display = "none";

    }
}

