// ========================================
// WEATHERNOW - APLICAÇÃO DE PREVISÃO DO TEMPO
// ========================================

const API_KEY = "26846a2cfbd518d445b33f77e34c97ab";
const API_BASE_URL = "https://api.openweathermap.org/data/2.5";

// ========================================
// SELEÇÃO DE ELEMENTOS DO DOM
// ========================================

const btnLocation = document.getElementById("btnLocation");
const btnSearch = document.getElementById("btnSearch");
const themeToggle = document.getElementById("themeToggle");
const selectEstado = document.getElementById("estado");
const selectCidade = document.getElementById("cidade");
const loading = document.getElementById("loading");
const weatherResult = document.getElementById("weatherResult");
const errorMessage = document.getElementById("errorMessage");
const cityName = document.getElementById("cityName");
const currentDate = document.getElementById("currentDate");
const weatherIcon = document.getElementById("weatherIcon");
const tempValue = document.getElementById("tempValue");
const weatherDescription = document.getElementById("weatherDescription");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const pressure = document.getElementById("pressure");
const forecastContainer = document.getElementById("forecastContainer");

// ========================================
// MAPEAMENTO DE ÍCONES DO CLIMA
// ========================================

const weatherIcons = {
  "01d": "☀️",
  "01n": "🌙",
  "02d": "⛅",
  "02n": "☁️",
  "03d": "☁️",
  "03n": "☁️",
  "04d": "☁️",
  "04n": "☁️",
  "09d": "🌧️",
  "09n": "🌧️",
  "10d": "🌦️",
  "10n": "🌧️",
  "11d": "⛈️",
  "11n": "⛈️",
  "13d": "❄️",
  "13n": "❄️",
  "50d": "🌫️",
  "50n": "🌫️",
};

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("🌤️ WeatherNow iniciado!");
  inicializarEventListeners();
  carregarTema();
  atualizarDataAtual();
});

// ========================================
// EVENT LISTENERS
// ========================================

function inicializarEventListeners() {
  btnLocation.addEventListener("click", usarLocalizacao);
  btnSearch.addEventListener("click", buscarClimaPorCidade);
  selectEstado.addEventListener("change", carregarCidades);
  themeToggle.addEventListener("click", toggleTema);
  selectCidade.addEventListener("keypress", (e) => {
    if (e.key === "Enter") buscarClimaPorCidade();
  });
}

// ========================================
// FUNÇÃO: USAR LOCALIZAÇÃO GPS
// ========================================

function usarLocalizacao() {
  if (!navigator.geolocation) {
    mostrarErro("Seu navegador não suporta geolocalização 😔");
    return;
  }
  mostrarLoading();
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      buscarClimaPorCoordenadas(lat, lon);
    },
    (error) => {
      esconderLoading();
      if (error.code === 1) mostrarErro("Você negou o acesso à localização 📍");
      else if (error.code === 2)
        mostrarErro("Não foi possível determinar sua localização 🗺️");
      else mostrarErro("Erro ao obter localização. Tente novamente! ⚠️");
    },
  );
}

// ========================================
// FUNÇÃO: CARREGAR CIDADES DO ESTADO
// ========================================

function carregarCidades() {
  const estadoSelecionado = selectEstado.value;

  if (!estadoSelecionado) {
    selectCidade.disabled = true;
    selectCidade.innerHTML =
      '<option value="">Selecione o estado primeiro...</option>';
    return;
  }

  const cidades = getCidadesPorEstado(estadoSelecionado);
  selectCidade.innerHTML = '<option value="">Selecione a cidade...</option>';
  cidades.forEach((cidade) => {
    const option = document.createElement("option");
    option.value = cidade;
    option.textContent = cidade;
    selectCidade.appendChild(option);
  });
  selectCidade.disabled = false;
}

// ========================================
// FUNÇÃO: BUSCAR CLIMA POR CIDADE
// FIX: agora inclui a sigla do estado na query para
//      cidades menores serem encontradas pela API
// ========================================

