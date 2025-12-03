const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSUqiPVe2z89H6Gum_WF-13kMUpXse9-epmDlqkurHE9DFp_zUKt1dT4ptzyLfsi3SM8fTXf-AmJvea/pub?gid=0&single=true&output=tsv";

const tienda = new URLSearchParams(window.location.search).get("tienda");

const cont = document.getElementById("contenedor");
const pantallaCarga = document.getElementById("pantallaCarga");
const fadeOverlay = document.getElementById("fadeOverlay");

const RANGOS = {
  DS_CHICO: { filaEmpleado: 23, columnas: [0, 1, 2] },
  DS_CHAPINERO: { filaEmpleado: 23, columnas: [5, 6, 7] }
};

async function cargarEmpleado() {
  try {
    const res = await fetch(`${SHEET_URL}&nocache=${Date.now()}`);
    const text = await res.text();
    const filas = text.trim().split("\n").map(f => f.split("\t"));
    const conf = RANGOS[tienda];

    if (!conf) return saltoRapido();

    const fila = filas[conf.filaEmpleado] || [];
    const nombre = (fila[conf.columnas[0]] || "").trim();
    const mensaje = (fila[conf.columnas[1]] || "").trim();
    const imagen = (fila[conf.columnas[2]] || "").trim();

    if (![nombre, mensaje, imagen].some(v => v && v.length > 0)) {
      return saltoRapido();
    }

    pantallaCarga.classList.add("oculta");
    cont.classList.add("visible");

    cont.innerHTML = `
      <h1 class="title">🏆 Empleado del Mes</h1>
      ${imagen ? `<img src="${imagen}" class="photo" alt="${nombre}">` : ""}
      ${nombre ? `<div class="nombre">${nombre}</div>` : ""}
      <div class="mensaje">${mensaje || "Por su excelente desempeño"}</div>
    `;

    lanzarConfeti();

    setTimeout(() => animarSalida("motivacional.html"), 30000);

  } catch {
    saltoRapido();
  }
}

function saltoRapido() {
  setTimeout(() => {
    fadeOverlay.classList.add("activo");
    setTimeout(() => {
      window.location.href = `motivacional.html?tienda=${encodeURIComponent(tienda)}`;
    }, 900);
  }, 300);
}

function animarSalida(destino) {
  fadeOverlay.classList.add("activo");
  setTimeout(() => {
    window.location.href = `${destino}?tienda=${encodeURIComponent(tienda)}`;
  }, 1000);
}

function lanzarConfeti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const p = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    r: Math.random() * 6 + 2,
    d: Math.random() * 20 + 10,
    color: `hsl(${Math.random() * 60 + 40}, 100%, 50%)`
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

cargarEmpleado();
