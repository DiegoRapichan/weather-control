// ========================================
// WEATHERNOW - APLICAÇÃO DE PREVISÃO DO TEMPO
// ========================================

/**
 * CHAVE DA API OPENWEATHERMAP
 * 
 * IMPORTANTE: Esta é uma chave de exemplo/demonstração.
 * Para uso real, você deve:
 * 1. Criar conta grátis em: https://openweathermap.org/
 * 2. Gerar sua própria chave API
 * 3. Substituir aqui
 * 
 * A chave gratuita permite 1000 chamadas por dia
 */
const API_KEY = '85b6e345c49bc0dcdb4ab8ed3fe4d1fe';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// ========================================
// SELEÇÃO DE ELEMENTOS DO DOM
// ========================================

/**
 * Aqui pegamos referências para os elementos HTML que vamos manipular
 * getElementById() pega um elemento pelo ID dele
 */

// Botões
const btnLocation = document.getElementById('btnLocation');
const btnSearch = document.getElementById('btnSearch');
const themeToggle = document.getElementById('themeToggle');

// Inputs/Selects
const selectEstado = document.getElementById('estado');
const selectCidade = document.getElementById('cidade');

// Áreas de conteúdo
const loading = document.getElementById('loading');
const weatherResult = document.getElementById('weatherResult');
const errorMessage = document.getElementById('errorMessage');

// Elementos de dados do clima
const cityName = document.getElementById('cityName');
const currentDate = document.getElementById('currentDate');
const weatherIcon = document.getElementById('weatherIcon');
const tempValue = document.getElementById('tempValue');
const weatherDescription = document.getElementById('weatherDescription');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');
const forecastContainer = document.getElementById('forecastContainer');

// ========================================
// MAPEAMENTO DE ÍCONES DO CLIMA
// ========================================

/**
 * A API retorna códigos como "01d", "02n", etc
 * Aqui mapeamos esses códigos para emojis bonitos
 */
const weatherIcons = {
    '01d': '☀️',    // Céu limpo (dia)
    '01n': '🌙',    // Céu limpo (noite)
    '02d': '⛅',    // Poucas nuvens (dia)
    '02n': '☁️',    // Poucas nuvens (noite)
    '03d': '☁️',    // Nuvens dispersas
    '03n': '☁️',    // Nuvens dispersas
    '04d': '☁️',    // Nublado
    '04n': '☁️',    // Nublado
    '09d': '🌧️',   // Chuva
    '09n': '🌧️',   // Chuva
    '10d': '🌦️',   // Chuva leve
    '10n': '🌧️',   // Chuva leve
    '11d': '⛈️',    // Tempestade
    '11n': '⛈️',    // Tempestade
    '13d': '❄️',    // Neve
    '13n': '❄️',    // Neve
    '50d': '🌫️',   // Neblina
    '50n': '🌫️'    // Neblina
};

// ========================================
// INICIALIZAÇÃO
// ========================================

/**
 * Este código roda assim que a página carrega
 * DOMContentLoaded = "quando o HTML estiver pronto"
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌤️ WeatherNow iniciado!');
    
    // Configura todos os event listeners (eventos)
    inicializarEventListeners();
    
    // Carrega o tema salvo (dark/light)
    carregarTema();
    
    // Atualiza a data atual
    atualizarDataAtual();
});

// ========================================
// EVENT LISTENERS (EVENTOS)
// ========================================

/**
 * Aqui configuramos todos os eventos da aplicação
 * Eventos = coisas que acontecem quando o usuário faz algo
 * Exemplos: clique, mudança, digitação, etc
 */
function inicializarEventListeners() {
    
    // BOTÃO DE LOCALIZAÇÃO
    // addEventListener = "quando o usuário clicar, execute esta função"
    btnLocation.addEventListener('click', usarLocalizacao);
    
    // BOTÃO DE BUSCA
    btnSearch.addEventListener('click', buscarClimaPorCidade);
    
    // SELECT DE ESTADO
    // 'change' = quando o usuário escolher um estado diferente
    selectEstado.addEventListener('change', carregarCidades);
    
    // BOTÃO DE TEMA (dark mode)
    themeToggle.addEventListener('click', toggleTema);
    
    // ENTER NO SELECT DE CIDADE
    // Permite buscar apertando Enter
    selectCidade.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            buscarClimaPorCidade();
        }
    });
}

