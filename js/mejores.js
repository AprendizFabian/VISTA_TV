/* APIs */
const API_MEJORES = "https://proxy-eight-taupe-93.vercel.app/api/topMejores.js";
const API_PEORES  = "https://proxy-eight-taupe-93.vercel.app/api/topPeores.js";

/* TIENDA */
const tienda = new URLSearchParams(window.location.search).get("tienda");

/* CONFETI */
function confettiBoom(){
  const c = document.getElementById("confetti");
  const ctx = c.getContext("2d");
  c.width = innerWidth; 
  c.height = innerHeight;

  const parts = [...Array(80)].map(() => ({
    x: Math.random() * c.width,
    y: Math.random() * -c.height,
    size: 4 + Math.random() * 4,
    speed: 1 + Math.random() * 2,
    col: `hsl(${40 + Math.random() * 60},100%,50%)`
  }));

  (function loop(){
    ctx.clearRect(0,0,c.width,c.height);
    for(const p of parts){
      ctx.fillStyle = p.col;
      ctx.fillRect(p.x,p.y,p.size,p.size);
      p.y += p.speed;
      if(p.y > c.height) p.y = -10;
    }
    requestAnimationFrame(loop);
  })();
}

/* UTIL */
const pick=(o,k)=>k.map(x=>o[x]).find(v=>v!=null);

const normalize = r => {
  if(!Array.isArray(r)) return [];
  return r.map(a => ({
    picker : pick(a,["Picker","picker_name","picker"]) || "Sin nombre",
    ordenes: Number(pick(a,["Ordenes","orders","count"])) || 0,
    tiempo : Number(pick(a,["InStoreTime","in_store"])) || 0
  }));
};

function render(target,data,tipo){
  if(!data.length){
    target.innerHTML = `<div class="row"><div>No hay datos</div></div>`;
    return;
  }

  target.innerHTML = data.map((x,i)=>`
    <div class="row">
      <div class="medal ${["g1","g2","g3"][i]||"gx"}">${i+1}</div>
      <div class="picker">${x.picker}</div>

      <div class="metric">
        <span class="pill">Órdenes</span>
        <div class="bar bar-ordenes"><i></i></div>
        <span class="tiny">${x.ordenes}</span>
      </div>

      <div class="metric">
        <span class="pill">In-Store</span>
        <div class="bar ${tipo==="peor"?"bar-malo":"bar-tiempo"}"><i></i></div>
        <span class="tiny">${x.tiempo.toFixed(2)}m</span>
      </div>

      <div class="pill">Score: ${x.ordenes}</div>
    </div>
  `).join("");

  const maxOrd = Math.max(...data.map(d=>d.ordenes),1);
  const maxTime = Math.max(...data.map(d=>d.tiempo),1);

  requestAnimationFrame(()=>{
    [...target.querySelectorAll(".row")].forEach((row,i)=>{
      const d=data[i];
      row.querySelectorAll(".bar i")[0].style.width = (d.ordenes / maxOrd * 100) + "%";
      row.querySelectorAll(".bar i")[1].style.width = (d.tiempo  / maxTime * 100) + "%";
    });
  });
}

/* SALIDA */
function animarSalida(){
  document.getElementById("logo")?.classList.add("hide");
  const fade = document.getElementById("fadeOverlay");

  setTimeout(()=> fade.classList.add("activo"),300);

  setTimeout(()=>{
    window.location.href = `indicadores.html?tienda=${encodeURIComponent(tienda)}`;
  },1500);
}

/* INIT */
async function init(){
  let mejores = [], peores = [];

  try {
    const [r1, r2] = await Promise.all([
      fetch(API_MEJORES).then(r=>r.json()),
      fetch(API_PEORES).then(r=>r.json())
    ]);

    mejores = normalize(r1?.query_result?.data?.rows);
    peores  = normalize(r2?.query_result?.data?.rows);

  } catch (e) {
    console.error("Error APIs:", e);
  }

  if(!mejores.length) mejores=[{picker:"Sin datos",ordenes:0,tiempo:0}];
  if(!peores.length)  peores=[{picker:"Sin datos",ordenes:0,tiempo:0}];

  render(document.getElementById("boardMejores"), mejores, "mejor");

  document.getElementById("pantallaCarga").classList.add("oculta");

  const p1 = document.getElementById("pantalla1");
  const p2 = document.getElementById("pantalla2");

  p1.classList.add("visible");
  confettiBoom();

  setTimeout(() => {
    document.getElementById("confetti").style.display="none";
    p1.classList.remove("visible");

    render(document.getElementById("boardPeores"), peores, "peor");
    p2.classList.add("visible");

    setTimeout(animarSalida, 9000);
  }, 11000);
}

init();
