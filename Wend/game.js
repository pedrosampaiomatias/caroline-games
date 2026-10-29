/**
 * LinkedIn Wend — Clean-Room Engine, Word List Matcher, 4-Stage Hint System &
 * Bilingual (Portuguese PT-BR & English) Procedural Generator
 * Reconstructed via REA MCP inspection of live Puzzle #142 & C7ZU1-qQ.js
 */

const WEND_PALETTE_1 = [
  "#FB5239",
  "#00B382",
  "#DA3E9D",
  "#A4BA00",
  "#6F70F1",
  "#F68E00",
  "#00B4D0",
  "#F43F72",
  "#4EBA0E",
  "#A75AE6",
  "#EEB500",
  "#0090E7",
];

const WEND_PALETTE_2 = [
  "#F76722",
  "#7CB25C",
  "#8777CE",
  "#C96364",
  "#D9C256",
  "#2F82F7",
  "#AF5F9D",
  "#D8993C",
  "#2BB7E5",
  "#D222FC",
];

const WendHintType = {
  TRIM_INCORRECT: "TRIM_INCORRECT",
  REMOVE_INCORRECT: "REMOVE_INCORRECT",
  EXTEND_PARTIAL: "EXTEND_PARTIAL",
  REVEAL_FIRST_LETTER: "REVEAL_FIRST_LETTER",
};

const I18N = {
  pt: {
    findWordsEqual: (count, len) =>
      `Encontre as <b>${count} palavras ocultas</b> — todas com <b>${len} letras</b>.`,
    findWordsVaried: (count, lengths) =>
      `Encontre as <b>${count} palavras ocultas</b> — com <b>${lengths.join(", ")} letras</b>.`,
    everyTileUsed: "Use cada letra do tabuleiro exatamente uma vez.",
    hintTrimIncorrect: "Erros removidos desta palavra!",
    hintRemoveIncorrect: "Palavra incorreta removida!",
    hintExtendPartial: "Próxima letra revelada!",
    hintRevealFirstLetter: "Primeira letra de uma palavra revelada!",
    hintCorrectionPrefix: (hintText) => `Erro corrigido! ${hintText}`,
    filledButUnsolved:
      "Quase lá! Você ainda não formou todas as palavras ocultas corretas.",
    useHint: "Usar dica",
    btnUndo: "↩ Desfazer",
    btnHint: "💡 Dica",
    btnClear: "🗑 Limpar",
    btnNewRandom: "🎲 Novo Jogo",
    winTitle: "🎉 Wend Resolvido!",
    winStats: (title, time, words) =>
      `Você concluiu ${title} em ${time} (${words} palavras).`,
    nextPuzzle: "Próximo →",
    howToPlay:
      "Arraste entre letras adjacentes (horizontal ou vertical) para formar as palavras ocultas. A primeira letra de cada palavra ganha um círculo inicial. Clique na primeira letra para apagar a palavra, clique no meio para encurtá-la, ou arraste até o início/fim de outra palavra para uni-las!",
  },
  en: {
    findWordsEqual: (count, len) =>
      `Find the <b>${count} hidden words</b> — all <b>${len} letters</b> long.`,
    findWordsVaried: (count, lengths) =>
      `Find the <b>${count} hidden words</b> — <b>${lengths.join(", ")} letters</b> long.`,
    everyTileUsed: "Use every letter tile exactly once.",
    hintTrimIncorrect: "Mistakes removed from this word!",
    hintRemoveIncorrect: "Incorrect word removed!",
    hintExtendPartial: "Next letter revealed!",
    hintRevealFirstLetter: "First letter of a word revealed!",
    hintCorrectionPrefix: (hintText) => `Mistake corrected! ${hintText}`,
    filledButUnsolved:
      "Almost there! You haven’t found all the correct hidden words.",
    useHint: "Use hint",
    btnUndo: "↩ Undo",
    btnHint: "💡 Hint",
    btnClear: "🗑 Clear",
    btnNewRandom: "🎲 New Random",
    winTitle: "🎉 Wend Solved!",
    winStats: (title, time, words) =>
      `Completed ${title} in ${time} (${words} words).`,
    nextPuzzle: "Next Puzzle →",
    howToPlay:
      "Drag across orthogonally adjacent letters to trace the hidden words. Each word's start tile shows a circle indicator. Click a start tile to remove a word, click an interior tile to trim it, or drag into the start/end of another path to merge them!",
  },
};

/* ==========================================================================
   Curated Portuguese (PT-BR) & English Word Banks by Word Length (4..8)
   ========================================================================== */

const PT_WORD_BANK = {
  4: [
    "AMOR", "ARTE", "AZUL", "BASE", "BOLO", "CAFE", "CASA", "DADO",
    "DOCE", "FADA", "FARO", "FOGO", "FOTO", "GATO", "GELO", "ILHA",
    "JOGO", "LAGO", "LEAO", "LIMA", "LOBO", "LUAR", "MAPA", "MESA",
    "META", "MODA", "NAVE", "NEVE", "NOTA", "ONDA", "OURO", "PATO",
    "PELE", "PESO", "PINO", "PISO", "RAMO", "REDE", "RISO", "RODA",
    "ROSA", "ROTA", "SEDA", "SELO", "SINO", "SOFA", "SOMA", "TELA",
    "TEMA", "URSO", "VALE", "VELA", "VIDA", "VILA", "VOTO", "ZONA",
  ],
  5: [
    "ABRIR", "AGORA", "AMIGO", "ANJOS", "AREIA", "AROMA", "AUTOR", "AVIAO",
    "BANCO", "BARCO", "BLOCO", "BRAVO", "BRISA", "CABOS", "CALMA", "CAMPO",
    "CANTO", "CARRO", "CARTA", "CHAVE", "CHUVA", "CICLO", "CLARO", "CLIMA",
    "CONTA", "CORAL", "CORPO", "COSTA", "CURVA", "DANCA", "DADOS", "DENTE",
    "DISCO", "DOCES", "DRAMA", "ETAPA", "FAROL", "FESTA", "FIBRA", "FILME",
    "FLORA", "FLUXO", "FOLHA", "FONTE", "FORCA", "FORMA", "FORTE", "FRUTA",
    "FUNDO", "GLOBO", "GRACA", "GRAMA", "GRUPO", "HOTEL", "IDEIA", "JOVEM",
    "LINHA", "LIVRO", "LOCAL", "LONGE", "LUGAR", "LUZES", "MAGIA", "MAIOR",
    "MANGA", "MARCA", "MARES", "MASSA", "MEIOS", "MENTE", "METAL", "MOTOR",
    "MUNDO", "MUSEU", "NAVIO", "NIVEL", "NOBRE", "NOITE", "NORTE", "NUVEM",
    "OBRAS", "OLHAR", "ONDAS", "ORDEM", "OUVIR", "PAPEL", "PARTE", "PASSO",
    "PASTA", "PAZES", "PEDRA", "PEIXE", "PIANO", "PILHA", "PISTA", "PLANO",
    "PODER", "POEMA", "PONTE", "PONTO", "PORTA", "PORTO", "PRAIA", "PRATA",
    "PRATO", "PRAZO", "PRECO", "PROVA", "PULSO", "RADIO", "RAMOS", "RAZAO",
    "REGRA", "REINO", "RITMO", "ROCHA", "RODAS", "ROSTO", "ROTAS", "SABER",
    "SABOR", "SAIDA", "SALTO", "SAUDE", "SELVA", "SENHA", "SERIE", "SINAL",
    "SOBRE", "SOLAR", "SONHO", "SORTE", "TERRA", "TEMPO", "TEXTO", "TIGRE",
    "TINTA", "TOQUE", "TORRE", "TRAMA", "TREVO", "TRIGO", "TROCA", "TURMA",
    "UNIAO", "UNICO", "VALOR", "VAPOR", "VELHO", "VENTO", "VERAO", "VERBO",
    "VERDE", "VERSO", "VIDRO", "VIGOR", "VINHO", "VISAO", "VISTA", "VIVER",
    "VOZES",
  ],
  6: [
    "ABERTO", "ABRIGO", "ACORDO", "AGENDA", "ALEGRE", "ALTURA", "AMIGOS",
    "ANIMAL", "ARVORE", "ATLETA", "AURORA", "AVANCO", "BAIRRO", "BARCOS",
    "BELEZA", "BLOCOS", "BONITO", "BOSQUE", "BRANCO", "BRASIL", "BRILHO",
    "BRONZE", "CABELO", "CAMISA", "CAMPOS", "CANCAO", "CANTOR", "CARTAO",
    "CENTRO", "CHAVES", "CHUVAS", "CIDADE", "CINEMA", "CLASSE", "CODIGO",
    "COLINA", "DEBATE", "DEFESA", "DEPOIS", "DIARIO", "DIRETO", "DIVINO",
    "DUVIDA", "EDITOR", "EFEITO", "ELENCO", "ENSINO", "EQUIPE", "ESCOLA",
    "ESCUTO", "ESPACO", "ESFERA", "ESTADO", "ESTILO", "ESTUDO", "EVENTO",
    "FABULA", "FERIAS", "FESTAS", "FIGURA", "FILMES", "FISICA", "FLORES",
    "FOLHAS", "FONTES", "FORMAS", "FORTES", "FRASES", "FRENTE", "FRUTAS",
    "FUTURO", "GRANDE", "GRUPOS", "GUARDA", "HEROIS", "HUMANO", "IDIOMA",
    "IMAGEM", "INICIO", "JARDIM", "JANELA", "JORNAL", "JOVENS", "LANCHE",
    "LEITOR", "LENDAS", "LETRAS", "LIMITE", "LINHAS", "LIVROS", "LOGICA",
    "MANTRA", "MARCAS", "MARGEM", "MATRIZ", "MEDIDA", "MELHOR", "MESTRE",
    "METODO", "MINUTO", "MODELO", "MOEDAS", "MUSICA", "NATURA", "NAVIOS",
    "NUVENS", "OBJETO", "OCEANO", "OFICIO", "ORIGEM", "OUTONO", "PADRAO",
    "PAGINA", "PAINEL", "PARQUE", "PASSOS", "PEDRAS", "PEIXES", "PERFIL",
    "PESSOA", "PILOTO", "PINTOR", "PLANTA", "POESIA", "PONTES", "PONTOS",
    "PORTAL", "PORTAS", "PRAIAS", "PREMIO", "PRISMA", "PRONTO", "QUADRO",
    "QUANTO", "QUARTO", "QUENTE", "RAIZES", "RAPIDO", "REGIAO", "REGRAS",
    "RELATO", "RESUMO", "RITMOS", "ROCHAS", "SABADO", "SABIOS", "SAIDAS",
    "SEGURO", "SEMANA", "SEMPRE", "SENTIR", "SERENO", "SINAIS", "SOLIDO",
    "SONHOS", "SORRIR", "TABELA", "TEATRO", "TECIDO", "TEMPLO", "TEMPOS",
    "TEORIA", "TERRAS", "TEXTOS", "TITULO", "TORRES", "TRILHA", "TROFEU",
    "ULTIMO", "UNIDOS", "UTOPIA", "VENTOS", "VERDES", "VERSOS", "VIAGEM",
    "VIDROS", "VIOLAO",
  ],
  7: [
    "ABACATE", "ACERTAR", "ALEGRIA", "ALIANCA", "AMIZADE", "ARQUIVO",
    "ATITUDE", "AUTORAL", "BALANCO", "BATERIA", "BELEZAS", "BRILHAR",
    "CADERNO", "CAMINHO", "CAMPEAO", "CANTIGA", "CAPITAL", "CARINHO",
    "CARRETA", "CASTELO", "CENARIO", "CERTEZA", "CIENCIA", "CIDADAO",
    "CIDADES", "COLECAO", "COMANDO", "CONEXAO", "CONVITE", "CORACAO",
    "CORAGEM", "CORRIDA", "CRIACAO", "CRIANCA", "CRISTAL", "CULTURA",
    "CUIDADO", "DECISAO", "DESAFIO", "DESENHO", "DESEJOS", "DESPESA",
    "DESTINO", "DETALHE", "DIALOGO", "DIRECAO", "DIREITO", "DOMINGO",
    "DURANTE", "EDUCADO", "EMPATIA", "ENERGIA", "ENTRADA", "ESCOLHA",
    "ESCRITA", "ESPELHO", "ESPORTE", "ESTACAO", "ESTRADA", "ESTRELA",
    "ESTUDAR", "EVENTOS", "EXEMPLO", "FAMILIA", "FARINHA", "FAZENDA",
    "FIRMEZA", "FORMATO", "FORTUNA", "GALAXIA", "GERACAO", "GIGANTE",
    "GOVERNO", "GRAMADO", "GRANITO", "IMPULSO", "INVERNO", "JANELAS",
    "JARDINS", "JORNADA", "JUSTICA", "LARANJA", "LEITURA", "LIBERAR",
    "LIDERAR", "LIMPEZA", "LUGARES", "MADEIRA", "MAESTRO", "MANEIRA",
    "MARINHA", "MATERIA", "MELODIA", "MEMORIA", "MERCADO", "MILAGRE",
    "MINUTOS", "MODERNO", "MOMENTO", "MORADIA", "MOSTRAR", "MUDANCA",
    "MUSICAL", "NATURAL", "NEBLINA", "NEGOCIO", "NOTICIA", "NUMEROS",
    "OCEANOS", "OFICINA", "OPINIAO", "OUTUBRO", "PALAVRA", "PALACIO",
    "PARQUES", "PARTIDA", "PASSARO", "PASSEIO", "PEGADAS", "PEQUENO",
    "PERFUME", "PERIODO", "PESSOAS", "PINTURA", "PLANETA", "PLANTAR",
    "PLANTAS", "POETICO", "POPULAR", "PORTAIS", "POSICAO", "PRATICA",
    "PREMIOS", "PROJETO", "PROXIMO", "PUBLICO", "QUADROS", "QUERIDO",
    "QUESTAO", "RECEITA", "RECORDE", "RECURSO", "REFLEXO", "REGIOES",
    "RELACAO", "RELOGIO", "RETORNO", "REUNIAO", "REVISTA", "RIQUEZA",
    "ROTEIRO", "SAUDADE", "SEGREDO", "SEGUNDO", "SEMENTE", "SENTIDO",
    "SERVICO", "SIMPLES", "SINCERO", "SISTEMA", "SOLUCAO", "SORRISO",
    "SUCESSO", "TALENTO", "TEATROS", "TECNICA", "TESOURO", "TRAJETO",
    "TRILHAS", "TRIUNFO", "UNIDADE", "VALENTE", "VALORES", "VARANDA",
    "VERDADE", "VIAGENS", "VITORIA", "VONTADE",
  ],
  8: [
    "ABACATES", "ACADEMIA", "AVENTURA", "CAMINHOS", "CAMPEOES", "CARRETAS",
    "CASTELOS", "CENARIOS", "CERTEZAS", "CIENCIAS", "CLASSICO", "COLECOES",
    "COLHEITA", "COMANDOS", "CONEXOES", "CONVITES", "CORACOES", "CORRIDAS",
    "CRIANCAS", "CRISTAIS", "CULTURAS", "CUIDADOS", "DECISOES", "DESAFIOS",
    "DESENHOS", "DESPESAS", "DESTINOS", "DETALHES", "DIALOGOS", "DIRECOES",
    "DIREITOS", "DOMINGOS", "ECONOMIA", "EDUCACAO", "ENERGIAS", "ENCONTRO",
    "ENTRADAS", "ESCOLHAS", "ESPELHOS", "ESPORTES", "ESTACOES", "ESTRADAS",
    "ESTRELAS", "EXEMPLOS", "FAMILIAS", "FAZENDAS", "FLORESTA", "FORMATOS",
    "FORTUNAS", "GALAXIAS", "GERACOES", "GIGANTES", "GOVERNOS", "GRATIDAO",
    "HARMONIA", "HISTORIA", "INVERNOS", "JORNADAS", "LARANJAS", "LEITURAS",
    "MADEIRAS", "MELODIAS", "MEMORIAS", "MENSAGEM", "MERCADOS", "MILAGRES",
    "MOMENTOS", "MONTANHA", "MUDANCAS", "NATUREZA", "NEGOCIOS", "NOTICIAS",
    "NOVIDADE", "OBJETIVO", "OFICINAS", "PALAVRAS", "PARTIDAS", "PASSAROS",
    "PASSEIOS", "PERFEITO", "PERFUMES", "PERIODOS", "PINTURAS", "PLANETAS",
    "PRESENTE", "PRIMEIRO", "PROJETOS", "PROMESSA", "PROXIMOS", "RECEITAS",
    "RECORDES", "RECURSOS", "REFLEXOS", "RELACOES", "RELOGIOS", "RESPEITO",
    "RESPOSTA", "RETORNOS", "REVISTAS", "RIQUEZAS", "ROTEIROS", "SAUDADES",
    "SEGREDOS", "SEGUNDOS", "SEMENTES", "SENTIDOS", "SERVICOS", "SILENCIO",
    "SIMBOLOS", "SISTEMAS", "SOLUCOES", "SORRISOS", "SUCESSOS", "TALENTOS",
    "TECNICAS", "TESOUROS", "TRABALHO", "TRADICAO", "TRAJETOS", "TRIUNFOS",
    "UNIVERSO", "VALENTES", "VARANDAS", "VERDADES", "VITORIAS", "VONTADES",
  ],
};

