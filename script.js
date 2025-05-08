
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQSS-dXFxKKcMsWYmSaclKu4vzEA0OrK0viW4zbSiwhLuo8qiBa0kr9BJ-6yDp2MM7OfUd9dhaj-iTP/pub?output=csv";

let preguntas = [];
let preguntasFiltradas = [];
let current = 0;
let timer = null;
let tickSound = null;
let endSound = null;

document.addEventListener("DOMContentLoaded", () => {
  fetch(csvUrl)
    .then(response => response.text())
    .then(data => {
      preguntas = parseCSV(data);
      cargarTemas(preguntas);
      document.getElementById("total").textContent = `Total de preguntas disponibles: ${preguntas.length}`;
    });

  tickSound = document.getElementById("tick-sound");
  endSound = document.getElementById("end-sound");

  document.getElementById("cargar-preguntas").addEventListener("click", () => {
    const seleccionados = Array.from(document.querySelectorAll("input[name='tema']:checked")).map(cb => cb.value);
    if (seleccionados.length === 0 || seleccionados.length > 3) {
      alert("Selecciona entre 1 y 3 temas.");
      return;
    }
    preguntasFiltradas = preguntas.filter(p => seleccionados.includes(p.tema));
    preguntasFiltradas = shuffleArray(preguntasFiltradas).slice(0, 15);
    current = 0;
    document.getElementById("tema-selector").classList.add("hidden");
    document.getElementById("pregunta-box").classList.remove("hidden");
    document.getElementById("navegacion").classList.remove("hidden");
    mostrarPregunta();
  });

  document.getElementById("siguiente").addEventListener("click", () => {
    if (current < preguntasFiltradas.length - 1) {
      current++;
      mostrarPregunta();
    } else {
      alert("Fin de las preguntas.");
    }
  });

  document.getElementById("ver-respuesta").addEventListener("click", () => {
    mostrarRespuesta();
    clearInterval(timer);
    document.getElementById("barra").style.width = "0%";
  });
});

function parseCSV(data) {
  const lines = data.trim().split("\n");
  return lines.map(line => {
    const [pregunta, respuesta, tema] = line.split(",");
    return { pregunta, respuesta, tema };
  });
}

function cargarTemas(preguntas) {
  const temas = [...new Set(preguntas.map(p => p.tema))];
  const contenedor = document.getElementById("temas");
  temas.forEach(tema => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" name="tema" value="${tema}"> ${tema}`;
    contenedor.appendChild(label);
    contenedor.appendChild(document.createElement("br"));
  });
}

function mostrarPregunta() {
  const p = preguntasFiltradas[current];
  document.getElementById("tema").textContent = p.tema;
  document.getElementById("pregunta").textContent = p.pregunta;
  document.getElementById("respuesta").classList.add("hidden");
  document.getElementById("respuesta").textContent = p.respuesta;
  document.getElementById("barra").style.width = "100%";
  document.getElementById("barra").style.background = "green";
  iniciarCuentaRegresiva(58);
}

function mostrarRespuesta() {
  document.getElementById("respuesta").classList.remove("hidden");
}

function iniciarCuentaRegresiva(segundos) {
  let tiempo = segundos;
  clearInterval(timer);
  timer = setInterval(() => {
    tiempo--;
    let porcentaje = (tiempo / segundos) * 100;
    document.getElementById("barra").style.width = porcentaje + "%";
    if (tiempo === 38) {
      document.getElementById("barra").style.background = "yellow";
    } else if (tiempo === 20) {
      document.getElementById("barra").style.background = "red";
    }
    if (tiempo <= 0) {
      clearInterval(timer);
      document.getElementById("barra").style.width = "0%";
      mostrarRespuesta();
      endSound.play();
    } else {
      tickSound.play();
    }
  }, 1000);
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
