import { Persona, FaqItem, ProductModel } from './types';

export const personasData: Persona[] = [
  {
    role: "Líder Tecnológico & Developer",
    tagline: "Desempenho Sem Compromissos",
    frustration: "Desempenho reduzido e aquecimento ao compilar modelos pesados ou multitarefa intensiva em mobilidade.",
    outcome: "Velocidade M5/A19 Pro instantânea, resposta ultrarrápida e arquitetura preparada para IA generativa.",
    badge: "Power Users",
    recommendedDevice: "iPhone 18 Pro & Mac M5 Max"
  },
  {
    role: "Criador de Conteúdo & Cineasta",
    tagline: "Estúdio de Cinema de Bolso",
    frustration: "Necessidade de carregar equipamento fotográfico pesado e tempos lentos de transferência de ficheiros RAW.",
    outcome: "Gravação ProRes 8K com controlo de cor profissional e sincronização instantânea no ecossistema Mac.",
    badge: "Criativos",
    recommendedDevice: "iPhone 18 Pro & Mac Studio M5"
  },
  {
    role: "Atleta & Profissional de Saúde",
    tagline: "Telemetria e Precisão Absoluta",
    frustration: "Falta de rigor científico em métricas de saúde cardíaca e ansiedade por baterias de curta duração.",
    outcome: "Monitorização cardíaca de precisão clínica e autonomia para superar os registos mais exigentes.",
    badge: "Performance",
    recommendedDevice: "Apple Watch Series 12 & Ultra 4"
  }
];

export const faqsData: FaqItem[] = [
  {
    q: "Quando é que os novos dispositivos estarão disponíveis em Portugal?",
    a: "O iPhone 18 Pro, Apple Watch Series 12 e AirPods 5 estarão disponíveis nas lojas e para entrega a partir de 18 de setembro de 2026. As reservas do iPhone Duo começam a 16 de outubro às 13h, com disponibilidade a 23 de outubro.",
    category: "Disponibilidade"
  },
  {
    q: "Como funciona o processo de reserva (Pre-Order)?",
    a: "Pode reservar diretamente no nosso site ou na App Apple Store. A reserva garante a atribuição prioritária do dispositivo no dia de lançamento oficial, com opção de entrega ao domicílio ou levantamento na loja.",
    category: "Reservas"
  },
  {
    q: "Posso dar o meu dispositivo antigo em retoma (Apple Trade In)?",
    a: "Sim. Através do Apple Trade In, pode trocar o seu dispositivo atual por um crédito imediato na compra do novo modelo. O processo pode ser feito online ou numa Apple Store.",
    category: "Trade In"
  },
  {
    q: "Como funciona a oferta da Campanha de Educação (Back to School)?",
    a: "Estudantes universitários, pais e professores qualificados recebem um cartão-oferta Apple no valor de 80 € a 120 € na compra de um Mac ou iPad selecionado, além do desconto habitual de educação.",
    category: "Educação"
  },
  {
    q: "Qual é a base científica da monitorização cardíaca do Apple Watch Series 12?",
    a: "A precisão do sensor cardíaco foi validada em estudos clínicos independentes (realizados em julho/agosto de 2026) demonstrando a maior correlação com eletrocardiogramas de grau médico alguma vez registada num wearable comercial.",
    category: "Saúde"
  },
  {
    q: "O iPhone Duo é compatível com todas as aplicações em ecrã duplo?",
    a: "Sim. O iOS inclui multitasking adaptativo nativo que permite executar duas aplicações em simultâneo lado a lado, ou expandir uma única app para uma experiência imersiva de ecrã total.",
    category: "Inovação"
  },
  {
    q: "Qual é a autonomia da bateria do Apple Watch Ultra 4?",
    a: "O Apple Watch Ultra 4 oferece até 36 horas de autonomia em utilização normal e até 72 horas no modo de Pouca Potência otimizado para expedições prolongadas.",
    category: "Bateria"
  },
  {
    q: "É possível obter assistência telefónica ou apoio à compra corporativa?",
    a: "Sim. A nossa equipa de especialistas em Portugal está disponível através do número gratuito 800 207 758 para apoio a compras pessoais ou soluções empresariais.",
    category: "Apoio"
  },
  {
    q: "Quais são as opções de pagamento e financiamento disponível?",
    a: "Oferecemos modalidades de pagamento em mensalidades sem juros com parceiros financeiros selecionados, além de pagamentos por MB WAY, Cartão de Crédito e Apple Pay.",
    category: "Pagamentos"
  },
  {
    q: "Qual é a garantia e a política de devolução dos produtos?",
    a: "Todos os produtos comercializados na União Europeia dispõem de 3 anos de garantia legal. Dispõe ainda de um prazo de 14 dias após a receção para devolução sem custos.",
    category: "Garantia"
  }
];