const EN_WORD_BANK = {
  4: [
    "ARCH", "BARK", "BEAM", "BIRD", "BLUE", "BOAT", "BOOK", "CALM",
    "CAMP", "CARD", "CITY", "CLAY", "CODE", "COIN", "COLD", "CORE",
    "DAWN", "DESK", "DOOR", "DRUM", "DUSK", "EAST", "ECHO", "FARM",
    "FERN", "FILE", "FILM", "FIRE", "FISH", "FLAG", "FLOW", "FORK",
    "GAME", "GATE", "GIFT", "GLOW", "GOLD", "GOLF", "GRID", "HAND",
    "HARP", "HEAT", "HILL", "HOME", "HOPE", "HORN", "IDEA", "IRON",
    "JADE", "JUMP", "KEEP", "KING", "KITE", "LAKE", "LAMP", "LAND",
    "LEAF", "LIFE", "LINE", "LINK", "LION", "LIST", "LOCK", "LOOP",
    "LOVE", "LUCK", "MARS", "MASK", "MAZE", "MIND", "MINT", "MIST",
    "MOON", "NEST", "NODE", "NOTE", "OATH", "OPEN", "PACE", "PAGE",
    "PALM", "PARK", "PATH", "PEAK", "PINE", "PLAN", "PLAY", "POEM",
    "POND", "PORT", "RAIN", "REEF", "RING", "LIFT", "ROAD", "ROCK",
    "ROOF", "ROOM", "9999".slice(0, 0), "ROSE", "RUBY", "SAIL", "SAND",
    "SEED", "SHIP", "22".slice(0, 0), "SHOW", "SILK", "33".slice(0, 0), "SNOW",
    "SONG", "STAR", "STEM", "STEP", "SWAN", "TALE", "TEAM", "TIDE",
    "TIME", "44".slice(0, 0), "TOWN", "TREE", "TUNE", "VALE", "VINE",
    "WAVE", "WEST", "WIND", "WING", "WOLF", "WOOD", "WORD", "ZERO",
  ].filter((w) => w.length === 4),
  5: [
    "APPLE", "ARROW", "BEACH", "BLOOM", "BOARD", "BRAIN", "BREAD", "BRICK",
    "BRUSH", "CHAIR", "CHARM", "CHASE", "CLEAR", "CLOCK", "CLOUD", "COAST",
    "CORAL", "22".slice(0, 0), "CRAFT", "CRANE", "CREEK", "CROWN", "DANCE",
    "DELTA", "DREAM", "DRIFT", "EAGLE", "EARTH", "EMBER", "FIELD", "FLAME",
    "FLASH", "FLEET", "FLORA", "FOCUS", "FORGE", "FRAME", "FROST", "FRUIT",
    "GLASS", "GLOBE", "GRACE", "GRAIN", "GRAPE", "GRASS", "GROVE", "GUARD",
    "GUIDE", "HEART", "HONEY", "HORSE", "HOUSE", "IMAGE", "JEWEL", "JUICE",
    "LASER", "LEMON", "LIGHT", "LOTUS", "LOGIC", "MAGIC", "MAPLE", "MARCH",
    "MEDAL", "MELON", "METAL", "MUSIC", "NIGHT", "NOBLE", "NORTH", "NOVEL",
    "OCEAN", "OLIVE", "ORBIT", "PAINT", "PANEL", "PAPER", "PEACH", "PEARL",
    "PHASE", "2".slice(0, 0), "PIANO", "PILOT", "PLANT", "PLATE", "PLAZA",
    "POINT", "POWER", "PRISM", "PRIZE", "PULSE", "QUEEN", "QUEST", "QUIET",
    "RADAR", "RADIO", "RANGE", "RIVER", "ROBOT", "1".slice(0, 0), "ROUTE",
    "ROYAL", "SCALE", "SCENE", "SCOPE", "SHADE", "SHAPE", "SHARK", "SHELL",
    "SHIFT", "SHINE", "SHORE", "SIGHT", "SKILL", "SMART", "SMILE", "SOLAR",
    "SOUND", "SOUTH", "SPACE", "SPARK", "SPEED", "SPICE", "STAGE", "STEAM",
    "STEEL", "STONE", "STORM", "STORY", "STYLE", "SUGAR", "SWIFT", "TABLE",
    "TIGER", "TOWER", "2".slice(0, 0), "TRACK", "TRADE", "TRAIL", "TRAIN",
    "TREND", "TRUST", "TRUTH", "UNITY", "VALUE", "VALVE", "VAULT", "VOICE",
    "WATER", "WHALE", "WHEAT", "WHEEL", "WORLD", "YOUTH",
  ].filter((w) => w.length === 5),
  6: [
    "ANCHOR", "ARTIST", "AUTUMN", "BEACON", "BREEZE", "BRIDGE", "BRIGHT",
    "BRONZE", "CAMERA", "CANDLE", "CANYON", "CASTLE", "CENTER", "CIRCLE",
    "CLOVER", "COBALT", "COFFEE", "COLUMN", "COMET", "COPPER", "CORNER",
    "CRUISE", "DESERT", "DESIGN", "DETAIL", "DOMAIN", "DRAGON", "EMPIRE",
    "ENERGY", "ENGINE", "FABRIC", "FACTOR", "FALCON", "FLOWER", "FOREST",
    "FUTURE", "GALAXY", "GARDEN", "GEYSER", "GLOBAL", "GOLDEN", "GUITAR",
    "HARBOR", "HEALTH", "HELMET", "HORIZON".slice(0, 6), "ISLAND", "JACKET",
    "JUNGLE", "KERNEL", "KNIGHT", "LAGOON", "LAUNCH", "LEGEND", "LETTER",
    "MAGNET", "MARBLE", "MARKET", "MATRIX", "MEADOW", "MELODY", "MEMORY",
    "METEOR", "MIRROR", "MODERN", "MOMENT", "MOTION", "MUSEUM", "NATURE",
    "NEBULA", "OBJECT", "ORANGE", "ORCHID", "ORIGIN", "PALACE", "PLANET",
    "POCKET", "PORTAL", "PUZZLE", "QUARTZ", "RECORD", "REGION", "REWARD",
    "RHYTHM", "RIBBON", "ROCKET", "RUNNER", "SAFARI", "SAMPLE", "SEASON",
    "SECRET", "SENSOR", "SHADOW", "SHIELD", "SIGNAL", "SILVER", "SIMPLE",
    "SKETCH", "SOURCE", "0".slice(0, 0), "SPIRIT", "SPRING", "SQUARE", "STREAM",
    "STREET", "STUDIO", "SUMMER", "SUMMIT", "SUNSET", "SYMBOL", "SYSTEM",
    "TEMPLE", "THEORY", "TICKET", "TIMBER", "TRAVEL", "TROPHY", "TUNNEL",
    "VALLEY", "VELVET", "VESSEL", "VICTOR", "VISION", "VOYAGE", "WEALTH",
    "WINDOW", "WINTER", "WISDOM", "WONDER", "ZENITH",
  ].filter((w) => w.length === 6),
  7: [
    "AVOCADO", "EXPENSE", "FREIGHT", "ACADEMY", "AIRPORT", "BALANCE",
    "BATTERY", "CABINET", "CAPTAIN", "CARAVAN", "CENTRAL", "CHANNEL",
    "CHAPTER", "CIRCUIT", "CLIMATE", "COMFORT", "COMPASS", "CONCEPT",
    "CONCERT", "CONTROL", "COURAGE", "CRYSTAL", "CULTURE", "CURRENT",
    "DESTINY", "DIAMOND", "DISPLAY", "DOLPHIN", "DYNAMIC", "ECLIPSE",
    "EDITION", "ELEMENT", "EMERALD", "EVENING", "EXPRESS", "FACTORY",
    "FASHION", "FEATHER", "FEATURE", "FESTIVA", "FORTUNE", "FREEDOM",
    "GALLERY", "GLACIER", "GRAVITY", "HABITAT", "HARMONY", "HARVEST",
    "HISTORY", "HORIZON", "IMAGINE", "INSIGHT", "JOURNEY", "JUSTICE",
    "KINGDOM", "LANTERN", "LIBERTY", "LIBRARY", "MACHINE", "MESSAGE",
    "MINERAL", "MISSION", "MORNING", "MYSTERY", "NATURAL", "NETWORK",
    "ORCHARD", "OUTCOME", "PACKAGE", "PIONEER", "PROMISE", "PROJECT",
    "PURPOSE", "PYRAMID", "QUALITY", "RAINBOW", "RESPECT", "SCIENCE",
    "SILENCE", "SOCIETY", "STADIUM", "STATION", "STORAGE", "SUCCESS",
    "SUNRISE", "SUPPORT", "SURFACE", "SYMPHON", "THEATER", "THUNDER",
    "TRAFFIC", "TRIUMPH", "UNICORN", "VENTURE", "VICTORY", "VILLAGE",
    "VINTAGE", "WEATHER", "WHISPER",
  ].filter((w) => w.length === 7),
  8: [
    "ABSOLUTE", "ACTIVITY", "ALLIANCE", "ALTITUDE", "AMBITION", "BLUEBIRD",
    "CALENDAR", "CAMPAIGN", "CAPACITY", "CATEGORY", "CEREMONY", "CHAMPION",
    "COMPUTER", "CREATIVE", "DAYLIGHT", "DECISION", "DELIVERY", "DIALOGUE",
    "DIRECTOR", "DISCOVER", "DISTRICT", "ELEGANCE", "EXCHANGE", "EXERCISE",
    "EXPLORER", "FESTIVAL", "FOUNTAIN", "FRONTIER", "GARDENER", "GRAPHICS",
    "HERITAGE", "HIGHLAND", "IDENTITY", "INDUSTRY", "KEYBOARD", "LANGUAGE",
    "LEARNING", "MAGNETIC", "MARATHON", "MATERIAL", "MEDICINE", "MONUMENT",
    "MOUNTAIN", "MOVEMENT", "NOTEBOOK", "ORIGINAL", "PAINTING", "PARADISE",
    "PATIENCE", "PLATFORM", "PLEASURE", "PORTRAIT", "POSITIVE", "PRACTICE",
    "PROGRESS", "QUESTION", "REACTION", "REPUBLIC", "RESOURCE", "SANDWICH",
    "SCHEDULE", "SECURITY", "SOLUTION", "STANDARD", "STARLIGHT".slice(0, 8),
    "STRATEGY", "STRENGTH", "SUNLIGHT", "SYMPHONY", "TOMORROW", "TREASURE",
    "UNIVERSE", "VACATION", "WILDLIFE", "WORKSHOP",
  ].filter((w) => w.length === 8),
};

