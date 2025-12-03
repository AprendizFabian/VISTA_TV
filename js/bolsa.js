const tienda = new URLSearchParams(window.location.search).get("tienda");

const fadeOverlay = document.getElementById("fadeOverlay");
const pantallaCarga = document.getElementById("pantallaCarga");
const imagen = document.getElementById("imagen");
const imgContainer = document.getElementById("imgContainer");

// Mostrar imagen con animación tras la carga
setTimeout(() => {
  pantallaCarga.classList.add("oculta");
  imgContainer.classList.add("visible");
  iniciarZoomSecuencial();
}, 2000);

function iniciarZoomSecuencial() {

  // Vista completa inicial (2 segundos)
  setTimeout(() => {

    imagen.classList.add('zoom-section-1');

    setTimeout(() => {
      imagen.classList.remove('zoom-section-1');
      imagen.classList.add('zoom-out');

      setTimeout(() => {
        imagen.classList.remove('zoom-out');
        imagen.classList.add('zoom-section-2');

        setTimeout(() => {
          imagen.classList.remove('zoom-section-2');
          imagen.classList.add('zoom-out');

          setTimeout(() => {
            imagen.classList.remove('zoom-out');
            imagen.classList.add('zoom-section-3');

            setTimeout(() => {
              imagen.classList.remove('zoom-section-3');
              imagen.classList.add('zoom-out');
            }, 8000);

          }, 500);

        }, 8000);

      }, 500);

    }, 8000);

  }, 2000);
}

// Salida con transición blanca
setTimeout(() => {

  setTimeout(() => {
    fadeOverlay.classList.add("activo");

    setTimeout(() => {
      window.location.href = `mejores.html?tienda=${encodeURIComponent(tienda)}`;
    }, 1200);

  }, 1000);

}, 30000);
