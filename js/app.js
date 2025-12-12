document.addEventListener("DOMContentLoaded", () => {

  const tiendas = [
    "DS_PARQUE_DEL_PERRO",
    "DS_CASTELLANA",
    "DS_LAS_COLINAS",
    "DS_MAR_DEL_NORTE",
    "DS_MANGA",
    "DS_BOCAGRANDE",
    "DS_COUNTRY",
    "DS_CHICO",
    "DS_PALERMO",
    "DS_EL_POLO",
    "DS_CEDRITOS",
    "DS_COMUNEROS",
    "DS_COLINA",
    "DS_NIZA",
    "DS_ISERRA_100",
    "DS_MANILA",
    "DS_ENGATIVÁ_OCCIDENTAL",
    "DS_PARQUE_BAVARIA",
    "DS_ENVIGADO_ALTO",
    "DS_SABANETA",
    "DS_GRANADA_NORTE",
    "DS_LA_MOTA",
    "DS_LA_PLAYA",
    "DS_LA_CABAÑA",
    "DS_CHAPINERO",
    "DS_LA_FRONTERA",
    "DS_VILLA_ ANDALUCÍA_BAQ",
    "DS_SAN_PATRICIO",
    "DS_USAQUÉN",
    "DS_TESORO",
    "DS_ENVIGADO_BAJO",
    "DS_SUBA_TURINGIA",
    "DS_VERBENAL",
    "DS_AMERICAS",
    "DS_EL_POBLADO_BAQ",
    "DS_EL_PRADO_BAQ",
    "DS_BARRANCAS",
    "DS_LAURELES",
    "DS_TITÁN",
    "DS_ESPERANZA",
    "DS_MODELIA",
    "DS_CHILACOS",
    "DS_SAN_VICENTE",
    "DS_CAÑAVERAL",
    "DS_LIMONAR",
    "DS_SAN_PABLO",
    "DS_C_JARDÍN",
    "DS_ARMENIA",
    "DS_PEREIRA",
    "DS_ALAMEDA",
    "DS_IBAGUÉ",
    "DS_CABECERA",
    "DS_BAVARIA_SM",
    "DS_VILLAVICENCIO",
    "DS_QUINTA CAMACHO",
    "DS_RODADERO_SM",
    "DS_VALLEDUPAR"
  ];

  const input = document.getElementById("tiendaInput");
  const lista = document.getElementById("listaTiendas");
  const boton = document.getElementById("btnIngresar");

  let tiendaSeleccionada = "";

  function mostrarLista(filtro = "") {
    lista.innerHTML = "";

    const filtradas = tiendas.filter(t =>
      t.toLowerCase().includes(filtro.toLowerCase())
    );

    filtradas.forEach(tienda => {
      const div = document.createElement("div");
      div.textContent = tienda;

      div.onclick = () => {
        input.value = tienda;
        tiendaSeleccionada = tienda;
        lista.style.display = "none";
      };

      lista.appendChild(div);
    });

    lista.style.display = filtradas.length ? "block" : "none";
  }

  input.addEventListener("focus", () => mostrarLista());
  input.addEventListener("input", e => {
    tiendaSeleccionada = "";
    mostrarLista(e.target.value);
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".combo")) {
      lista.style.display = "none";
    }
  });

  boton.addEventListener("click", () => {
    if (!tiendaSeleccionada) {
      const valor = input.value.trim();
      if (tiendas.includes(valor)) {
        tiendaSeleccionada = valor;
      }
    }

    if (!tiendaSeleccionada) {
      alert("Por favor selecciona una tienda válida");
      return;
    }

    const base = window.location.href.replace(/index\.html(\?.*)?$/, "");
    window.location.href =
      `${base}cumple.html?tienda=${encodeURIComponent(tiendaSeleccionada)}`;
  });

});