/* ==========================================================================
   Preset Puzzles (Português Presets + Live REA Capture #142)
   ========================================================================== */

const PRESET_PUZZLES = [
  {
    id: "pt-201",
    puzzleId: 201,
    lang: "pt",
    title: "Português #201 (5×5 Labirinto)",
    edition: "#201-PT",
    gridRows: 5,
    gridCols: 5,
    // 4 interior pillar wall obstacles at [6, 8, 16, 18] creating a maze
    // Word 1 [11, 10, 5, 0, 1, 2, 7] -> PLANETA
    // Word 2 [15, 20, 21, 22, 17, 12, 13] -> CAMINHO
    // Word 3 [3, 4, 9, 14, 19, 24, 23] -> ESTRELA
    puzzleLetters: [
      "N", "E", "T", "E", "S",
      "A", "",  "A", "",  "T",
      "L", "P", "H", "O", "R",
      "C", "",  "N", "",  "E",
      "A", "M", "I", "A", "L",
    ],
    solutionWords: [
      { sequencingIndex: [11, 10, 5, 0, 1, 2, 7] },
      { sequencingIndex: [15, 20, 21, 22, 17, 12, 13] },
      { sequencingIndex: [3, 4, 9, 14, 19, 24, 23] },
    ],
    presets: [],
  },
  {
    id: "pt-202",
    puzzleId: 202,
    lang: "pt",
    title: "Português #202 (6×6 Labirinto)",
    edition: "#202-PT",
    gridRows: 6,
    gridCols: 6,
    // 6 interior/corridor wall obstacles at [7, 8, 16, 19, 22, 27]
    // Word 1 [13, 12, 6, 0, 1, 2] -> OCEANO
    // Word 2 [3, 4, 5, 11, 10, 9] -> JARDIM
    // Word 3 [14, 15, 21, 20, 26, 25] -> VIAGEM
    // Word 4 [18, 24, 30, 31, 32, 33] -> FUTURO
    // Word 5 [17, 23, 29, 35, 34, 28] -> BRASIL
    puzzleLetters: [
      "A", "N", "O", "J", "A", "R",
      "E", "",  "",  "M", "I", "D",
      "C", "O", "V", "I", "",  "B",
      "F", "",  "G", "A", "",  "R",
      "U", "M", "E", "",  "L", "A",
      "T", "U", "R", "O", "I", "S",
    ],
    solutionWords: [
      { sequencingIndex: [13, 12, 6, 0, 1, 2] },
      { sequencingIndex: [3, 4, 5, 11, 10, 9] },
      { sequencingIndex: [14, 15, 21, 20, 26, 25] },
      { sequencingIndex: [18, 24, 30, 31, 32, 33] },
      { sequencingIndex: [17, 23, 29, 35, 34, 28] },
    ],
    presets: [],
  },
  {
    id: "pt-142",
    puzzleId: 142,
    lang: "pt",
    title: "Português #142 (5×5 Octógono)",
    edition: "#142-PT",
    gridRows: 5,
    gridCols: 5,
    // Exact geometry & paths of Live #142 adapted to 3 x 7-letter Portuguese words:
    // Word 1 [15,10,5,6,1,2,3] -> ABACATE
    // Word 2 [23,22,17,12,11,16,21] -> DESPESA
    // Word 3 [13,18,19,14,9,8,7] -> CARRETA
    puzzleLetters: [
      "",  "A", "T", "E", "",
      "A", "C", "A", "T", "E",
      "B", "E", "P", "C", "R",
      "A", "S", "S", "A", "R",
      "",  "A", "E", "D", "",
    ],
    solutionWords: [
      { sequencingIndex: [15, 10, 5, 6, 1, 2, 3] },
      { sequencingIndex: [23, 22, 17, 12, 11, 16, 21] },
      { sequencingIndex: [13, 18, 19, 14, 9, 8, 7] },
    ],
    presets: [],
  },
  {
    id: "live-142-en",
    puzzleId: 142,
    lang: "en",
    title: "Live Capture #142 (5×5 EN Daily)",
    edition: "#142",
    gridRows: 5,
    gridCols: 5,
    puzzleLetters: [
      "",  "A", "D", "O", "",
      "O", "C", "T", "H", "G",
      "V", "N", "E", "F", "I",
      "A", "S", "P", "R", "E",
      "",  "E", "X", "E", "",
    ],
    solutionWords: [
      { sequencingIndex: [15, 10, 5, 6, 1, 2, 3] },
      { sequencingIndex: [23, 22, 17, 12, 11, 16, 21] },
      { sequencingIndex: [13, 18, 19, 14, 9, 8, 7] },
    ],
    presets: [],
  },
];

/* ==========================================================================
   Core Geometry, Color & Path Helpers (Exact port from C7ZU1-qQ.js)
   ========================================================================== */

function isHoleCell(letter) {
  return (letter ?? "") === "";
}

function areOrthogonallyAdjacent(idxA, idxB, gridCols) {
  const rA = Math.floor(idxA / gridCols);
  const cA = idxA % gridCols;
  const rB = Math.floor(idxB / gridCols);
  const cB = idxB % gridCols;
  return Math.abs(rA - rB) + Math.abs(cA - cB) === 1;
}

function getDirection(fromIdx, toIdx, gridCols) {
  const r1 = Math.floor(fromIdx / gridCols);
  const c1 = fromIdx % gridCols;
  const r2 = Math.floor(toIdx / gridCols);
  const c2 = toIdx % gridCols;
  if (r2 === r1 && c2 === c1 + 1) return "RIGHT";
  if (r2 === r1 && c2 === c1 - 1) return "LEFT";
  if (c2 === c1 && r2 === r1 + 1) return "DOWN";
  if (c2 === c1 && r2 === r1 - 1) return "UP";
  return null;
}

