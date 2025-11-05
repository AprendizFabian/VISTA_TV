const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSUqiPVe2z89H6Gum_WF-13kMUpXse9-epmDlqkurHE9DFp_zUKt1dT4ptzyLfsi3SM8fTXf-AmJvea/pub?output=tsv";

const tienda = new URLSearchParams(window.location.search).get("tienda");
let datos = [];
let index = 0;

// Definición de columnas
const COLUMNAS = {
  DS_SIERRA: [0, 1, 2],
  DS_CHAPINERO: [3, 4, 5]
};

async function cargarDatos() {
  const cont = document.getElementById("contenedor");
  try {
    const res = await fetch(`${SHEET_URL}&nocache=${Date.now()}`);
    const text = await res.text();
    const filas = text.trim().split("\n").slice(1).map(f => f.split("\t"));
    const columnas = COLUMNAS[tienda];

    if (!columnas) {
      cont.innerHTML = "<h2>❌ Tienda no encontrada</h2>";
      return;
    }

    datos = filas.map(f => ({
      nombre: f[columnas[0]]?.trim(),
      mensaje: f[columnas[1]]?.trim(),
      imagen: f[columnas[2]]?.trim()
    })).filter(x => x.nombre);

    if (datos.length > 0) mostrarActual();
    else cont.innerHTML = "<p>No hay cumpleaños hoy 🎂</p>";
  } catch (err) {
    cont.innerHTML = "<p>Error al cargar datos 😢</p>";
    console.error(err);
  }
}

function mostrarActual() {
  const c = datos[index];
  const cont = document.getElementById("contenedor");
  cont.innerHTML = `
    <h1 class="title">🎂 ¡Feliz Cumpleaños!</h1>
    <img src="${c.imagen}" class="photo" alt="${c.nombre}">
    <div class="nombre">${c.nombre}</div>
    <div class="mensaje">${c.mensaje}</div>
  `;
  lanzarConfeti();
  index = (index + 1) % datos.length;
}

// 🎊 Animación de confeti
function lanzarConfeti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const particles = [];
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      r: Math.random() * 6 + 2,
      d: Math.random() * 20 + 10,
      color: `hsl(${Math.random() * 60 + 40},100%,50%)`
    });
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.r, p.r);
      p.y += Math.cos(p.d) + 2;
      p.x += Math.sin(p.d);
      if (p.y > canvas.height) p.y = 0;
    }
    requestAnimationFrame(draw);
  }
  draw();
}

cargarDatos();
setInterval(mostrarActual, 12000);
setInterval(cargarDatos, 30000);