// ========================================
// FUNÇÃO: USAR LOCALIZAÇÃO GPS
// ========================================

/**
 * Esta função pega a localização do usuário via GPS
 * Usa a Geolocation API do navegador
 */
function usarLocalizacao() {
    console.log('📍 Solicitando localização do usuário...');
    
    // Verifica se o navegador suporta geolocalização
    if (!navigator.geolocation) {
        mostrarErro('Seu navegador não suporta geolocalização 😔');
        return;
    }
    
    // Mostra loading
    mostrarLoading();
    
    // getCurrentPosition pede permissão ao usuário e pega a localização
    // Recebe 2 funções: uma pra sucesso, outra pra erro
    navigator.geolocation.getCurrentPosition(
        // SUCESSO: quando conseguiu pegar a localização
        (position) => {
            const lat = position.coords.latitude;   // Latitude
            const lon = position.coords.longitude;  // Longitude
            
            console.log(`✅ Localização obtida: ${lat}, ${lon}`);
            
            // Busca o clima usando as coordenadas
            buscarClimaPorCoordenadas(lat, lon);
        },
        // ERRO: quando não conseguiu (usuário negou, erro, etc)
        (error) => {
            console.error('❌ Erro ao obter localização:', error);
            esconderLoading();
            
            // Mensagens de erro amigáveis
            if (error.code === 1) {
                mostrarErro('Você negou o acesso à localização 📍');
            } else if (error.code === 2) {
                mostrarErro('Não foi possível determinar sua localização 🗺️');
            } else {
                mostrarErro('Erro ao obter localização. Tente novamente! ⚠️');
            }
        }
    );
}

// ========================================
// FUNÇÃO: CARREGAR CIDADES DO ESTADO
// ========================================

/**
 * Quando o usuário escolhe um estado, esta função
 * carrega as cidades daquele estado no segundo select
 */
function carregarCidades() {
    // Pega o estado selecionado (ex: 'PR', 'SP')
    const estadoSelecionado = selectEstado.value;
    
    console.log(`🏙️ Carregando cidades de: ${estadoSelecionado}`);
    
    // Se não selecionou nenhum estado, desabilita o select de cidade
    if (!estadoSelecionado) {
        selectCidade.disabled = true;
        selectCidade.innerHTML = '<option value="">Selecione o estado primeiro...</option>';
        return;
    }
    
    // Pega as cidades do estado (vem do cities-data.js)
    const cidades = getCidadesPorEstado(estadoSelecionado);
    
    // Limpa o select de cidades
    selectCidade.innerHTML = '<option value="">Selecione a cidade...</option>';
    
    // Adiciona cada cidade como uma opção no select
    // forEach = "para cada cidade no array, faça isso:"
    cidades.forEach(cidade => {
        const option = document.createElement('option');  // Cria elemento <option>
        option.value = cidade;                            // Define o valor
        option.textContent = cidade;                      // Define o texto visível
        selectCidade.appendChild(option);                 // Adiciona no select
    });
    
    // Habilita o select de cidade
    selectCidade.disabled = false;
    
    console.log(`✅ ${cidades.length} cidades carregadas!`);
}

// ========================================
// FUNÇÃO: BUSCAR CLIMA POR CIDADE
// ========================================

/**
 * Busca o clima quando o usuário escolhe manualmente
 * estado e cidade
 */
function buscarClimaPorCidade() {
    const estado = selectEstado.value;
    const cidade = selectCidade.value;
    
    // Validação: verifica se escolheu estado e cidade
    if (!estado || !cidade) {
        mostrarErro('Por favor, selecione o estado e a cidade! 🏙️');
        return;
    }
    
    console.log(`🔍 Buscando clima para: ${cidade}, ${estado}`);
    
    // Monta o nome completo (ex: "Apucarana,BR")
    const query = `${cidade},BR`;
    
    // Mostra loading
    mostrarLoading();
    
    // Faz a busca
    buscarClima(query);
}

// ========================================
// FUNÇÃO: BUSCAR CLIMA POR COORDENADAS
// ========================================

/**
 * Busca o clima usando latitude e longitude (GPS)
 */