function deterministicRotate(arr, seed) {
  if (!arr.length) return [];
  const shift = ((seed % arr.length) + arr.length) % arr.length;
  return [...arr.slice(shift), ...arr.slice(0, shift)];
}

function createColorContext(puzzleId, wordInsertionOrder = []) {
  const id = Number(puzzleId) || 142;
  const colorList = [
    ...deterministicRotate(WEND_PALETTE_1, id),
    ...deterministicRotate(WEND_PALETTE_2, id + 3),
  ];
  return {
    colorList,
    wordInsertionOrder: [...wordInsertionOrder],
  };
}

function getWordColor(colorContext, startCellIdx) {
  if (startCellIdx === undefined || startCellIdx === null) {
    return WEND_PALETTE_1[0];
  }
  const { colorList, wordInsertionOrder } = colorContext;
  const idx = wordInsertionOrder.indexOf(startCellIdx);
  const pos = idx >= 0 ? idx : wordInsertionOrder.length;
  return colorList[pos % colorList.length];
}

function getWordString(wordObj, puzzleLetters) {
  if (!wordObj || !wordObj.sequencingIndex) return "";
  return wordObj.sequencingIndex.map((i) => puzzleLetters[i] ?? "").join("");
}

/**
 * Exact port of eg in C7ZU1-qQ.js:
 * Computes hole edge bitmask (1=TOP, 2=RIGHT, 4=BOTTOM, 8=LEFT) where a hole borders a non-hole cell.
 */
function computeHoleEdgeMasks(puzzleLetters, gridRows, gridCols) {
  const total = gridRows * gridCols;
  const masks = new Array(total).fill(0);
  const isHole = (i) => isHoleCell(puzzleLetters[i]);
  for (let i = 0; i < total; i++) {
    if (!isHole(i)) continue;
    const r = Math.floor(i / gridCols);
    const c = i % gridCols;
    let m = 0;
    if (r > 0 && !isHole(i - gridCols)) m |= 1;
    if (c < gridCols - 1 && !isHole(i + 1)) m |= 2;
    if (r < gridRows - 1 && !isHole(i + gridCols)) m |= 4;
    if (c > 0 && !isHole(i - 1)) m |= 8;
    masks[i] = m;
  }
  return masks;
}

function isExactSolutionWord(guess, solutionWords) {
  const key = guess.sequencingIndex.join(",");
  return solutionWords.some((s) => s.sequencingIndex.join(",") === key);
}

function getLockedWordIndices(guesses, solutionWords) {
  const locked = new Set();
  guesses.forEach((g, idx) => {
    if (isExactSolutionWord(g, solutionWords)) {
      locked.add(idx);
    }
  });
  return locked;
}

function isBoardSolved(guesses, solutionWords) {
  if (guesses.length !== solutionWords.length) return false;
  const gKeys = guesses.map((g) => g.sequencingIndex.join(",")).sort();
  const sKeys = solutionWords.map((s) => s.sequencingIndex.join(",")).sort();
  return gKeys.every((k, i) => k === sKeys[i]);
}

function isBoardFilledButUnsolved(guesses, solutionWords) {
  if (guesses.length !== solutionWords.length) return false;
  const gLens = guesses.map((g) => g.sequencingIndex.length).sort((a, b) => a - b);
  const sLens = solutionWords
    .map((s) => s.sequencingIndex.length)
    .sort((a, b) => a - b);
  return (
    gLens.every((len, i) => len === sLens[i]) &&
    !isBoardSolved(guesses, solutionWords)
  );
}

/**
 * Exact port of ns(guesses, activeWordIdx, activePath, targetCellIdx, gridCols, lockedWordIndices)
 * Checks if dragging from the end of activePath into targetCellIdx merges with another unlocked word.
 */
function findMergeCandidate(
  guesses,
  activeWordIdx,
  activePath,
  targetCellIdx,
  gridCols,
  lockedWordIndices
) {
  const tailCell = activePath[activePath.length - 1];
  if (
    tailCell === undefined ||
    !areOrthogonallyAdjacent(tailCell, targetCellIdx, gridCols) ||
    activePath.includes(targetCellIdx)
  ) {
    return null;
  }

  for (let i = 0; i < guesses.length; i++) {
    if (i === activeWordIdx || (lockedWordIndices && lockedWordIndices.has(i))) {
      continue;
    }
    const seq = guesses[i].sequencingIndex;
    if (seq.length === 0) continue;
    const isStart = seq[0] === targetCellIdx;
    const isEnd = seq[seq.length - 1] === targetCellIdx;
    if (!isStart && !isEnd) continue;
    const enteredLastCell = isEnd && !isStart;
    const appendedCells = enteredLastCell ? [...seq].reverse() : [...seq];
    return {
      mergedWordIdx: i,
      enteredLastCell,
      appendedCells,
    };
  }
  return null;
}

/* ==========================================================================
   Word List Row Builder (Exact port of ni & nr in C7ZU1-qQ.js)
   ========================================================================== */

function buildWordListRows({
  guesses,
  solutionWords,
  puzzleLetters,
  activeWordIdx = null,
  lockedWordIndices = new Set(),
  presets = [],
}) {
  const presetMap = new Map();
  for (const p of presets || []) {
    const sol = solutionWords[p.solutionWordIndex];
    if (!sol) continue;
    const validSet = new Set(
      (p.presetLetterIndices || []).filter(
        (idx) => idx >= 0 && idx < sol.sequencingIndex.length
      )
    );
    if (validSet.size > 0) {
      presetMap.set(p.solutionWordIndex, validSet);
    }
  }

  const sortedCapacities = solutionWords
    .map((sw, idx) => ({
      capacity: sw.sequencingIndex.length,
      idx,
      presetLetterIndices: presetMap.get(idx) || new Set(),
    }))
    .sort((a, b) => a.capacity - b.capacity || a.idx - b.idx);

  // Order guesses: locked first, then unlocked, then activeWordIdx last
  const hasActive =
    activeWordIdx !== null &&
    activeWordIdx >= 0 &&
    activeWordIdx < guesses.length;
  const lockedList = [];
  const unlockedList = [];
  for (let i = 0; i < guesses.length; i++) {
    if (hasActive && i === activeWordIdx) continue;
    if (lockedWordIndices.has(i)) lockedList.push(i);
    else unlockedList.push(i);
  }
  const orderedGuessIndices = hasActive
    ? [...lockedList, ...unlockedList, activeWordIdx]
    : [...lockedList, ...unlockedList];

  const matchesPreset = (capSlot, guessObj) => {
    if (capSlot.presetLetterIndices.size === 0) return true;
    const solSeq = solutionWords[capSlot.idx].sequencingIndex;
    let checkedAny = false;
    for (const pIdx of capSlot.presetLetterIndices) {
      if (pIdx >= guessObj.sequencingIndex.length) continue;
      if (guessObj.sequencingIndex[pIdx] !== solSeq[pIdx]) return false;
      checkedAny = true;
    }
    return checkedAny;
  };

  const assignedBySlot = new Map();
  const usedSlots = new Set();
  const extraRows = [];

  for (const gIdx of orderedGuessIndices) {
    const guessObj = guesses[gIdx];
    const letters = guessObj.sequencingIndex.map((c) => puzzleLetters[c] ?? "");

    // Find smallest fitting slot >= letters.length
    let fittingSlot = null;
    for (let s = 0; s < sortedCapacities.length; s++) {
      const cap = sortedCapacities[s];
      if (
        !usedSlots.has(s) &&
        cap.capacity >= letters.length &&
        matchesPreset(cap, guessObj)
      ) {
        fittingSlot = s;
        break;
      }
    }

    // If none fits without overflow, pick largest available matching slot
    let fallbackSlot = null;
    if (fittingSlot === null) {
      let maxCap = -1;
      for (let s = 0; s < sortedCapacities.length; s++) {
        const cap = sortedCapacities[s];
        if (
          !usedSlots.has(s) &&
          matchesPreset(cap, guessObj) &&
          cap.capacity > maxCap
        ) {
          fallbackSlot = s;
          maxCap = cap.capacity;
        }
      }
    }

    const chosenSlot = fittingSlot ?? fallbackSlot;
    if (chosenSlot === null) {
      extraRows.push({
        capacity: 0,
        letters,
        hasOverflow: true,
        isExtraRow: true,
        wordIdx: gIdx,
        presetLetterIndices: new Set(),
      });
      continue;
    }

    const slotMeta = sortedCapacities[chosenSlot];
    const hasOverflow = fittingSlot === null;
    usedSlots.add(chosenSlot);

    const paddedLetters = hasOverflow
      ? [...letters]
      : letters.length >= slotMeta.capacity
      ? [...letters]
      : [
          ...letters,
          ...Array.from({ length: slotMeta.capacity - letters.length }, () => ""),
        ];

    if (slotMeta.presetLetterIndices.size > 0) {
      const solSeq = solutionWords[slotMeta.idx].sequencingIndex;
      for (const pIdx of slotMeta.presetLetterIndices) {
        paddedLetters[pIdx] = puzzleLetters[solSeq[pIdx]] ?? "";
      }
    }

    assignedBySlot.set(chosenSlot, {
      capacity: slotMeta.capacity,
      letters: paddedLetters,
      hasOverflow,
      isExtraRow: false,
      wordIdx: gIdx,
      presetLetterIndices: slotMeta.presetLetterIndices,
    });
  }

  const baseRows = new Array(solutionWords.length);
  for (let s = 0; s < sortedCapacities.length; s++) {
    const slotMeta = sortedCapacities[s];
    const solSeq = solutionWords[slotMeta.idx].sequencingIndex;
    baseRows[slotMeta.idx] = assignedBySlot.get(s) || {
      capacity: slotMeta.capacity,
      letters: Array.from({ length: slotMeta.capacity }, (_, i) =>
        slotMeta.presetLetterIndices.has(i) ? puzzleLetters[solSeq[i]] ?? "" : ""
      ),
      hasOverflow: false,
      isExtraRow: false,
      wordIdx: null,
      presetLetterIndices: slotMeta.presetLetterIndices,
    };
  }

  return [...baseRows, ...extraRows];
}

/* ==========================================================================
   4-Stage Progressive Hint Engine (Exact port of nf in C7ZU1-qQ.js)
   ========================================================================== */

