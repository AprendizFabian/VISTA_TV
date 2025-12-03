const MOTIVACIONAL_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSUqiPVe2z89H6Gum_WF-13kMUpXse9-epmDlqkurHE9DFp_zUKt1dT4ptzyLfsi3SM8fTXf-AmJvea/pub?gid=734092806&single=true&output=tsv";

const tienda = new URLSearchParams(window.location.search).get("tienda");
const pantallaCarga = document.getElementById("pantallaCarga");

async function cargarFrase() {
  try {
    const res = await fetch(`${MOTIVACIONAL_URL}&nocache=${Date.now()}`);
    const text = await res.text();
    const filas = text.trim().split("\n").map(f => f.split("\t"));
    const frases = filas.slice(1, 50).filter(f => f[0]?.trim());

    setTimeout(() => {
      pantallaCarga.classList.add("oculta");

      if (frases.length === 0) {
        setTimeout(() => transicion("bolsa.html"), 1500);
        return;
      }

      const aleatoria = frases[Math.floor(Math.random() * frases.length)];
      document.getElementById("mensaje").textContent = `"${aleatoria[0].trim()}"`;
      document.getElementById("autor").textContent = aleatoria[1] ? `— ${aleatoria[1].trim()}` : "";

      setTimeout(() => transicion("bolsa.html"), 30000);
    }, 2000);
  } catch (e) {
    console.error("Error al cargar motivacional:", e);
    setTimeout(() => transicion("bolsa.html"), 2000);
  }
}

function transicion(destino) {
  pantallaCarga.classList.remove("oculta");
  pantallaCarga.style.opacity = "1";
  setTimeout(() => {
    window.location.href = `${destino}?tienda=${encodeURIComponent(tienda)}`;
  }, 1200);
}

cargarFrase();