export const productsData: ProductModel[] = [
  {
    id: "iphone-18-pro",
    name: "iPhone 18 Pro",
    subtitle: "Titânio Burgundy Deep & Chip A19 Pro",
    tagline: "Um Pro muito à frente. Engenharia Sem Limites.",
    priceStartingAt: 1349,
    monthlyFrom: 44.95,
    releaseDate: "18 de Setembro de 2026",
    badge: "Destaque Flagship",
    category: "iphone",
    colors: [
      { name: "Burgundy Deep", hex: "#4a1224", ringColor: "ring-rose-900" },
      { name: "Titânio Preto", hex: "#1c1c1e", ringColor: "ring-slate-800" },
      { name: "Titânio Natural", hex: "#9a968f", ringColor: "ring-slate-400" },
      { name: "Titânio Branco", hex: "#e5e5ea", ringColor: "ring-slate-200" }
    ],
    storageOptions: [
      { size: "256 GB", extraPrice: 0 },
      { size: "512 GB", extraPrice: 240 },
      { size: "1 TB", extraPrice: 480 }
    ],
    specs: [
      "Chip A19 Pro com arquitetura 2nm e motor neural de 24 núcleos",
      "Sistema de câmaras Pro de 48 MP triplo com zoom ótico 7x",
      "Gravação de vídeo ProRes 8K com controlo de cor cinematográfico",
      "Bateria com até +5 horas de autonomia diária em uso real"
    ]
  },
  {
    id: "iphone-duo",
    name: "iPhone Duo",
    subtitle: "Ecrã Dobrável Duplo Dinâmico",
    tagline: "Produtividade dobrável e multitarefa contínua.",
    priceStartingAt: 1899,
    monthlyFrom: 63.30,
    releaseDate: "23 de Outubro (Reservas a 16/10)",
    badge: "Novo Formato 2026",
    category: "iphone",
    colors: [
      { name: "Meia-Noite Espacial", hex: "#181b22", ringColor: "ring-indigo-950" },
      { name: "Prata Nebular", hex: "#d8dce2", ringColor: "ring-slate-300" }
    ],
    storageOptions: [
      { size: "512 GB", extraPrice: 0 },
      { size: "1 TB", extraPrice: 260 }
    ],
    specs: [
      "Ecrã Super Retina XDR dobrável sem vinco aparente",
      "Multitarefa adaptativa com arrastar e largar simultâneo",
      "Estrutura reforçada em titânio e vidro cerâmico ultra-resistente",
      "Compatibilidade completa com Apple Pencil Pro"
    ]
  },
  {
    id: "watch-series-12",
    name: "Apple Watch Series 12",
    subtitle: "Precisão Cardíaca Científica",
    tagline: "Monitorização cardíaca clínica com rigor médico no pulso.",
    priceStartingAt: 459,
    monthlyFrom: 15.30,
    releaseDate: "18 de Setembro de 2026",
    badge: "Validado Clinicamente",
    category: "watch",
    colors: [
      { name: "Alumínio Meia-Noite", hex: "#1f242d", ringColor: "ring-slate-800" },
      { name: "Estelar", hex: "#e7dfd5", ringColor: "ring-amber-200" },
      { name: "Titânio Polido", hex: "#888c94", ringColor: "ring-slate-400" }
    ],
    storageOptions: [
      { size: "GPS 41mm", extraPrice: 0 },
      { size: "GPS + Celular 45mm", extraPrice: 80 }
    ],
    specs: [
      "Sensor biométrico de ECG com correlação médica 99.4%",
      "Novo sensor contínuo de temperatura basal e hidratação",
      "Ecrã de 3000 nits visível sob a luz solar mais intensa",
      "Carregamento ultra-rápido: 0 a 80% em apenas 30 minutos"
    ]
  },
  {
    id: "macbook-pro-m5",
    name: "MacBook Pro M5",
    subtitle: "Poder Absoluto Apple Silicon",
    tagline: "Velocidade relâmpago para cargas pesadas com bateria para todo o dia.",
    priceStartingAt: 2049,
    monthlyFrom: 68.30,
    releaseDate: "Disponível Imediatamente",
    badge: "M5 / M5 Pro / Max",
    category: "mac",
    colors: [
      { name: "Preto Espacial", hex: "#1b1d22", ringColor: "ring-slate-900" },
      { name: "Prata Clássico", hex: "#dedfe2", ringColor: "ring-slate-300" }
    ],
    storageOptions: [
      { size: "512 GB SSD / 18 GB RAM", extraPrice: 0 },
      { size: "1 TB SSD / 36 GB RAM", extraPrice: 460 },
      { size: "2 TB SSD / 64 GB RAM", extraPrice: 920 }
    ],
    specs: [
      "Processador M5 Pro até 16 núcleos de CPU e 40 de GPU",
      "Até 22 horas de autonomia sem abrandamento desligado da tomada",
      "Ecrã Liquid Retina XDR com nanotextura antirreflexo opcional",
      "Três portas Thunderbolt 5 e leitor de cartões SDXC"
    ]
  },
  {
    id: "airpods-5",
    name: "AirPods 5",
    subtitle: "Áudio Espacial Imersivo",
    tagline: "Imersão sonora instantânea e o poder do cancelamento ativo adaptativo.",
    priceStartingAt: 199,
    monthlyFrom: 6.63,
    releaseDate: "18 de Setembro de 2026",
    badge: "Cancelamento Ativo",
    category: "airpods",
    colors: [
      { name: "Branco Puro", hex: "#ffffff", ringColor: "ring-slate-200" }
    ],
    storageOptions: [
      { size: "Com Estojo MagSafe USB-C", extraPrice: 0 },
      { size: "Com Cancelamento Ativo de Ruído (ANC)", extraPrice: 50 }
    ],
    specs: [
      "Chip H3 com equalização adaptativa em tempo real",
      "Modo Transparência Inteligente com proteção auricular avançada",
      "Áudio Espacial personalizado com seguimento dinâmico dos movimentos da cabeça",
      "Estojo com altifalante integrado e pesquisa precisa 'Encontrar'"
    ]
  }
];
