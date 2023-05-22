//Variables


//Navigation
function redirigirANombre() {
    window.location.href = "ventanaNombre.html";
}

function redirigirASeleccion() {
    window.location.href = "seleccionModo.html";
}

function redirigirACrear() {
    imagenSeleccionada = document.querySelector('.divPersonaje button.selected');
    if (imagenSeleccionada) {
        window.location.href = 'crearSala.html';
    } else {
        alert('Por favor selecciona un personaje');
    }
}

function redirigirAPartida() {
    window.location.href = "partida.html";
}

function redirigirAUnirse() {
    imagenSeleccionada = document.querySelector('.divPersonaje button.selected');
    if (imagenSeleccionada) {
        window.location.href = 'unirseSala.html';
    } else {
        alert('Por favor selecciona un personaje');
    }
}

//Other functions
function guardarNombre() {
    var valorNombre = document.getElementById("inputNombre").value;
    localStorage.setItem("valorInput", valorNombre);
}


function guardarImg(urlImg){
    localStorage.setItem("imagenPersonaje", urlImg);
    var personajes = document.querySelectorAll('.divPersonaje button');
    for (var i = 0; i < personajes.length; i++) {
        personajes[i].classList.remove('selected');
    }
    event.target.classList.add('selected');
}

window.onload = function() {
    var codigoGenerado = "";
    codigoGenerado = Math.round(Math.random() * (999 - 100) + 100);
    document.getElementById("codigo").innerHTML = codigoGenerado;
}

function verificarNombre() {
    const inputNombre = document.getElementById("inputNombre");
    if (inputNombre.value === "") {
      alert("Debes ingresar un nombre para continuar");
    } else {
      guardarNombre();
      redirigirAPartida();
    }
}

function verificarCodigo() {
    const inputCodigo = document.getElementById("inputCodigo");
    if (inputCodigo.value === "") {
      alert("Debes ingresar un código para unirte");
    } else {
      redirigirAPartida()
    }
}