function buscarClimaPorCidade() {
  const estado = selectEstado.value;
  const cidade = selectCidade.value;

  if (!estado || !cidade) {
    mostrarErro("Por favor, selecione o estado e a cidade! 🏙️");
    return;
  }

  console.log(`🔍 Buscando clima para: ${cidade}, ${estado}`);

  // ✅ FIX: inclui estado na query → "Apucarana,PR,BR"
  // Isso resolve cidades pequenas que a API não encontrava com só o nome
  const query = `${cidade},${estado},BR`;

  mostrarLoading();
  buscarClima(query, cidade);
}

// ========================================
// FUNÇÃO: BUSCAR CLIMA POR COORDENADAS
// ========================================

function buscarClimaPorCoordenadas(lat, lon) {
  const url = `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      buscarPrevisao(data.coord.lat, data.coord.lon);
      exibirClima(data);
    })
    .catch(() => {
      esconderLoading();
      mostrarErro("Erro ao buscar informações do clima! 😔");
    });
}

// ========================================
// FUNÇÃO: BUSCAR CLIMA (NOME DA CIDADE)
// FIX: tenta nome com estado; se falhar, tenta só o nome
// ========================================

function buscarClima(query, cidadeFallback) {
  const url = `${API_BASE_URL}/weather?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric&lang=pt_br`;

  console.log("🌐 Fazendo requisição para:", url);

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        // ✅ FALLBACK: se "Cidade,PR,BR" falhar, tenta só "Cidade,BR"
        if (cidadeFallback) {
          console.warn("⚠️ Query com estado falhou, tentando só cidade...");
          return buscarClimaFallback(cidadeFallback);
        }
        throw new Error("Cidade não encontrada");
      }
      return response.json();
    })
    .then((data) => {
      if (!data) return; // fallback está cuidando
      console.log("✅ Dados recebidos:", data);
      buscarPrevisao(data.coord.lat, data.coord.lon);
      exibirClima(data);
    })
    .catch((error) => {
      console.error("❌ Erro:", error);
      esconderLoading();
      mostrarErro(
        "Cidade não encontrada! Verifique o nome e tente novamente. 🔍",
      );
    });
}

// Fallback: busca só pelo nome da cidade sem estado
function buscarClimaFallback(cidade) {
  const url = `${API_BASE_URL}/weather?q=${encodeURIComponent(cidade + ",BR")}&appid=${API_KEY}&units=metric&lang=pt_br`;

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("Cidade não encontrada");
      return response.json();
    })
    .then((data) => {
      console.log("✅ Dados recebidos (fallback):", data);
      buscarPrevisao(data.coord.lat, data.coord.lon);
      exibirClima(data);
    })
    .catch(() => {
      esconderLoading();
      mostrarErro(
        "Cidade não encontrada! Verifique o nome e tente novamente. 🔍",
      );
    });

  return null; // sinaliza que o fallback assumiu
}

// ========================================
// FUNÇÃO: BUSCAR PREVISÃO 5 DIAS
// ========================================

function buscarPrevisao(lat, lon) {
  const url = `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log("✅ Previsão recebida:", data);
      exibirPrevisao(data);
    })
    .catch((error) => {
      console.error("❌ Erro ao buscar previsão:", error);
    });
}

// ========================================
// FUNÇÃO: EXIBIR CLIMA NA TELA
// ========================================