const WendHintEngine = {
  findMatchingSolutionByStart(guess, solutionWords) {
    const startCell = guess.sequencingIndex[0];
    if (startCell === undefined) return null;
    return (
      solutionWords.find((s) => s.sequencingIndex[0] === startCell) || null
    );
  },

  commonPrefixLength(guess, sol) {
    let len = 0;
    for (let i = 0; i < guess.sequencingIndex.length; i++) {
      if (guess.sequencingIndex[i] === sol.sequencingIndex[i]) len++;
      else break;
    }
    return len;
  },

  computeSingleStepHint(guesses, solutionWords) {
    // 1. Check for incorrect guesses (either wrong start cell or diverged path)
    const incorrect = [];
    for (let i = 0; i < guesses.length; i++) {
      const g = guesses[i];
      if (isExactSolutionWord(g, solutionWords)) continue;
      const sol = this.findMatchingSolutionByStart(g, solutionWords);
      if (sol === null) {
        incorrect.push({ guessIdx: i, solution: null });
        continue;
      }
      const prefixLen = this.commonPrefixLength(g, sol);
      const isValidPrefix =
        g.sequencingIndex.length < sol.sequencingIndex.length &&
        prefixLen === g.sequencingIndex.length;
      if (!isValidPrefix) {
        incorrect.push({ guessIdx: i, solution: sol });
      }
    }

    if (incorrect.length > 0) {
      // Pick longest incorrect guess (tie-break by smallest start cell)
      let chosen = incorrect[0];
      for (const cand of incorrect.slice(1)) {
        const candLen = guesses[cand.guessIdx].sequencingIndex.length;
        const chosenLen = guesses[chosen.guessIdx].sequencingIndex.length;
        if (
          candLen > chosenLen ||
          (candLen === chosenLen &&
            (guesses[cand.guessIdx].sequencingIndex[0] ?? 0) <
              (guesses[chosen.guessIdx].sequencingIndex[0] ?? 0))
        ) {
          chosen = cand;
        }
      }

      const targetGuess = guesses[chosen.guessIdx];
      const sol = this.findMatchingSolutionByStart(targetGuess, solutionWords);
      if (sol !== null) {
        const prefixLen = this.commonPrefixLength(targetGuess, sol);
        if (prefixLen > 0) {
          const trimmed = {
            sequencingIndex: targetGuess.sequencingIndex.slice(0, prefixLen),
          };
          const nextGuesses = guesses.slice();
          nextGuesses[chosen.guessIdx] = trimmed;
          return {
            type: WendHintType.TRIM_INCORRECT,
            highlightedCells: targetGuess.sequencingIndex.slice(),
            nextGuesses,
            solvesGame: false,
            producedCorrectWord: isExactSolutionWord(trimmed, solutionWords),
          };
        }
      }

      const nextGuesses = guesses.slice();
      nextGuesses.splice(chosen.guessIdx, 1);
      return {
        type: WendHintType.REMOVE_INCORRECT,
        highlightedCells: targetGuess.sequencingIndex.slice(),
        nextGuesses,
        solvesGame: false,
        producedCorrectWord: false,
      };
    }

    // 2. Check for partially completed valid prefixes (EXTEND_PARTIAL)
    const partials = [];
    for (let i = 0; i < guesses.length; i++) {
      const g = guesses[i];
      if (isExactSolutionWord(g, solutionWords)) continue;
      const sol = this.findMatchingSolutionByStart(g, solutionWords);
      if (sol !== null && g.sequencingIndex.length < sol.sequencingIndex.length) {
        partials.push({ guessIdx: i, solution: sol });
      }
    }

    if (partials.length > 0) {
      let chosen = partials[0];
      for (const cand of partials.slice(1)) {
        const candLen = guesses[cand.guessIdx].sequencingIndex.length;
        const chosenLen = guesses[chosen.guessIdx].sequencingIndex.length;
        if (
          candLen < chosenLen ||
          (candLen === chosenLen &&
            (guesses[cand.guessIdx].sequencingIndex[0] ?? 0) <
              (guesses[chosen.guessIdx].sequencingIndex[0] ?? 0))
        ) {
          chosen = cand;
        }
      }

      const targetGuess = guesses[chosen.guessIdx];
      const nextCell =
        chosen.solution.sequencingIndex[targetGuess.sequencingIndex.length];
      const extended = {
        sequencingIndex: targetGuess.sequencingIndex.concat(nextCell),
      };
      const nextGuesses = guesses.slice();
      nextGuesses[chosen.guessIdx] = extended;
      const producedCorrectWord = isExactSolutionWord(extended, solutionWords);
      const solvesGame =
        producedCorrectWord && isBoardSolved(nextGuesses, solutionWords);

      return {
        type: WendHintType.EXTEND_PARTIAL,
        highlightedCells: extended.sequencingIndex.slice(),
        nextGuesses,
        solvesGame,
        producedCorrectWord,
      };
    }

    // 3. Reveal first letter of shortest unstarted solution word (REVEAL_FIRST_LETTER)
    const unstarted = solutionWords.filter(
      (sol) =>
        !guesses.some((g) => g.sequencingIndex[0] === sol.sequencingIndex[0])
    );
    if (unstarted.length === 0) return null;

    let chosenSol = unstarted[0];
    for (const sol of unstarted.slice(1)) {
      if (
        sol.sequencingIndex.length < chosenSol.sequencingIndex.length ||
        (sol.sequencingIndex.length === chosenSol.sequencingIndex.length &&
          (sol.sequencingIndex[0] ?? 0) < (chosenSol.sequencingIndex[0] ?? 0))
      ) {
        chosenSol = sol;
      }
    }

    const firstCell = chosenSol.sequencingIndex[0];
    const singleGuess = { sequencingIndex: [firstCell] };
    return {
      type: WendHintType.REVEAL_FIRST_LETTER,
      highlightedCells: [firstCell],
      nextGuesses: guesses.concat(singleGuess),
      solvesGame: false,
      producedCorrectWord: isExactSolutionWord(singleGuess, solutionWords),
    };
  },

  /**
   * Exact port of onHint chaining in nM (C7ZU1-qQ.js):
   * If the first step is TRIM_INCORRECT or REMOVE_INCORRECT, chains cleanup steps
   * and then applies a forward hint with `correctionApplied: true`.
   */
  applyHint(guesses, solutionWords) {
    const first = this.computeSingleStepHint(guesses, solutionWords);
    if (!first) return null;

    const isCleanup = (t) =>
      t === WendHintType.TRIM_INCORRECT || t === WendHintType.REMOVE_INCORRECT;

    if (!isCleanup(first.type)) {
      return first;
    }

    let current = first;
    let next = this.computeSingleStepHint(current.nextGuesses, solutionWords);
    while (next !== null && isCleanup(next.type)) {
      current = next;
      next = this.computeSingleStepHint(current.nextGuesses, solutionWords);
    }

    if (next !== null) {
      return {
        ...next,
        correctionApplied: true,
      };
    }
    return current;
  },
};

/* ==========================================================================
   Procedural Bilingual (PT-BR & EN) Wend Puzzle Generator
   ========================================================================== */

const ProceduralWendGenerator = {
  templates: {
    "4x4": {
      gridRows: 4,
      gridCols: 4,
      dynamicMaze: true,
      holes: [5, 10],
      wordLengthOptions: [
        [4, 5, 5], // 14 letters + 2 maze wall obstacles = 16
        [4, 4, 5], // 13 letters + 3 maze wall obstacles = 16
      ],
    },
    "5x5-octagon": {
      gridRows: 5,
      gridCols: 5,
      dynamicMaze: false,
      holes: [0, 4, 20, 24], // Exact 21-cell octagon shape of Live #142!
      wordLengthOptions: [
        [7, 7, 7],
        [5, 5, 5, 6],
      ],
    },
    "5x5-full": {
      gridRows: 5,
      gridCols: 5,
      dynamicMaze: true,
      holes: [6, 8, 16, 18],
      wordLengthOptions: [
        [7, 7, 7],    // 21 letters + 4 interior maze walls = 25
        [5, 5, 5, 6], // 21 letters + 4 interior maze walls = 25
        [5, 5, 6, 6], // 22 letters + 3 interior maze walls = 25
        [5, 5, 5, 5], // 20 letters + 5 interior maze walls = 25
      ],
    },
    "6x6-octagon": {
      gridRows: 6,
      gridCols: 6,
      dynamicMaze: true,
      holes: [7, 8, 16, 19, 22, 27],
      wordLengthOptions: [
        [6, 6, 6, 6, 6], // 30 letters + 6 interior maze walls = 36
        [7, 7, 8, 8],    // 30 letters + 6 interior maze walls = 36
        [6, 6, 6, 7, 7], // 32 letters + 4 interior maze walls = 36
        [8, 8, 8, 8],    // 32 letters + 4 interior maze walls = 36
      ],
    },
  },

  shuffle(arr) {
    const res = [...arr];
    for (let i = res.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = res[i];
      res[i] = res[j];
      res[j] = tmp;
    }
    return res;
  },

  /**
   * Generates a random set of `numObstacles` maze wall slots on a gridRows × gridCols board,
   * prioritizing interior cells to create corridors/turns while keeping all letter cells connected.
   */
  generateMazeObstacles(gridRows, gridCols, numObstacles, wordCount) {
    const total = gridRows * gridCols;
    if (numObstacles <= 0) return new Set();

    const interiorPool = [];
    const borderPool = [];
    for (let idx = 0; idx < total; idx++) {
      const r = Math.floor(idx / gridCols);
      const c = idx % gridCols;
      if (r > 0 && r < gridRows - 1 && c > 0 && c < gridCols - 1) {
        interiorPool.push(idx);
      } else {
        borderPool.push(idx);
      }
    }

    for (let tr = 0; tr < 40; tr++) {
      const holesSet = new Set();
      const shuffledInterior = this.shuffle(interiorPool);
      const shuffledBorder = this.shuffle(borderPool);

      // Place at least 60% of obstacles inside the interior to form a true maze
      const targetInterior = Math.min(
        shuffledInterior.length,
        Math.max(1, Math.ceil(numObstacles * 0.65))
      );

      for (let i = 0; i < targetInterior && holesSet.size < numObstacles; i++) {
        holesSet.add(shuffledInterior[i]);
      }

      const remainingPool = this.shuffle([
        ...shuffledInterior.slice(targetInterior),
        ...shuffledBorder,
      ]);
      for (let i = 0; i < remainingPool.length && holesSet.size < numObstacles; i++) {
        holesSet.add(remainingPool[i]);
      }

      // Check degree & connectivity of non-hole cells
      let hasIsolated = false;
      let deadEnds = 0;
      let firstPlayable = -1;

      for (let idx = 0; idx < total; idx++) {
        if (holesSet.has(idx)) continue;
        if (firstPlayable === -1) firstPlayable = idx;
        const r = Math.floor(idx / gridCols);
        const c = idx % gridCols;
        let deg = 0;
        if (r > 0 && !holesSet.has(idx - gridCols)) deg++;
        if (r < gridRows - 1 && !holesSet.has(idx + gridCols)) deg++;
        if (c > 0 && !holesSet.has(idx - 1)) deg++;
        if (c < gridCols - 1 && !holesSet.has(idx + 1)) deg++;
        if (deg === 0) {
          hasIsolated = true;
          break;
        }
        if (deg === 1) deadEnds++;
      }

      if (hasIsolated || deadEnds > wordCount * 2) continue;

      // Verify single connected component via BFS
      const visited = new Set([firstPlayable]);
      const queue = [firstPlayable];
      while (queue.length > 0) {
        const cur = queue.shift();
        const r = Math.floor(cur / gridCols);
        const c = cur % gridCols;
        const adj = [];
        if (r > 0) adj.push(cur - gridCols);
        if (r < gridRows - 1) adj.push(cur + gridCols);
        if (c > 0) adj.push(cur - 1);
        if (c < gridCols - 1) adj.push(cur + 1);
        for (const nxt of adj) {
          if (!holesSet.has(nxt) && !visited.has(nxt)) {
            visited.add(nxt);
            queue.push(nxt);
          }
        }
      }

      if (visited.size === total - numObstacles) {
        return holesSet;
      }
    }

    return null;
  },

  /**
   * Partitions all non-hole cells of a gridRows × gridCols board into
   * non-overlapping orthogonal simple paths matching `wordLengths`.
   */
  partitionGridIntoPaths(gridRows, gridCols, holesSet, wordLengths) {
    const total = gridRows * gridCols;
    const visited = new Array(total).fill(false);
    for (const h of holesSet) visited[h] = true;

    const getNeighbors = (idx) => {
      const r = Math.floor(idx / gridCols);
      const c = idx % gridCols;
      const list = [];
      if (r > 0 && !visited[idx - gridCols]) list.push(idx - gridCols);
      if (r < gridRows - 1 && !visited[idx + gridCols]) list.push(idx + gridCols);
      if (c > 0 && !visited[idx - 1]) list.push(idx - 1);
      if (c < gridCols - 1 && !visited[idx + 1]) list.push(idx + 1);
      return list;
    };

    const countUnvisitedNeighbors = (idx) => getNeighbors(idx).length;

    const paths = [];
    let steps = 0;
    const maxSteps = 25000;

    const buildPath = (wordIdx, currentPath, targetLen) => {
      if (++steps > maxSteps) return false;

      if (currentPath.length === targetLen) {
        paths.push([...currentPath]);
        if (wordIdx + 1 === wordLengths.length) {
          return true;
        }
        if (startNextWord(wordIdx + 1)) {
          return true;
        }
        paths.pop();
        return false;
      }

      const tail = currentPath[currentPath.length - 1];
      const neighbors = this.shuffle(getNeighbors(tail)).sort(
        (a, b) => countUnvisitedNeighbors(a) - countUnvisitedNeighbors(b)
      );

      for (const next of neighbors) {
        visited[next] = true;
        currentPath.push(next);

        if (buildPath(wordIdx, currentPath, targetLen)) {
          return true;
        }

        currentPath.pop();
        visited[next] = false;
      }
      return false;
    };

    const startNextWord = (wordIdx) => {
      if (steps > maxSteps) return false;
      // Pick an unvisited cell with minimum degree (Warnsdorff heuristic) to avoid isolated dead-ends
      const candidates = [];
      for (let i = 0; i < total; i++) {
        if (!visited[i]) {
          candidates.push({ idx: i, deg: countUnvisitedNeighbors(i) });
        }
      }
      if (candidates.length === 0) return false;
      candidates.sort((a, b) => a.deg - b.deg);
      const minDeg = candidates[0].deg;
      const topCandidates = this.shuffle(
        candidates.filter((c) => c.deg <= minDeg + 1)
      ).slice(0, 4);

      const targetLen = wordLengths[wordIdx];
      for (const cand of topCandidates) {
        visited[cand.idx] = true;
        if (buildPath(wordIdx, [cand.idx], targetLen)) {
          return true;
        }
        visited[cand.idx] = false;
      }
      return false;
    };

    if (startNextWord(0)) {
      return paths;
    }
    return null;
  },

  generate(templateKey = "5x5-full", lang = "pt") {
    const tpl =
      this.templates[templateKey] || this.templates["5x5-full"];
    const { gridRows, gridCols, holes, dynamicMaze, wordLengthOptions } = tpl;
    const totalCells = gridRows * gridCols;
    const wordBank = lang === "en" ? EN_WORD_BANK : PT_WORD_BANK;

    for (let attempt = 0; attempt < 50; attempt++) {
      const wordLengths =
        wordLengthOptions[Math.floor(Math.random() * wordLengthOptions.length)];
      const sumLetters = wordLengths.reduce((acc, v) => acc + v, 0);
      const numObstacles = Math.max(0, totalCells - sumLetters);

      const holesSet = dynamicMaze
        ? this.generateMazeObstacles(
            gridRows,
            gridCols,
            numObstacles,
            wordLengths.length
          )
        : new Set(holes);

      if (!holesSet) continue;

      const paths = this.partitionGridIntoPaths(
        gridRows,
        gridCols,
        holesSet,
        wordLengths
      );
      if (!paths) continue;

      const usedWords = new Set();
      const puzzleLetters = new Array(gridRows * gridCols).fill("");
      const solutionWords = [];

      let ok = true;
      for (let i = 0; i < paths.length; i++) {
        const pathCells = paths[i];
        const len = pathCells.length;
        const pool = (wordBank[len] || []).filter((w) => !usedWords.has(w));
        if (pool.length === 0) {
          ok = false;
          break;
        }
        const chosenWord = pool[Math.floor(Math.random() * pool.length)];
        usedWords.add(chosenWord);

        // Optionally reverse path direction 50% of the time for natural variety
        const finalPath =
          Math.random() < 0.5 ? [...pathCells] : [...pathCells].reverse();

        for (let k = 0; k < finalPath.length; k++) {
          puzzleLetters[finalPath[k]] = chosenWord[k];
        }
        solutionWords.push({
          sequencingIndex: finalPath,
          word: chosenWord,
        });
      }

      if (!ok) continue;

      const randomId = Math.floor(250 + Math.random() * 749);
      const langLabel = lang === "en" ? "EN" : "PT";
      return {
        id: `proc-${lang}-${templateKey}-${randomId}`,
        puzzleId: randomId,
        lang,
        title: `${lang === "en" ? "Procedural" : "Português"} #${randomId} (${gridRows}×${gridCols} Labirinto)`,
        edition: `#${randomId}-${langLabel}`,
        gridRows,
        gridCols,
        puzzleLetters,
        solutionWords,
        presets: [],
      };
    }

    return lang === "en" ? PRESET_PUZZLES[3] : PRESET_PUZZLES[0];
  },
};

