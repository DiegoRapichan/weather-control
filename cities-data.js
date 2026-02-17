// ========================================
// DADOS DAS CIDADES POR ESTADO
// ========================================

/**
 * Este objeto contém as principais cidades de cada estado brasileiro
 * Organizados por sigla do estado (UF)
 */

const cidadesPorEstado = {
    'AC': ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira', 'Tarauacá', 'Feijó'],
    
    'AL': ['Maceió', 'Arapiraca', 'Palmeira dos Índios', 'Rio Largo', 'Penedo'],
    
    'AP': ['Macapá', 'Santana', 'Laranjal do Jari', 'Oiapoque', 'Mazagão'],
    
    'AM': ['Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru', 'Coari'],
    
    'BA': ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Itabuna', 
           'Juazeiro', 'Lauro de Freitas', 'Ilhéus', 'Jequié', 'Teixeira de Freitas'],
    
    'CE': ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral', 
           'Crato', 'Itapipoca', 'Maranguape', 'Iguatu', 'Quixadá'],
    
    'DF': ['Brasília', 'Taguatinga', 'Ceilândia', 'Samambaia', 'Plano Piloto'],
    
    'ES': ['Vitória', 'Vila Velha', 'Serra', 'Cariacica', 'Cachoeiro de Itapemirim', 
           'Linhares', 'São Mateus', 'Colatina', 'Guarapari', 'Aracruz'],
    
    'GO': ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia', 
           'Águas Lindas de Goiás', 'Valparaíso de Goiás', 'Trindade', 'Formosa', 'Novo Gama'],
    
    'MA': ['São Luís', 'Imperatriz', 'São José de Ribamar', 'Timon', 'Caxias', 
           'Codó', 'Paço do Lumiar', 'Açailândia', 'Bacabal', 'Santa Inês'],
    
    'MT': ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Tangará da Serra', 
           'Cáceres', 'Sorriso', 'Lucas do Rio Verde', 'Barra do Garças', 'Primavera do Leste'],
    
    'MS': ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá', 'Ponta Porã', 
           'Sidrolândia', 'Aquidauana', 'Paranaíba', 'Nova Andradina', 'Naviraí'],
    
    'MG': ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim', 
           'Montes Claros', 'Ribeirão das Neves', 'Uberaba', 'Governador Valadares', 'Ipatinga',
           'Sete Lagoas', 'Divinópolis', 'Santa Luzia', 'Ibirité', 'Poços de Caldas'],
    
    'PA': ['Belém', 'Ananindeua', 'Santarém', 'Marabá', 'Castanhal', 
           'Parauapebas', 'Itaituba', 'Cametá', 'Bragança', 'Abaetetuba'],
    
    'PB': ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux', 
           'Sousa', 'Cajazeiras', 'Guarabira', 'Monteiro', 'Pombal'],
    
    'PR': ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel', 
           'São José dos Pinhais', 'Foz do Iguaçu', 'Colombo', 'Guarapuava', 'Paranaguá',
           'Araucária', 'Toledo', 'Apucarana', 'Pinhais', 'Campo Largo'],
    
    'PE': ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina', 
           'Paulista', 'Cabo de Santo Agostinho', 'Camaragibe', 'Garanhuns', 'Vitória de Santo Antão'],
    
    'PI': ['Teresina', 'Parnaíba', 'Picos', 'Piripiri', 'Floriano', 
           'Campo Maior', 'Barras', 'Altos', 'Esperantina', 'Pedro II'],
    
    'RJ': ['Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu', 'Niterói', 
           'Belford Roxo', 'Campos dos Goytacazes', 'São João de Meriti', 'Petrópolis', 'Volta Redonda',
           'Magé', 'Itaboraí', 'Macaé', 'Cabo Frio', 'Nova Friburgo'],
    
    'RN': ['Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo do Amarante', 'Macaíba', 
           'Ceará-Mirim', 'Caicó', 'Assu', 'Currais Novos', 'São José de Mipibu'],
    
    'RS': ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria', 
           'Gravataí', 'Viamão', 'Novo Hamburgo', 'São Leopoldo', 'Rio Grande',
           'Alvorada', 'Passo Fundo', 'Sapucaia do Sul', 'Uruguaiana', 'Santa Cruz do Sul'],
    
    'RO': ['Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Vilhena', 'Cacoal', 
           'Jaru', 'Rolim de Moura', 'Guajará-Mirim', 'Pimenta Bueno', 'Buritis'],
    
    'RR': ['Boa Vista', 'Rorainópolis', 'Caracaraí', 'Mucajaí', 'São João da Baliza'],
    
    'SC': ['Florianópolis', 'Joinville', 'Blumenau', 'São José', 'Criciúma', 
           'Chapecó', 'Itajaí', 'Jaraguá do Sul', 'Lages', 'Palhoça',
           'Balneário Camboriú', 'Brusque', 'Tubarão', 'São Bento do Sul', 'Caçador'],
    
    'SP': ['São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'Santo André', 
           'Osasco', 'São José dos Campos', 'Ribeirão Preto', 'Sorocaba', 'Santos',
           'Mauá', 'São José do Rio Preto', 'Mogi das Cruzes', 'Diadema', 'Jundiaí',
           'Piracicaba', 'Carapicuíba', 'Bauru', 'Itaquaquecetuba', 'São Vicente'],
    
    'SE': ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana', 'Estância', 
           'São Cristóvão', 'Propriá', 'Tobias Barreto', 'Simão Dias', 'Laranjeiras'],
    
    'TO': ['Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional', 'Paraíso do Tocantins', 
           'Colinas do Tocantins', 'Guaraí', 'Miracema do Tocantins', 'Tocantinópolis', 'Araguatins']
};

/**
 * Função para obter as cidades de um estado específico
 * @param {string} estado - Sigla do estado (ex: 'PR', 'SP')
 * @returns {Array} Array com as cidades do estado
 */
function getCidadesPorEstado(estado) {
    return cidadesPorEstado[estado] || [];
}

/**
 * Função para verificar se um estado existe
 * @param {string} estado - Sigla do estado
 * @returns {boolean} true se o estado existe
 */
function estadoExiste(estado) {
    return cidadesPorEstado.hasOwnProperty(estado);
}

/**
 * Função para obter todos os estados disponíveis
 * @returns {Array} Array com as siglas de todos os estados
 */
function getTodosEstados() {
    return Object.keys(cidadesPorEstado).sort();
}

// Logs para debug (você pode remover depois)
console.log('✅ Dados de cidades carregados!');
console.log(`📍 Total de estados: ${Object.keys(cidadesPorEstado).length}`);