function exibirClima(data) {
  const temperatura = Math.round(data.main.temp);
  const sensacao = Math.round(data.main.feels_like);
  const umidade = data.main.humidity;
  const vento = Math.round(data.wind.speed * 3.6);
  const pressao = data.main.pressure;
  const descricao = data.weather[0].description;
  const iconeCode = data.weather[0].icon;
  const cidadeNome = data.name;

  cityName.textContent = cidadeNome;
  tempValue.textContent = temperatura;
  weatherDescription.textContent = descricao;
  feelsLike.textContent = `${sensacao}°C`;
  humidity.textContent = `${umidade}%`;
  windSpeed.textContent = `${vento} km/h`;
  pressure.textContent = `${pressao} hPa`;
  weatherIcon.textContent = weatherIcons[iconeCode] || "🌤️";

  esconderLoading();
  esconderErro();
  weatherResult.classList.add("active");
}

// ========================================
// FUNÇÃO: EXIBIR PREVISÃO 5 DIAS
// FIX: variável "data" renomeada para "dataObj" dentro do forEach
//      para não conflitar com o parâmetro da função
// ========================================

function exibirPrevisao(data) {
  forecastContainer.innerHTML = "";

  // A API retorna dados a cada 3h — pegamos 1 por dia
  const previsoesPorDia = {};

  data.list.forEach((item) => {
    // ✅ FIX: renomeado de "data" para "dataObj" — evita conflito de nome
    const dataObj = new Date(item.dt * 1000);
    const dia = dataObj.toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    // Prefere o horário mais próximo do meio-dia para representar o dia
    if (!previsoesPorDia[dia]) {
      previsoesPorDia[dia] = item;
    } else {
      const horaAtual = dataObj.getHours();
      const horaExistente = new Date(previsoesPorDia[dia].dt * 1000).getHours();
      if (Math.abs(horaAtual - 12) < Math.abs(horaExistente - 12)) {
        previsoesPorDia[dia] = item;
      }
    }
  });

  // Pula o primeiro dia se for hoje (já temos o clima atual)
  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const dias = Object.keys(previsoesPorDia)
    .filter((dia) => dia !== hoje)
    .slice(0, 5);

  dias.forEach((dia) => {
    const previsao = previsoesPorDia[dia];
    const tempMax = Math.round(previsao.main.temp_max);
    const tempMin = Math.round(previsao.main.temp_min);
    const descricao = previsao.weather[0].description;
    const icone = weatherIcons[previsao.weather[0].icon] || "🌤️";

    const card = `
            <div class="forecast-item">
                <div class="forecast-day">${dia}</div>
                <div class="forecast-icon">${icone}</div>
                <div class="forecast-temp">
                    <span class="temp-max">${tempMax}°</span>
                    <span class="temp-min">${tempMin}°</span>
                </div>
                <div class="forecast-description">${descricao}</div>
            </div>
        `;
    forecastContainer.innerHTML += card;
  });
}

// ========================================
// FUNÇÕES DE UI
// ========================================

function mostrarLoading() {
  loading.classList.add("active");
  weatherResult.classList.remove("active");
  errorMessage.classList.remove("active");
}

function esconderLoading() {
  loading.classList.remove("active");
}

function mostrarErro(mensagem) {
  document.getElementById("errorText").textContent = mensagem;
  errorMessage.classList.add("active");
  weatherResult.classList.remove("active");
  esconderLoading();
}

function esconderErro() {
  errorMessage.classList.remove("active");
}

// ========================================
// FUNÇÃO: DATA ATUAL
// ========================================

function atualizarDataAtual() {
  const agora = new Date();
  const dataFormatada = agora.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  currentDate.textContent =
    dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
}

// ========================================
// DARK MODE
// ========================================

function toggleTema() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("weathernow-theme", isDark ? "dark" : "light");
}

function carregarTema() {
  const temaSalvo = localStorage.getItem("weathernow-theme");
  if (temaSalvo === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
  }
}

console.log(`
╔════════════════════════════════════╗
║     🌤️  WEATHERNOW CARREGADO!     ║
║                                    ║
║  ✅ DOM carregado                  ║
║  ✅ Event listeners configurados   ║
║  ✅ Fix: query com estado          ║
║  ✅ Fix: previsão 5 dias           ║
╚════════════════════════════════════╝
`);