function buscarClimaPorCoordenadas(lat, lon) {
    console.log(`🌍 Buscando clima por coordenadas: ${lat}, ${lon}`);
    
    // Monta a URL da API com as coordenadas
    const url = `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`;
    
    // Faz a requisição
    fetch(url)
        .then(response => response.json())  // Converte resposta pra JSON
        .then(data => {
            console.log('✅ Dados recebidos:', data);
            
            // Também busca a previsão de 5 dias
            buscarPrevisao(lat, lon);
            
            // Exibe os dados na tela
            exibirClima(data);
        })
        .catch(error => {
            console.error('❌ Erro na requisição:', error);
            esconderLoading();
            mostrarErro('Erro ao buscar informações do clima! 😔');
        });
}

// ========================================
// FUNÇÃO: BUSCAR CLIMA (NOME DA CIDADE)
// ========================================

/**
 * Busca o clima usando o nome da cidade
 * fetch() = função que faz requisições HTTP (chamadas de API)
 */
function buscarClima(query) {
    // Monta a URL da API
    const url = `${API_BASE_URL}/weather?q=${query}&appid=${API_KEY}&units=metric&lang=pt_br`;
    
    console.log('🌐 Fazendo requisição para:', url);
    
    // fetch() retorna uma Promise (promessa)
    // Promise = "vou fazer isso, quando terminar te aviso"
    fetch(url)
        // .then = "quando a requisição terminar, faça isso:"
        .then(response => {
            // Verifica se deu erro
            if (!response.ok) {
                throw new Error('Cidade não encontrada');
            }
            // Converte a resposta para JSON
            return response.json();
        })
        .then(data => {
            console.log('✅ Dados recebidos:', data);
            
            // Busca também a previsão de 5 dias
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            buscarPrevisao(lat, lon);
            
            // Exibe os dados na tela
            exibirClima(data);
        })
        // .catch = "se der erro, faça isso:"
        .catch(error => {
            console.error('❌ Erro:', error);
            esconderLoading();
            mostrarErro('Cidade não encontrada! Verifique o nome e tente novamente. 🔍');
        });
}

// ========================================
// FUNÇÃO: BUSCAR PREVISÃO 5 DIAS
// ========================================

/**
 * Busca a previsão dos próximos 5 dias
 */
function buscarPrevisao(lat, lon) {
    const url = `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`;
    
    console.log('📅 Buscando previsão de 5 dias...');
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('✅ Previsão recebida:', data);
            exibirPrevisao(data);
        })
        .catch(error => {
            console.error('❌ Erro ao buscar previsão:', error);
        });
}

// ========================================
// FUNÇÃO: EXIBIR CLIMA NA TELA
// ========================================

/**
 * Pega os dados da API e atualiza os elementos HTML
 * Aqui é onde a MANIPULAÇÃO DO DOM acontece!
 */
function exibirClima(data) {
    console.log('🖼️ Exibindo dados na tela...');
    
    // Extrai os dados do objeto JSON
    const temperatura = Math.round(data.main.temp);           // Temperatura atual
    const sensacao = Math.round(data.main.feels_like);        // Sensação térmica
    const umidade = data.main.humidity;                       // Umidade
    const vento = Math.round(data.wind.speed * 3.6);          // Vento (convertido pra km/h)
    const pressao = data.main.pressure;                       // Pressão atmosférica
    const descricao = data.weather[0].description;            // Descrição (nublado, etc)
    const iconeCode = data.weather[0].icon;                   // Código do ícone
    const cidadeNome = data.name;                             // Nome da cidade
    
    // ATUALIZA OS ELEMENTOS NA TELA
    // .textContent = muda o texto dentro do elemento
    cityName.textContent = cidadeNome;
    tempValue.textContent = temperatura;
    weatherDescription.textContent = descricao;
    feelsLike.textContent = `${sensacao}°C`;
    humidity.textContent = `${umidade}%`;
    windSpeed.textContent = `${vento} km/h`;
    pressure.textContent = `${pressao} hPa`;
    
    // Atualiza o ícone do clima
    weatherIcon.textContent = weatherIcons[iconeCode] || '🌤️';
    
    // Esconde o loading e mostra o resultado
    esconderLoading();
    esconderErro();
    weatherResult.classList.add('active');  // classList.add = adiciona uma classe CSS
    
    console.log('✅ Clima exibido com sucesso!');
}

