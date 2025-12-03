const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSUqiPVe2z89H6Gum_WF-13kMUpXse9-epmDlqkurHE9DFp_zUKt1dT4ptzyLfsi3SM8fTXf-AmJvea/pub?gid=0&single=true&output=tsv";

const NORMALIZAR = txt =>
  txt?.toUpperCase()
     .replace(/\s+/g, "")
     .replace(/-/g, "")
     .replace(/_/g, "") || "";

const tiendaBruta = new URLSearchParams(window.location.search).get("tienda");
const tienda = NORMALIZAR(tiendaBruta);

const cont = document.getElementById("contenedor");
const pantallaCarga = document.getElementById("pantallaCarga");
const fadeOverlay = document.getElementById("fadeOverlay");
const logo = document.getElementById("logo");

const RANGOS = {
  DSCHICO: { inicio: 3, fin: 20, columnas: [0, 1, 2] },
  CHICO:   { inicio: 3, fin: 20, columnas: [0, 1, 2] },

  DSCHAPINERO: { inicio: 3, fin: 20, columnas: [5, 6, 7] },
  CHAPINERO:   { inicio: 3, fin: 20, columnas: [5, 6, 7] }
};

let index = 0, datos = [];

async function cargarDatos() {
  try {
    const res = await fetch(`${SHEET_URL}&nocache=${Date.now()}`);
    const text = await res.text();
    const filas = text.trim().split("\n").map(f => f.split("\t"));

    const conf = RANGOS[tienda];
    if (!conf) return animarSalida("empleado.html");

    datos = filas.slice(conf.inicio, conf.fin).map(f => ({
      nombre: f[conf.columnas[0]]?.trim(),
      mensaje: f[conf.columnas[1]]?.trim(),
      imagen: f[conf.columnas[2]]?.trim()
    })).filter(x => x.nombre);

    setTimeout(() => {
      pantallaCarga.classList.add("oculta");
      if (datos.length) {
        cont.classList.add("visible");
        mostrarActual();
      } else {
        setTimeout(() => animarSalida("empleado.html"), 1500);
      }
    }, 2000);
  } catch (e) {
    setTimeout(() => animarSalida("empleado.html"), 1500);
  }
}

function mostrarActual() {
  const c = datos[index];
  cont.innerHTML = `
    <img src="${c.imagen}" class="photo" alt="${c.nombre}">
    <h1 class="title">🎂 ¡Feliz Cumpleaños!</h1>
    <div class="nombre">${c.nombre}</div>
    <div class="mensaje">${c.mensaje}</div>`;

  lanzarConfeti();

  index++;
  if (index < datos.length) setTimeout(mostrarActual, 10000);
  else setTimeout(() => animarSalida("empleado.html"), 12000);
}

function animarSalida(destino) {
  logo.classList.add("hide");
  setTimeout(() => {
    fadeOverlay.classList.add("activo");
    setTimeout(() => {
      window.location.href = `${destino}?tienda=${encodeURIComponent(tiendaBruta)}`;
    }, 1000);
  }, 1000);
}

function lanzarConfeti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const p = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    r: Math.random() * 6 + 2,
    d: Math.random() * 20 + 10,
    color: `hsl(${Math.random() * 60 + 40},100%,50%)`
  }));

  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const o of p) {
      ctx.fillStyle = o.color;
      ctx.fillRect(o.x, o.y, o.r, o.r);
      o.y += Math.cos(o.d) + 2;
      o.x += Math.sin(o.d);
      if (o.y > canvas.height) o.y = 0;
    }
    requestAnimationFrame(draw);
  })();
}

cargarDatos();