/* ==========================================================================
   Interactive Wend Browser Controller (WendApp)
   ========================================================================== */

class WendApp {
  constructor() {
    this.lang = "pt";
    this.currentPuzzle = PRESET_PUZZLES[0];
    this.guesses = [];
    this.undoStack = [];
    this.wordInsertionOrder = [];

    // Active drag state
    this.isDragging = false;
    this.activeWordIdx = null;
    this.pendingStartCell = null;
    this.activePath = [];
    this.suppressNextClick = false;

    // Hint & status state
    this.hintBannerText = null;
    this.highlightedHintCells = new Set();
    this.hintProtectedLengths = new Map(); // startCellIdx -> minLength protected by hint
    this.hasWon = false;

    // Timer
    this.elapsedSeconds = 0;
    this.timerInterval = null;

    this.initDOM();
    this.loadPuzzle(PRESET_PUZZLES[0]);
  }

  initDOM() {
    this.boardWrapper = document.getElementById("wend-board-wrapper");
    this.gridEl = document.getElementById("wend-grid");
    this.statusBarEl = document.getElementById("wend-status-bar");
    this.wordListEl = document.getElementById("wend-word-list");
    this.goalBannerEl = document.getElementById("goal-banner");
    this.editionBadgeEl = document.getElementById("edition-badge");
    this.timerEl = document.getElementById("timer-display");

    this.puzzleSelectEl = document.getElementById("puzzle-select");
    this.btnNewRandom = document.getElementById("btn-new-random");
    this.btnUndo = document.getElementById("btn-undo");
    this.btnHint = document.getElementById("btn-hint");
    this.btnClear = document.getElementById("btn-clear");
    this.btnTheme = document.getElementById("btn-theme");
    this.btnLangPt = document.getElementById("btn-lang-pt");
    this.btnLangEn = document.getElementById("btn-lang-en");

    this.winBannerEl = document.getElementById("win-banner");
    this.winTitleEl = document.getElementById("win-title");
    this.winStatsEl = document.getElementById("win-stats");
    this.winPillsEl = document.getElementById("win-word-pills");
    this.btnWinNext = document.getElementById("btn-win-next");
    this.howToPlayEl = document.getElementById("how-to-play-text");

    if (!this.gridEl) return;

    this.btnLangPt.addEventListener("click", () => this.setLanguage("pt"));
    this.btnLangEn.addEventListener("click", () => this.setLanguage("en"));

    this.puzzleSelectEl.addEventListener("change", () => {
      const val = this.puzzleSelectEl.value;
      const preset = PRESET_PUZZLES.find((p) => p.id === val);
      if (preset) {
        this.lang = preset.lang || this.lang;
        this.syncLanguageButtons();
        this.loadPuzzle(preset);
      } else if (val.startsWith("gen-")) {
        const tplKey = val.replace("gen-", "");
        const generated = ProceduralWendGenerator.generate(tplKey, this.lang);
        this.loadPuzzle(generated);
      }
    });

    this.btnNewRandom.addEventListener("click", () => {
      const val = this.puzzleSelectEl.value;
      const tplKey = val.startsWith("gen-")
        ? val.replace("gen-", "")
        : "5x5-full";
      const generated = ProceduralWendGenerator.generate(tplKey, this.lang);
      this.loadPuzzle(generated);
    });

    this.btnUndo.addEventListener("click", () => this.undo());
    this.btnClear.addEventListener("click", () => this.clearBoard());
    this.btnHint.addEventListener("click", () => this.triggerHint());
    this.btnWinNext.addEventListener("click", () => {
      const generated = ProceduralWendGenerator.generate(
        "5x5-full",
        this.lang
      );
      this.loadPuzzle(generated);
    });

    this.btnTheme.addEventListener("click", () => {
      document.body.classList.toggle("theme-dark");
    });

    window.addEventListener("mouseup", () => this.handlePointerUp());
    window.addEventListener("touchend", () => this.handlePointerUp());
  }

  setLanguage(lang) {
    if (this.lang === lang) return;
    this.lang = lang;
    this.syncLanguageButtons();

    // Load a matching puzzle in the selected language
    const val = this.puzzleSelectEl.value;
    if (val.startsWith("gen-")) {
      const tplKey = val.replace("gen-", "");
      this.loadPuzzle(ProceduralWendGenerator.generate(tplKey, this.lang));
    } else if (lang === "en") {
      this.puzzleSelectEl.value = "live-142-en";
      this.loadPuzzle(PRESET_PUZZLES[3]);
    } else {
      this.puzzleSelectEl.value = "pt-201";
      this.loadPuzzle(PRESET_PUZZLES[0]);
    }
  }

  syncLanguageButtons() {
    if (!this.btnLangPt || !this.btnLangEn) return;
    this.btnLangPt.classList.toggle("active", this.lang === "pt");
    this.btnLangEn.classList.toggle("active", this.lang === "en");

    const strings = I18N[this.lang];
    this.btnUndo.textContent = strings.btnUndo;
    this.btnHint.textContent = strings.btnHint;
    this.btnClear.textContent = strings.btnClear;
    this.btnNewRandom.textContent = strings.btnNewRandom;
    this.winTitleEl.textContent = strings.winTitle;
    this.btnWinNext.textContent = strings.nextPuzzle;
    this.howToPlayEl.textContent = strings.howToPlay;
  }

  loadPuzzle(puzzle) {
    this.currentPuzzle = puzzle;
    this.guesses = [];
    this.undoStack = [];
    this.wordInsertionOrder = [];
    this.isDragging = false;
    this.activeWordIdx = null;
    this.pendingStartCell = null;
    this.activePath = [];
    this.hintBannerText = null;
    this.highlightedHintCells = new Set();
    this.hintProtectedLengths = new Map();
    this.hasWon = false;

    this.holeEdgeMasks = computeHoleEdgeMasks(
      puzzle.puzzleLetters,
      puzzle.gridRows,
      puzzle.gridCols
    );

    if (this.editionBadgeEl) {
      this.editionBadgeEl.textContent = puzzle.edition || `#${puzzle.puzzleId}`;
    }

    this.boardWrapper.style.setProperty("--grid-rows", puzzle.gridRows);
    this.boardWrapper.style.setProperty("--grid-cols", puzzle.gridCols);

    this.syncLanguageButtons();
    this.renderGoalBanner();
    this.startTimer();
    this.buildGridCells();
    this.render();
  }