// ========================================
// FUNÇÃO: EXIBIR PREVISÃO 5 DIAS
// ========================================

/**
 * Exibe os cards com a previsão dos próximos dias
 */
function exibirPrevisao(data) {
    console.log('📅 Exibindo previsão...');
    
    // Limpa o container
    forecastContainer.innerHTML = '';
    
    // A API retorna dados a cada 3 horas
    // Vamos pegar apenas 1 por dia (meio-dia)
    const previsoesPorDia = {};
    
    // Filtra para pegar apenas 1 previsão por dia
    data.list.forEach(item => {
        const data = new Date(item.dt * 1000);  // Converte timestamp
        const dia = data.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' });
        
        // Se ainda não tem previsão pra esse dia, adiciona
        if (!previsoesPorDia[dia]) {
            previsoesPorDia[dia] = item;
        }
    });
    
    // Pega os 5 primeiros dias
    const dias = Object.keys(previsoesPorDia).slice(0, 5);
    
    // Cria um card para cada dia
    dias.forEach(dia => {
        const previsao = previsoesPorDia[dia];
        
        const tempMax = Math.round(previsao.main.temp_max);
        const tempMin = Math.round(previsao.main.temp_min);
        const descricao = previsao.weather[0].description;
        const icone = weatherIcons[previsao.weather[0].icon] || '🌤️';
        
        // Cria o HTML do card
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
        
        // Adiciona o card no container
        forecastContainer.innerHTML += card;
    });
    
    console.log('✅ Previsão exibida!');
}

// ========================================
// FUNÇÕES DE UI (INTERFACE)
// ========================================

/**
 * Mostra o indicador de carregamento
 */
function mostrarLoading() {
    loading.classList.add('active');
    weatherResult.classList.remove('active');
    errorMessage.classList.remove('active');
}

/**
 * Esconde o loading
 */
function esconderLoading() {
    loading.classList.remove('active');
}

/**
 * Mostra mensagem de erro
 */
function mostrarErro(mensagem) {
    document.getElementById('errorText').textContent = mensagem;
    errorMessage.classList.add('active');
    weatherResult.classList.remove('active');
}

/**
 * Esconde mensagem de erro
 */
function esconderErro() {
    errorMessage.classList.remove('active');
}

// ========================================
// FUNÇÃO: ATUALIZAR DATA ATUAL
// ========================================

/**
 * Mostra a data atual formatada
 */
function atualizarDataAtual() {
    const agora = new Date();
    const opcoes = { 
        weekday: 'long',    // Dia da semana por extenso
        year: 'numeric',    // Ano
        month: 'long',      // Mês por extenso
        day: 'numeric'      // Dia
    };
    
    const dataFormatada = agora.toLocaleDateString('pt-BR', opcoes);
    
    // Capitaliza a primeira letra
    const dataCapitalizada = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
    
    currentDate.textContent = dataCapitalizada;
}

// ========================================
// DARK MODE
// ========================================

/**
 * Alterna entre tema claro e escuro
 */
function toggleTema() {
    // toggle = se tem a classe, remove; se não tem, adiciona
    document.body.classList.toggle('dark-mode');
    
    // Verifica se está em modo escuro
    const isDark = document.body.classList.contains('dark-mode');
    
    // Muda o emoji do botão
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    
    // Salva a preferência no localStorage
    localStorage.setItem('weathernow-theme', isDark ? 'dark' : 'light');
    
    console.log(`🎨 Tema alterado para: ${isDark ? 'escuro' : 'claro'}`);
}

/**
 * Carrega o tema salvo
 */
function carregarTema() {
    const temaSalvo = localStorage.getItem('weathernow-theme');
    
    if (temaSalvo === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }
}

// ========================================
// LOG FINAL
// ========================================

console.log(`
╔════════════════════════════════════╗
║     🌤️  WEATHERNOW CARREGADO!     ║
║                                    ║
║  ✅ DOM carregado                  ║
║  ✅ Event listeners configurados   ║
║  ✅ Dados de cidades carregados    ║
║  ✅ Pronto para uso!               ║
╚════════════════════════════════════╝
`);
