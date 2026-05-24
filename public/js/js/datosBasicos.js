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
                    divnavUser.innerHTML = `<a href="/Perfil" class="enlaces urls"><img class="iconoPerfil" src="${datos.url}/storage/uploads/profile/${datos.imagenUser}" alt="Icono de el usuario" style="height: 40px; width: 40px; min-width: 40px; border-radius: 50%; border: 3px solid #2D6A4F; object-fit: cover; display: block;"></a>`;
                }else{
                    divnavUser.innerHTML = `<a href="/Perfil" class="enlaces urls"><img class="iconoPerfil" src="${datos.url}/public/img/user.png" alt="Icono de el usuario" style="height: 2.5vh; width: 2.5vh;"></a>`;

                }
            }else{
                divnavUser.innerHTML = `<a class="enlaces urls" href="/Principal/loginView">Inicio Sesión</a>
                            <a class="enlaces urls" id="registro" href="/Principal/registro">Registrarse</a>`;
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