  renderGoalBanner() {
    if (!this.goalBannerEl) return;
    const strings = I18N[this.lang];
    const lengths = this.currentPuzzle.solutionWords.map(
      (s) => s.sequencingIndex.length
    );
    const count = lengths.length;
    const allEqual = lengths.every((l) => l === lengths[0]);
    const sortedLengths = [...lengths].sort((a, b) => a - b);

    const line1 = allEqual
      ? strings.findWordsEqual(count, lengths[0])
      : strings.findWordsVaried(count, sortedLengths);

    this.goalBannerEl.innerHTML = `
      <ul>
        <li>${line1}</li>
        <li>${strings.everyTileUsed}</li>
      </ul>
    `;
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.elapsedSeconds = 0;
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      if (!this.hasWon) {
        this.elapsedSeconds++;
        this.updateTimerDisplay();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    if (!this.timerEl) return;
    const mins = Math.floor(this.elapsedSeconds / 60);
    const secs = this.elapsedSeconds % 60;
    this.timerEl.textContent = `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  buildGridCells() {
    this.gridEl.innerHTML = "";
    const { gridRows, gridCols, puzzleLetters } = this.currentPuzzle;
    const total = gridRows * gridCols;

    for (let idx = 0; idx < total; idx++) {
      const r = Math.floor(idx / gridCols);
      const c = idx % gridCols;
      const letter = puzzleLetters[idx] ?? "";
      const isHole = isHoleCell(letter);

      const cellEl = document.createElement("div");
      cellEl.className = "wend-cell";
      if (c === gridCols - 1) cellEl.classList.add("is-last-col");
      if (r === gridRows - 1) cellEl.classList.add("is-last-row");
      cellEl.dataset.cellIdx = String(idx);

      if (isHole) {
        cellEl.classList.add("is-hole");
        const mask = this.holeEdgeMasks[idx] || 0;
        if (mask & 1) cellEl.classList.add("hole-edge-top");
        if (mask & 2) cellEl.classList.add("hole-edge-right");
        if (mask & 4) cellEl.classList.add("hole-edge-bottom");
        if (mask & 8) cellEl.classList.add("hole-edge-left");
      } else {
        cellEl.tabIndex = idx === 0 ? 0 : -1;

        cellEl.addEventListener("mousedown", (e) => {
          if (e.button !== 0) return;
          e.preventDefault();
          this.handlePointerDown(idx);
        });
        cellEl.addEventListener("mouseenter", () => {
          this.handlePointerMove(idx);
        });
        cellEl.addEventListener("click", () => {
          this.handleCellClick(idx);
        });

        cellEl.addEventListener(
          "touchstart",
          (e) => {
            e.preventDefault();
            this.handlePointerDown(idx);
          },
          { passive: false }
        );
        cellEl.addEventListener(
          "touchmove",
          (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            if (!touch) return;
            const target = document.elementFromPoint(
              touch.clientX,
              touch.clientY
            );
            const cell = target ? target.closest(".wend-cell") : null;
            if (cell && cell.dataset.cellIdx !== undefined) {
              this.handlePointerMove(Number(cell.dataset.cellIdx));
            }
          },
          { passive: false }
        );
      }

      this.gridEl.appendChild(cellEl);
    }
  }

  findCellOwner(cellIdx) {
    for (let wIdx = 0; wIdx < this.guesses.length; wIdx++) {
      const pos = this.guesses[wIdx].sequencingIndex.indexOf(cellIdx);
      if (pos !== -1) {
        return { wordIdx: wIdx, positionInWord: pos };
      }
    }
    return null;
  }

  recordStartCellColorOrder(guesses) {
    for (const g of guesses) {
      const start = g.sequencingIndex[0];
      if (
        start !== undefined &&
        !this.wordInsertionOrder.includes(start)
      ) {
        this.wordInsertionOrder.push(start);
      }
    }
  }

  pushUndoSnapshot(snapshot) {
    const clone = snapshot.map((g) => ({
      sequencingIndex: [...g.sequencingIndex],
    }));
    this.undoStack.push(clone);
  }

  areGuessesEqual(a, b) {
    if (!a || !b || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      const seqA = a[i].sequencingIndex;
      const seqB = b[i].sequencingIndex;
      if (seqA.length !== seqB.length) return false;
      for (let j = 0; j < seqA.length; j++) {
        if (seqA[j] !== seqB[j]) return false;
      }
    }
    return true;
  }

  handlePointerDown(cellIdx) {
    if (this.hasWon) return;
    const { puzzleLetters, solutionWords } = this.currentPuzzle;
    if (isHoleCell(puzzleLetters[cellIdx])) return;

    this.hintBannerText = null;
    this.highlightedHintCells.clear();

    const lockedSet = getLockedWordIndices(this.guesses, solutionWords);
    const owner = this.findCellOwner(cellIdx);

    if (owner && lockedSet.has(owner.wordIdx)) {
      return;
    }

    this.preDragSnapshot = this.guesses.map((g) => ({
      sequencingIndex: [...g.sequencingIndex],
    }));
    this.didAdvanceDuringDrag = false;
    this.isDragging = true;

    if (owner) {
      // Continuing or trimming the existing incomplete trail
      this.startedNewTrailOnDown = false;
      const word = this.guesses[owner.wordIdx];
      const startCell = word.sequencingIndex[0];
      const minLen = this.hintProtectedLengths.get(startCell) || 0;
      const cutLen = Math.max(owner.positionInWord + 1, minLen);
      const sliced = word.sequencingIndex.slice(0, cutLen);

      const keptGuesses = this.guesses.filter((_, idx) => lockedSet.has(idx));
      keptGuesses.push({ sequencingIndex: sliced });
      this.guesses = keptGuesses;
      this.activeWordIdx = this.guesses.length - 1;
      this.activePath = [...sliced];
      this.pendingStartCell = null;
    } else {
      // Starting on a new cell: remove any existing incomplete (unlocked) trail
      // so only one incomplete trail exists on the board at a time.
      this.startedNewTrailOnDown = true;
      this.hintProtectedLengths.clear();
      const lockedGuesses = this.guesses.filter((_, idx) => lockedSet.has(idx));
      lockedGuesses.push({ sequencingIndex: [cellIdx] });
      this.guesses = lockedGuesses;
      this.activeWordIdx = this.guesses.length - 1;
      this.activePath = [cellIdx];
      this.pendingStartCell = null;
      if (!this.wordInsertionOrder.includes(cellIdx)) {
        this.wordInsertionOrder.push(cellIdx);
      }
    }

    this.render();
  }

  handlePointerMove(cellIdx) {
    if (!this.isDragging || this.hasWon) return;
    const { puzzleLetters, gridCols } = this.currentPuzzle;
    if (isHoleCell(puzzleLetters[cellIdx])) return;

    if (this.activeWordIdx === null) return;
    const path = this.activePath;
    const tail = path[path.length - 1];
    if (cellIdx === tail) return;

    // Step backward along activePath
    if (path.length >= 2 && cellIdx === path[path.length - 2]) {
      const startCell = path[0];
      const minLen = this.hintProtectedLengths.get(startCell) || 0;
      if (path.length - 1 < minLen) return;

      this.didAdvanceDuringDrag = true;
      const shorter = path.slice(0, -1);
      this.activePath = shorter;
      this.guesses[this.activeWordIdx] = { sequencingIndex: [...shorter] };
      this.render();
      return;
    }

    if (!areOrthogonallyAdjacent(tail, cellIdx, gridCols)) return;

    // Standard extension into an unoccupied cell
    if (!path.includes(cellIdx) && this.findCellOwner(cellIdx) === null) {
      this.didAdvanceDuringDrag = true;
      const extended = [...path, cellIdx];
      this.activePath = extended;
      this.guesses[this.activeWordIdx] = { sequencingIndex: [...extended] };
      this.render();
    }
  }

  handlePointerUp() {
    if (!this.isDragging) return;
    this.isDragging = false;

    if (this.didAdvanceDuringDrag || this.startedNewTrailOnDown) {
      this.suppressNextClick = true;
      if (
        this.preDragSnapshot &&
        !this.areGuessesEqual(this.preDragSnapshot, this.guesses)
      ) {
        this.pushUndoSnapshot(this.preDragSnapshot);
      }
    } else if (
      this.preDragSnapshot &&
      !this.areGuessesEqual(this.preDragSnapshot, this.guesses)
    ) {
      // Trimmed an interior cell of the incomplete trail via click
      this.suppressNextClick = true;
      this.pushUndoSnapshot(this.preDragSnapshot);
    }

    this.activeWordIdx = null;
    this.pendingStartCell = null;
    this.activePath = [];
    this.startedNewTrailOnDown = false;
    this.render();
  }

  handleCellClick(cellIdx) {
    if (this.suppressNextClick) {
      this.suppressNextClick = false;
      this.preDragSnapshot = null;
      return;
    }
    if (this.hasWon) return;

    const { solutionWords } = this.currentPuzzle;
    const lockedSet = getLockedWordIndices(this.guesses, solutionWords);
    const owner = this.findCellOwner(cellIdx);
    if (!owner || lockedSet.has(owner.wordIdx)) {
      this.preDragSnapshot = null;
      return;
    }

    const word = this.guesses[owner.wordIdx];
    const startCell = word.sequencingIndex[0];
    const minLen = this.hintProtectedLengths.get(startCell) || 0;

    // Clicking start cell (pos 0) of an existing incomplete trail deletes it
    if (owner.positionInWord === 0 && minLen === 0) {
      if (this.preDragSnapshot) {
        this.pushUndoSnapshot(this.preDragSnapshot);
      }
      this.guesses.splice(owner.wordIdx, 1);
      this.preDragSnapshot = null;
      this.render();
    }
    this.preDragSnapshot = null;
  }

  undo() {
    if (this.undoStack.length === 0 || this.hasWon) return;
    this.guesses = this.undoStack.pop();
    this.hintBannerText = null;
    this.highlightedHintCells.clear();
    this.render();
  }

  clearBoard() {
    if (this.guesses.length === 0 || this.hasWon) return;
    this.pushUndoSnapshot(this.guesses);
    this.guesses = [];
    this.hintBannerText = null;
    this.highlightedHintCells.clear();
    this.hintProtectedLengths.clear();
    this.render();
  }

  triggerHint() {
    if (this.hasWon) return;
    const { solutionWords } = this.currentPuzzle;
    const hint = WendHintEngine.applyHint(this.guesses, solutionWords);
    if (!hint) return;

    this.pushUndoSnapshot(this.guesses);
    this.guesses = hint.nextGuesses.map((g) => ({
      sequencingIndex: [...g.sequencingIndex],
    }));
    this.recordStartCellColorOrder(this.guesses);

    // Protect revealed letters from accidental deletion
    if (
      hint.type === WendHintType.EXTEND_PARTIAL ||
      hint.type === WendHintType.REVEAL_FIRST_LETTER
    ) {
      const startCell = hint.highlightedCells[0];
      if (startCell !== undefined) {
        this.hintProtectedLengths.set(startCell, hint.highlightedCells.length);
      }
    }

    const strings = I18N[this.lang];
    const typeToText = {
      [WendHintType.TRIM_INCORRECT]: strings.hintTrimIncorrect,
      [WendHintType.REMOVE_INCORRECT]: strings.hintRemoveIncorrect,
      [WendHintType.EXTEND_PARTIAL]: strings.hintExtendPartial,
      [WendHintType.REVEAL_FIRST_LETTER]: strings.hintRevealFirstLetter,
    };
    const baseMsg = typeToText[hint.type] || "";
    this.hintBannerText = hint.correctionApplied
      ? strings.hintCorrectionPrefix(baseMsg)
      : baseMsg;
    this.highlightedHintCells = new Set(hint.highlightedCells || []);

    this.render();
  }

  render() {
    if (!this.gridEl) return;
    const {
      puzzleId,
      gridRows,
      gridCols,
      puzzleLetters,
      solutionWords,
      presets,
    } = this.currentPuzzle;

    const colorContext = createColorContext(puzzleId, this.wordInsertionOrder);
    const lockedSet = getLockedWordIndices(this.guesses, solutionWords);
    const solvedNow = isBoardSolved(this.guesses, solutionWords);

    if (solvedNow && !this.hasWon) {
      this.hasWon = true;
      this.hintBannerText = null;
      this.highlightedHintCells.clear();
    }

    // Update buttons
    this.btnUndo.disabled = this.undoStack.length === 0 || this.hasWon;
    this.btnClear.disabled = this.guesses.length === 0 || this.hasWon;
    this.btnHint.disabled = this.hasWon;

    // 1. Render cells on the grid
    const cellEls = this.gridEl.querySelectorAll(".wend-cell");
    cellEls.forEach((cellEl) => {
      const idx = Number(cellEl.dataset.cellIdx);
      const letter = puzzleLetters[idx] ?? "";
      if (isHoleCell(letter)) return;

      const owner = this.findCellOwner(idx);
      const isPendingStart = this.pendingStartCell === idx && !owner;
      const isSelected = Boolean(owner || isPendingStart);
      const isLocked = Boolean(owner && lockedSet.has(owner.wordIdx));
      const isDraggingActive = Boolean(
        isPendingStart ||
          (this.activeWordIdx !== null &&
            owner &&
            owner.wordIdx === this.activeWordIdx)
      );

      cellEl.classList.toggle("is-selected", isSelected);
      cellEl.classList.toggle("is-locked", isLocked);
      cellEl.classList.toggle("is-dragging-active", isDraggingActive);
      cellEl.classList.toggle(
        "is-hint-highlighted",
        this.highlightedHintCells.has(idx)
      );

      let wordColor = null;
      let fromDir = null;
      let toDir = null;
      let posInWord = null;

      if (owner) {
        const seq = this.guesses[owner.wordIdx].sequencingIndex;
        posInWord = owner.positionInWord;
        wordColor = getWordColor(colorContext, seq[0]);
        if (posInWord > 0) {
          fromDir = getDirection(seq[posInWord - 1], idx, gridCols);
        }
        if (posInWord < seq.length - 1) {
          toDir = getDirection(idx, seq[posInWord + 1], gridCols);
        }
      } else if (isPendingStart) {
        posInWord = 0;
        wordColor = getWordColor(colorContext, idx);
      }

      if (wordColor) {
        cellEl.style.setProperty("--word-color", wordColor);
      } else {
        cellEl.style.removeProperty("--word-color");
      }

      cellEl.innerHTML = this.buildCellInnerHTML({
        letter,
        isSelected,
        isLocked,
        posInWord,
        fromDir,
        toDir,
      });
    });

    // 2. Render Status Bar (Hint message, Filled-but-unsolved warning, or Current Word blocks)
    this.renderStatusBar(colorContext);

    // 3. Render Word List Slots
    this.renderWordList(colorContext, lockedSet, presets);

    // 4. Render Win Banner
    if (this.hasWon) {
      const strings = I18N[this.lang];
      this.winBannerEl.classList.remove("hidden");
      this.winStatsEl.textContent = strings.winStats(
        this.currentPuzzle.title,
        this.timerEl.textContent,
        solutionWords.length
      );
      this.winPillsEl.innerHTML = this.guesses
        .map((g) => {
          const w = getWordString(g, puzzleLetters);
          const col = getWordColor(colorContext, g.sequencingIndex[0]);
          return `<span class="word-pill" style="background:${col}">${w}</span>`;
        })
        .join("");
    } else {
      this.winBannerEl.classList.add("hidden");
    }
  }

  buildCellInnerHTML({
    letter,
    isSelected,
    isLocked,
    posInWord,
    fromDir,
    toDir,
  }) {
    if (!isSelected) {
      return `<span class="wend-letter">${letter}</span>`;
    }

    const edgeCoords = {
      RIGHT: [100, 50],
      LEFT: [0, 50],
      DOWN: [50, 100],
      UP: [50, 0],
    };
    const entryCoords = {
      RIGHT: [0, 50],
      LEFT: [100, 50],
      DOWN: [50, 0],
      UP: [50, 100],
    };

    let d = "";
    if (fromDir && toDir) {
      const [x1, y1] = entryCoords[fromDir];
      const [x2, y2] = edgeCoords[toDir];
      d = `M ${x1},${y1} L 50,50 L ${x2},${y2}`;
    } else if (!fromDir && toDir) {
      const [x2, y2] = edgeCoords[toDir];
      d = `M 50,50 L ${x2},${y2}`;
    } else if (fromDir && !toDir) {
      const [x1, y1] = entryCoords[fromDir];
      d = `M ${x1},${y1} L 50,50`;
    }

    const isStartCell = posInWord === 0;
    const startCircles = isStartCell
      ? `<circle cx="50" cy="50" r="32" class="wend-start-outer" />
         <circle cx="50" cy="50" r="26" class="wend-start-inner" />`
      : `<circle cx="50" cy="50" r="28" class="wend-start-inner" />`;

    const chevronMap = {
      RIGHT: "›",
      LEFT: "‹",
      DOWN: "⌄",
      UP: "⌃",
    };
    const chevronHTML = fromDir
      ? `<span class="wend-chevron wend-chevron--${fromDir}">${chevronMap[fromDir]}</span>`
      : "";

    const lockBadgeHTML =
      isLocked && isStartCell
        ? `<div class="wend-cell-lock-badge" title="Correct Word Locked">✓</div>`
        : "";

    return `
      <div class="wend-cell-tint"></div>
      <svg class="wend-cell-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        ${d ? `<path d="${d}" class="wend-path-line" />` : ""}
        ${startCircles}
      </svg>
      <span class="wend-letter">${letter}</span>
      ${chevronHTML}
      ${lockBadgeHTML}
    `;
  }

  renderStatusBar(colorContext) {
    if (!this.statusBarEl) return;
    const { puzzleLetters, solutionWords } = this.currentPuzzle;
    const strings = I18N[this.lang];

    if (this.hintBannerText && !this.hasWon) {
      this.statusBarEl.innerHTML = `
        <div class="wend-board-message">
          <span>💡 ${this.hintBannerText}</span>
        </div>
      `;
      return;
    }

    if (
      !this.isDragging &&
      isBoardFilledButUnsolved(this.guesses, solutionWords)
    ) {
      this.statusBarEl.innerHTML = `
        <div class="wend-board-message is-warning">
          <span>${strings.filledButUnsolved}</span>
          <button type="button" class="btn btn-primary" id="btn-inline-hint">${strings.useHint}</button>
        </div>
      `;
      const btnInline = document.getElementById("btn-inline-hint");
      if (btnInline) {
        btnInline.addEventListener("click", () => this.triggerHint());
      }
      return;
    }

    // Current word letter blocks (matches a6 in C7ZU1-qQ.js)
    let wordStr = "";
    let startCell = null;
    if (!this.hasWon) {
      if (this.activeWordIdx !== null && this.guesses[this.activeWordIdx]) {
        const g = this.guesses[this.activeWordIdx];
        wordStr = getWordString(g, puzzleLetters);
        startCell = g.sequencingIndex[0];
      } else if (this.pendingStartCell !== null) {
        wordStr = puzzleLetters[this.pendingStartCell] ?? "";
        startCell = this.pendingStartCell;
      } else if (this.guesses.length > 0) {
        const last = this.guesses[this.guesses.length - 1];
        wordStr = getWordString(last, puzzleLetters);
        startCell = last.sequencingIndex[0];
      }
    }

    if (!wordStr) {
      this.statusBarEl.innerHTML = "";
      return;
    }

    const col = getWordColor(colorContext, startCell);
    this.statusBarEl.innerHTML = `
      <div class="wend-current-word-blocks" style="--block-color: ${col}">
        ${Array.from(wordStr)
          .map((ch) => `<div class="wend-current-block">${ch}</div>`)
          .join("")}
      </div>
    `;
  }

  renderWordList(colorContext, lockedSet, presets) {
    if (!this.wordListEl) return;
    const { puzzleLetters, solutionWords } = this.currentPuzzle;

    const rows = buildWordListRows({
      guesses: this.guesses,
      solutionWords,
      puzzleLetters,
      activeWordIdx: this.activeWordIdx,
      lockedWordIndices: lockedSet,
      presets,
    });

    this.wordListEl.innerHTML = rows
      .map((row) => {
        const isLocked =
          row.wordIdx !== null && lockedSet.has(row.wordIdx);
        const startCell =
          row.wordIdx !== null
            ? this.guesses[row.wordIdx]?.sequencingIndex[0]
            : null;
        const rowColor =
          startCell !== null && startCell !== undefined
            ? getWordColor(colorContext, startCell)
            : "#64748b";

        const totalSlots = Math.max(row.capacity, row.letters.length);
        const slotsHTML = Array.from({ length: totalSlots }, (_, sIdx) => {
          const ch = row.letters[sIdx] ?? "";
          const isOverflow = row.isExtraRow || sIdx >= row.capacity;
          const isPresetNeutral =
            row.presetLetterIndices.has(sIdx) && row.wordIdx === null;
          const isFilled = ch !== "" && !isPresetNeutral;

          const classes = ["wend-slot"];
          if (isFilled) classes.push("is-filled");
          if (isPresetNeutral) classes.push("is-preset-neutral");
          if (isOverflow) classes.push("is-overflow");

          return `<div class="${classes.join(" ")}" style="--row-color: ${rowColor}">${ch}</div>`;
        }).join("");

        const checkHTML = isLocked
          ? `<span class="wend-row-check" title="Palavra Correta">✓</span>`
          : "";

        return `
          <div class="wend-word-row">
            <div class="wend-word-slots">${slotsHTML}</div>
            ${checkHTML}
          </div>
        `;
      })
      .join("");
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    WendHintType,
    PT_WORD_BANK,
    EN_WORD_BANK,
    PRESET_PUZZLES,
    isHoleCell,
    areOrthogonallyAdjacent,
    computeHoleEdgeMasks,
    createColorContext,
    getWordColor,
    getWordString,
    isExactSolutionWord,
    getLockedWordIndices,
    isBoardSolved,
    isBoardFilledButUnsolved,
    findMergeCandidate,
    buildWordListRows,
    WendHintEngine,
    ProceduralWendGenerator,
  };
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    window.wendApp = new WendApp();
  });
}
