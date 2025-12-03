const API_MES_PASADO="https://proxy-eight-taupe-93.vercel.app/api/mesPasado.js";
const API_MES_ACTUAL="https://proxy-eight-taupe-93.vercel.app/api/mesActual.js";
const SHEET="https://docs.google.com/spreadsheets/d/e/2PACX-1vSUqiPVe2z89H6Gum_WF-13kMUpXse9-epmDlqkurHE9DFp_zUKt1dT4ptzyLfsi3SM8fTXf-AmJvea/pub?gid=1247726367&single=true&output=tsv";

const DURACION = 15000;

// LEER TIENDA DESDE URL
const tiendaURL = new URLSearchParams(window.location.search).get("tienda") ?? "";

const num = v => v==null||v===""?null:Number(v);
const parseMeta = v => v ? Number(v.replace(",",".")) : null;

function getMetas(tsv){
  const f = tsv.trim().split("\n").map(r=>r.split("\t"))[1];
  return { 
    defect : parseMeta(f[3]), 
    instore: parseMeta(f[4]) 
  };
}

function metaClass(v,m){
  if(v==null||m==null) return "";
  if(v<=m) return "cell-ok";
  if(v<=m*1.2) return "cell-warn";
  return "cell-bad";
}

async function cargarIndicadores(){

  const [p,a,m] = await Promise.all([
    fetch(API_MES_PASADO).then(r=>r.json()),
    fetch(API_MES_ACTUAL).then(r=>r.json()),
    fetch(SHEET).then(r=>r.text())
  ]);

  const metas = getMetas(m);

  const rP = p.query_result.data.rows[0];
  const pasado = {
    tienda: rP.Tienda,
    ordenes: num(rP.Ordenes),
    defect : num(rP.DefectRate),
    instore: num(rP.InStoreTime)
  };

  const semanas = a.query_result.data.rows.map((x,i)=>({
    etiqueta:`SEMANA ${i+1}`,
    ordenes:num(x.Ordenes),
    defect:num(x.DefectRate),
    instore:num(x.InStoreTime)
  }));

  document.getElementById("campoDarkstore").textContent =
      tiendaURL !== "" ? tiendaURL : (pasado.tienda || "—");

  document.getElementById("campoMes").textContent =
    new Date().toLocaleString("es-CO",{ month:"long" }).toUpperCase();

  let html = `
    <tr class="tr-meta">
      <th class="row-label">METAS</th>
      <td class="cell">—</td>
      <td class="cell">${metas.defect}%</td>
      <td class="cell">${metas.instore}m</td>
    </tr>
  `;

  html += `
    <tr>
      <th class="row-label">MES PASADO</th>
      <td class="cell">${pasado.ordenes ?? "—"}</td>
      <td class="cell ${metaClass(pasado.defect, metas.defect)}">${pasado.defect}%</td>
      <td class="cell ${metaClass(pasado.instore, metas.instore)}">${pasado.instore}m</td>
    </tr>
  `;

  semanas.forEach(s=>{
    html += `
      <tr>
        <th class="row-label">${s.etiqueta}</th>
        <td class="cell">${s.ordenes ?? "—"}</td>
        <td class="cell ${metaClass(s.defect, metas.defect)}">${s.defect}%</td>
        <td class="cell ${metaClass(s.instore, metas.instore)}">${s.instore}m</td>
      </tr>
    `;
  });

  document.getElementById("tablaBody").innerHTML = html;
}

function animarSalida(){
  document.getElementById("fadeOverlay").classList.add("activo");
  setTimeout(()=>{
    location.href=`cumple.html?tienda=${encodeURIComponent(tiendaURL)}`;
  },1000);
}

window.addEventListener("load", async ()=>{
  await cargarIndicadores();
  document.getElementById("pantallaCarga").classList.add("oculta");
  document.getElementById("mainContent").classList.add("visible");
  setTimeout(animarSalida, DURACION);
});
