document.getElementById("btnIngresar").addEventListener("click", irATienda);

function irATienda() {
  const tienda = document.getElementById("tienda").value;

  if (!tienda) {
    alert("Por favor selecciona una tienda");
    return;
  }

  const base = window.location.origin + window.location.pathname.replace("index.html", "");

  window.location.href = `${base}cumple.html?tienda=${encodeURIComponent(tienda)}`;
}
