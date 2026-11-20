// Português (Brasil): idioma de origem. Os outros idiomas seguem exatamente este formato.
// Marcadores entre chaves, como {n} ou {v}, são trocados no código pela função fill().

export const pt = {
  meta: {
    lang: 'pt-BR',
    ogLocale: 'pt_BR',
    title: 'Servidor de live IRL que não deixa a live cair | StreamerKit',
    description:
      'Sua live IRL caiu de novo? O StreamerKit junta 4G, 5G e Wi-Fi numa transmissão só (SRTLA), segura a live com BRB automático, roda o OBS na nuvem e transmite para Twitch, Kick e YouTube ao mesmo tempo.',
    ogTitle: 'Sua live caiu. De novo. | StreamerKit',
    ogDescription:
      'Junte 4G, 5G e Wi-Fi numa transmissão só e mantenha a live IRL no ar. OBS na nuvem, multistream e controle remoto do celular pela sua equipe.',
  },

  // Formato dos números: separador decimal e de milhar.
  num: { decimal: ',', thousands: '.' },

  common: {
    choosePlan: 'Escolher um plano',
    signInNote: 'Você entra com a sua conta da Twitch ou da Kick.',
    fromPrice: 'Planos a partir de R$ 119,90 por mês.',
    live: 'Ao vivo',
    down: 'caiu',
    noSignal: 'sem sinal',
  },

  nav: {
    items: ['Como segura', 'Controle remoto', 'Overlays', 'Planos', 'Dúvidas'],
    login: 'Entrar',
    skip: 'Pular para o conteúdo',
    sectionsAria: 'Seções',
    homeAria: 'StreamerKit, início',
    langAria: 'Idioma',
  },

  hero: {
    kicker: 'Servidor de live IRL',
    srPrefix: 'StreamerKit, servidor de live IRL: ',
    // 3 linhas de cada título. A 2ª linha do "off" é a palavra que treme.
    off: ['Sua live', 'caiu.', 'De novo.'],
    on: ['Sua live', 'continua', 'no ar.'],
    ledeOff: {
      long: 'Show lotado, todo mundo pendurado na mesma antena, e o seu único chip não aguenta. ',
      short: 'Um chip só não aguenta show lotado. ',
      pre: 'O ',
      brand: 'StreamerKit',
      post: ' junta 4G, 5G e Wi-Fi numa transmissão só e segura a sua live no ar.',
    },
    ledeOn: {
      main: '4G, 5G e Wi-Fi somados numa transmissão só. Se uma conexão cai, as outras seguram.',
      extraPre: ' Se todas caem, a cena de BRB mantém ',
      extraStrong: 'a sua live no ar',
      extraPost: ' até você voltar.',
    },
    secondary: 'Ver funcionando',
    videoLabel: 'Vídeo de exemplo: plateia de um show filmando o palco com o celular',
    liveTag: 'AO VIVO',
    offlineTag: 'OFFLINE',
    rear: 'Traseira',
    reconnecting: 'Reconectando...',
    offline: { label: 'Conexão perdida', title: 'Live encerrada', button: 'Ligar o StreamerKit' },
    chatTitle: 'Chat da live',
    chatShort: 'Chat',
    switch: {
      on: 'StreamerKit ligado',
      off: 'StreamerKit desligado',
      onSub: '4G + 5G + Wi-Fi somados',
      offSub: 'Um chip 4G, sozinho',
      hint: 'Ligue e veja',
    },
    telemetry: { viewers: 'Viewers', bitrate: 'Bitrate', signal: 'Sinal' },
    // Mensagens do chat simulado, por fase da live.
    chat: {
      ok: ['que show!!', 'manda salve', 'tá onde?', 'olha esse palco', 'kkkkk'],
      drop: ['tá travando', 'lagou aqui', 'imagem toda quadrada', 'o bitrate tá caindo'],
      frozen: ['caiu?', 'F', 'travou', 'caiu dnv kkkk', 'volta!!', 'congelou aqui', 'F no chat'],
      offline: ['encerrou :(', 'vou pra outra live', 'avisa quando voltar'],
      on: [
        'imagem lisa demais',
        'nem parece 4G',
        'que show!!',
        'o 5G caiu e nem travou',
        'manda salve',
        'kkkkk',
        'qualidade absurda',
        'segue o baile',
        'tá onde?',
        'live boa demais',
      ],
    },
    trust: [
      ['Transmite para', 'Twitch, Kick e YouTube'],
      ['Ingests', 'Brasil, EUA e Europa'],
      ['Cobrança em real', 'Cartão ou Pix Automático'],
      ['Funciona com', 'iPhone, IRL Pro e Larix'],
    ],
  },

  pains: {
    kicker: 'O problema',
    // título em 3 pedaços: antes, destaque em vermelho, depois
    title: ['Live IRL com um chip só é ', 'live na sorte', '.'],
    lede: 'Você conhece a cena: a live está no melhor momento, o sinal oscila e pronto. Não é falta de conteúdo, é falta de estrutura.',
    resolve: 'Resolve',
    items: [
      {
        title: 'Lugar lotado derruba o sinal',
        text: 'Em show, estádio e bloco de rua, milhares de celulares disputam a mesma antena. Com uma conexão só, qualquer oscilação vira imagem quadrada na tela de quem assiste.',
        fix: 'SRTLA bonding',
      },
      {
        title: 'Caiu a conexão, acabou a live',
        text: 'Sem plano B, a transmissão encerra, o canal fica offline e quem estava assistindo vai para outra live. Voltar ao ar é começar do zero.',
        fix: 'BRB automático',
      },
      {
        title: 'Você sai do rolê para mexer no celular',
        text: 'Trocar de câmera, dar zoom, mutar o mic, acender a lanterna. Cada ajuste é você parado olhando para a tela em vez de fazer a live.',
        fix: 'Sua equipe controla de longe',
      },
      {
        title: 'PC ligado em casa, torcendo para dar certo',
        text: 'O OBS fica rodando no seu quarto enquanto você está na rua. Se a luz ou a internet de casa cair, a live cai junto e ninguém está lá para religar.',
        fix: 'OBS na nuvem',
      },
    ],
  },

  bonding: {
    kicker: 'Como o StreamerKit segura',
    // título em 2 pedaços: normal e destaque em vermelho
    title: ['Derrube uma conexão.', 'A live continua.'],
    lede: 'O SRTLA bonding soma o 4G, o 5G e o Wi-Fi do celular numa transmissão só. Teste: toque em uma conexão para desligar e veja o que chega nas plataformas.',
    dropAll: 'Derrubar todas',
    reconnect: 'Religar',
    viewerSees: 'O que o viewer vê',
    videoLabel: 'Vídeo de exemplo: o que chega para quem assiste',
    brbTitle: 'Já volto',
    brbSub: 'Cena de BRB · live no ar',
    total: 'Bitrate somado',
    countOf: '{n} de 3',
    connections: 'conexões',
    sceneLabel: 'SRTLA bonding',
    sceneLabelBrb: 'Sem sinal · BRB segurando',
    hint: 'Toque em 4G, 5G ou Wi-Fi',
    fallback: 'Celular → Ingest → OBS → Twitch, Kick e YouTube',
    ariaUp: '{l}: ligado, toque para derrubar',
    ariaDown: '{l}: caiu, toque para religar',
    nodes: {
      phone: ['Seu celular', 'App StreamerKit'],
      ingest: ['Ingest', 'Brasil, EUA ou Europa'],
      obs: ['OBS', 'No seu PC ou na nuvem'],
    },
    status: {
      brb: {
        title: 'BRB automático no ar',
        text: 'Todas as conexões caíram. O OBS trocou para a sua cena de BRB e a live continua aberta. Quando o sinal voltar, ele volta sozinho para a cena ao vivo.',
      },
      three: {
        title: 'Três conexões somadas',
        text: 'O vídeo viaja dividido entre 4G, 5G e Wi-Fi. Nenhuma delas carrega a live sozinha.',
      },
      two: {
        title: 'Uma caiu, duas seguram',
        text: 'O SRTLA redistribuiu a transmissão na hora. Quem está assistindo não percebe a troca.',
      },
      one: {
        title: 'Segurando com uma conexão',
        text: 'O bitrate desce para caber no sinal que sobrou, mas a live segue no ar e o SRT reenvia os pacotes perdidos.',
      },
    },
  },

  remote: {
    kicker: 'Só aqui · App StreamerKit para iPhone',
    title: ['Você faz a live.', 'Sua equipe cuida do celular.'],
    lede: 'Pelo navegador, de qualquer lugar, seus mods trocam a câmera, dão zoom, acendem a lanterna e seguram o bitrate. Você não tira o olho do rolê.',
    tryPill: 'Faça o papel do mod: mexa nos controles e veja o celular responder',
    stopped: 'Parado',
    lastAction: 'Última ação',
    lastNone: 'Nenhuma ainda. Mexa nos controles.',
    teamTitle: 'O que a equipe controla daqui',
    teamItems: [
      'Câmera frontal e traseira',
      'Zoom',
      'PiP com duas câmeras',
      'Microfone',
      'Lanterna',
      'Bitrate',
      'Iniciar e parar o envio',
      'Widgets no celular',
      'Qualidade de cada conexão',
    ],
    device: 'iPhone do streamer',
    panelLabel: 'Painel do mod',
    keys: {
      stop: ['Parar de enviar', 'Enviando'],
      start: ['Iniciar envio', 'Parado'],
      mute: ['Mutar', 'Microfone ligado'],
      unmute: ['Desmutar', 'Microfone mutado'],
      torchOn: ['Ligar lanterna', 'Lanterna desligada'],
      torchOff: ['Apagar lanterna', 'Lanterna acesa'],
      torchFront: 'Só na câmera traseira',
      reload: ['Recarregar widgets', 'Alertas e metas'],
      reloadBusy: 'Recarregando',
    },
    scene: 'Cena',
    cameraAria: 'Câmera',
    back: 'Traseira',
    front: 'Frontal',
    zoom: 'Zoom',
    bitrate: 'Bitrate',
    target: 'Alvo de {v} Mb/s',
    sending: 'enviando {v}',
    pipTitle: 'Picture-in-Picture',
    pipOff: 'Desligado',
    pipSub: '{cam}, 30%',
    widgets: 'Widgets',
    goal: 'Meta do dia',
    simNote: 'Simulação: nada aqui se conecta a uma live de verdade.',
    // textos desenhados em cima do vídeo do celular
    overlay: {
      muted: 'Mudo',
      torch: 'Lanterna',
      paused: 'Envio pausado pelo mod',
      reloading: 'Recarregando widgets',
    },
    // linha "Última ação"
    log: {
      stopped: 'Mod parou o envio',
      started: 'Mod iniciou o envio',
      micOn: 'Mod ligou o microfone',
      micOff: 'Mod mutou o microfone',
      torchOff: 'Mod apagou a lanterna',
      torchOn: 'Mod acendeu a lanterna',
      reload: 'Mod recarregou os widgets',
      camBack: 'Mod trocou para a câmera traseira',
      camFront: 'Mod trocou para a câmera frontal',
      zoom: 'Mod ajustou o zoom para {z}x',
      bitrate: 'Mod mudou o bitrate para {v} Mb/s',
      pipOff: 'Mod desligou o PiP',
      pipOn: 'Mod ligou o PiP com as duas câmeras',
      goalHide: 'Mod escondeu a meta do dia',
      goalShow: 'Mod mostrou a meta do dia',
    },
    footer:
      'Os widgets também saem dali: cole o link do alerta ou da meta uma vez, posicione arrastando e ele aparece no celular. E a equipe vê a qualidade de cada conexão, Wi-Fi e rede móvel, em tempo real.',
    cta: 'Quero isso na minha live',
  },

  canvas: {
    kicker: 'Só aqui · Canvas com widgets',
    title: ['Overlay de live grande,', 'montado no navegador.'],
    lede: 'Alertas, chat, mapa, placar, espectadores, desafios e QR code. Você arrasta, solta e o canvas entra no OBS como uma fonte de navegador, no seu PC ou na nuvem.',
    windowTitle: 'Canvas · Cena IRL',
    editing: 'Você e 1 mod editando',
    youBadge: 'VC',
    videoLabel: 'Vídeo de exemplo: rua de cidade à noite vista de dentro do carro',
    hint: 'Arraste os widgets',
    panelTitle: 'Widgets',
    count: '{n} na cena',
    widgetAria: 'Widget {l} (arrastável)',
    // rótulos dos 7 widgets, nesta ordem: placar, espectadores, local, chat, meta, QR, alertas
    labels: ['Placar', 'Espectadores', 'Local e velocidade', 'Chat', 'Meta', 'QR code', 'Alertas'],
    note: 'Textos, imagens, vídeos e páginas de alerta também entram. E os seus moderadores podem editar junto com você.',
    // textos dentro dos widgets
    place: 'CONSOLAÇÃO, SÃO PAULO, SP',
    speed: '5 KM/H',
    goalLabel: 'Meta de subs',
    qrLabel: 'ENTRA NO DISCORD',
    alertText: 'virou sub!',
    chat: [
      ['leo_zx', 'essa rua de noite é linda'],
      ['bia.mp4', 'kkkkk olha o cara da moto'],
      ['tutu77', 'manda salve pra Anápolis'],
      ['gabs', 'placar tá ao vivo, que brabo'],
      ['nandaa', 'cheguei agora, tá onde?'],
      ['rafa_irl', 'bora pro próximo desafio'],
    ],
  },

  bento: {
    kicker: 'Tudo incluído',
    title: 'A live IRL inteira num lugar só.',
    lede: 'Nada de juntar cinco serviços com fita. Bonding, OBS, overlays, multistream e equipe no mesmo painel.',
    cams: {
      title: 'Preview das câmeras',
      text: 'Cada câmera aparece ao vivo no painel, com o bitrate que está chegando. A equipe vê o que entra antes de ir ao ar.',
      cam: 'Câmera',
    },
    multi: {
      title: 'Multistream',
      text: 'Uma transmissão, até 4 destinos ao mesmo tempo, em todos os planos.',
      rtmp: 'RTMP personalizado',
      onAir: 'no ar',
    },
    obs: {
      badge: 'Plano Avançado',
      title: 'OBS na nuvem',
      text: 'Um OBS Studio completo roda nos nossos servidores e você controla pelo navegador. O PC de casa pode ficar desligado.',
      pcOff: 'PC desligado',
      obsOn: 'OBS ligado',
    },
    mods: {
      title: 'Moderadores com permissões',
      text: 'Convide a equipe e escolha o que cada um pode mexer.',
      role: 'Moderador',
      perms: ['Transmissões', 'Canvas', 'Ingests'],
    },
    ingest: {
      title: 'Ingest perto de você',
      text: 'Seu encoder conecta no ingest mais próximo: menos distância, menos atraso.',
      places: ['Brasil', 'EUA', 'Europa'],
    },
    h265: {
      title: 'H.265 (HEVC)',
      text: 'Envie H.265 por SRT e gaste menos dados móveis que com H.264, na mesma qualidade.',
      line1: 'Mesma qualidade de imagem.',
      line2: 'Menos dados do seu chip.',
    },
    pip: {
      title: 'PiP com duas câmeras',
      text: 'Frontal e traseira ao mesmo tempo, uma num quadro menor. A equipe liga e desliga pelo navegador.',
    },
    apps: {
      title: 'Funciona com o seu app',
      text: 'No iPhone, o app StreamerKit. No Android e em outros aparelhos, qualquer app que envie SRT ou SRTLA.',
      list: ['App StreamerKit (iPhone)', 'IRL Pro', 'Larix Broadcaster', 'OBS Studio', 'Qualquer encoder SRT'],
    },
  },

  steps: {
    kicker: 'Como começar',
    title: 'No ar em três passos.',
    lede: 'Sem montar servidor, sem linha de comando. Do plano à primeira live no mesmo dia.',
    items: [
      { title: 'Escolha um plano', text: 'Você entra com a sua conta da Twitch ou da Kick. Sem cadastro novo, sem senha nova.' },
      {
        title: 'Conecte o OBS',
        text: 'No seu PC, instale o plugin do StreamerKit (Windows) e escolha a sua cena de BRB. No Avançado, o OBS na nuvem já vem pronto.',
      },
      {
        title: 'Entre ao vivo',
        text: 'Abra o app StreamerKit no iPhone, ou escaneie o QR code da página Ingests com o IRL Pro ou o Larix.',
      },
    ],
  },

  pricing: {
    kicker: 'Planos',
    title: 'Escolha o seu e entre ao vivo.',
    lede: 'A diferença é quantos celulares ou câmeras transmitem ao mesmo tempo (ingests) e se você quer o OBS na nuvem.',
    cycleAria: 'Ciclo de cobrança',
    monthly: 'Mensal',
    annual: 'Anual',
    free: '2 meses grátis',
    // aviso de moeda (vazio em português; nos outros idiomas explica que o preço é em real)
    currencyNote: '',
    perMonth: '/mês',
    perYear: '/ano',
    yearNote: 'Equivale a R$ {v} por mês. Você paga 10 e usa 12.',
    monthNote: 'No anual, 2 meses saem de graça.',
    choose: 'Escolher {name}',
    onlyAdvanced: '(só no Avançado)',
    bothTitle: 'Os dois planos incluem',
    included: [
      'SRTLA bonding (4G + 5G + Wi-Fi)',
      'Cena de BRB automática',
      'Multistream para até 4 destinos',
      'Canvas com widgets',
      'Controle remoto do app',
      'Preview das câmeras',
      'Dashboard com estatísticas em tempo real',
    ],
    footnote:
      'Você entra com a sua conta da Twitch ou da Kick. Nos planos mensais, cada ingest extra custa R$ 49,90 por mês, com cobrança proporcional, em assinaturas elegíveis no cartão e no Pix Automático.',
    // preços já no formato do idioma (o valor é sempre em real)
    prices: {
      basic: { month: '119,90', year: '1.199,00', perMonthOnYear: '99,92' },
      advanced: { month: '499,90', year: '4.999,00', perMonthOnYear: '416,58' },
    },
    plans: {
      basic: {
        name: 'Básico',
        badge: 'Para começar',
        tagline: 'Para entrar ao vivo da rua com o OBS do seu PC.',
        // os 2 primeiros valem; os 2 últimos aparecem riscados (só no Avançado)
        features: [
          '1 ingest (1 celular ou câmera por vez)',
          'OBS no seu PC, com o plugin do StreamerKit (Windows)',
          'OBS na nuvem controlado pelo navegador',
          'Biblioteca de mídia para overlays e vídeos',
        ],
      },
      advanced: {
        name: 'Avançado',
        badge: 'PC desligado',
        tagline: 'PC desligado: o OBS roda na nuvem e você controla pelo navegador.',
        features: [
          '2 ingests (2 celulares ou câmeras ao mesmo tempo)',
          'OBS na nuvem controlado pelo navegador',
          'Biblioteca de mídia para overlays e vídeos',
          'Também funciona com o OBS do seu PC',
        ],
      },
    },
  },

  faq: {
    kicker: 'Dúvidas',
    title: 'O que todo mundo pergunta antes de assinar.',
    lede: 'Não achou a sua? A gente responde no Discord.',
    discord: 'Perguntar no Discord',
    items: [
      {
        q: 'O que é um servidor de live IRL?',
        a: 'É o serviço que recebe a transmissão do seu celular pela internet móvel, mantém o vídeo estável e entrega ao OBS, que envia para as plataformas. O StreamerKit faz isso com SRTLA bonding, ingests no Brasil, nos EUA e na Europa, OBS no seu PC ou na nuvem e multistream para Twitch, Kick e YouTube.',
      },
      {
        q: 'Funciona com 4G ou 5G fraco?',
        a: 'O SRTLA distribui a transmissão entre todas as suas conexões e o SRT reenvia pacotes perdidos, então a live aguenta sinal fraco. O H.265 reduz os dados necessários e o ingest mais próximo encurta a distância. Se todas as conexões caírem, o OBS troca para a sua cena de BRB e a live continua no ar.',
      },
      {
        q: 'O que é SRTLA bonding?',
        a: 'SRTLA divide uma transmissão SRT entre várias conexões ao mesmo tempo, como 4G, 5G e Wi-Fi. Se uma conexão cai ou piora, as outras seguram a live, e o SRT reenvia os pacotes perdidos.',
      },
      {
        q: 'Meus moderadores podem controlar meu celular durante a live?',
        a: 'Sim, com o app StreamerKit no iPhone. Pelo dashboard, os moderadores com permissão trocam entre a câmera frontal e a traseira, ajustam o zoom, ligam o PiP com as duas câmeras, mutam o microfone, ligam a lanterna, ajustam o bitrate, recarregam os widgets e iniciam ou param o envio. Com IRL Pro ou Larix a live funciona normalmente, mas sem o controle remoto.',
      },
      {
        q: 'Preciso deixar o PC ligado?',
        a: 'No Básico, sim: o OBS roda no seu PC com o plugin do StreamerKit (Windows), então o PC precisa ficar ligado durante toda a live. No Avançado, o OBS roda nos nossos servidores e você liga pelo dashboard, então o PC pode ficar desligado.',
      },
      {
        q: 'Quais apps funcionam?',
        a: 'No iPhone, o app StreamerKit. No Android e em outros aparelhos, IRL Pro, Larix Broadcaster ou qualquer app ou encoder que envie SRT ou SRTLA, incluindo o OBS Studio. A página Ingests mostra um QR code que carrega as configurações no IRL Pro e no Larix.',
      },
      {
        q: 'Como coloco overlays e widgets na live IRL?',
        a: 'Pelo navegador, de dois jeitos. No canvas com widgets você monta placar, mapa com sua localização, espectadores, desafios, QR code, textos, imagens, vídeos e páginas de alertas e chat, e o canvas entra no OBS como uma fonte de navegador, no seu PC ou na nuvem. Com o app StreamerKit, você também cola o link de qualquer overlay, como alertas e metas, uma vez na página Celular do dashboard, ajusta posição e tamanho arrastando, e o celular desenha o widget sobre a câmera quando conecta.',
      },
      {
        q: 'Posso transmitir na Twitch, Kick e YouTube ao mesmo tempo?',
        a: 'Sim. Em todos os planos você transmite para até 4 destinos ao mesmo tempo, incluindo Twitch, Kick, YouTube e RTMP personalizado. Você entra com sua conta da Twitch ou da Kick.',
      },
      {
        q: 'Qual a diferença entre o Básico e o Avançado?',
        a: 'Os dois planos têm SRTLA bonding, a cena de BRB automática, multistream, canvas com widgets, controle remoto do app e preview das câmeras. O Básico (R$ 119,90/mês) tem 1 ingest e funciona com o OBS do seu PC. O Avançado (R$ 499,90/mês) tem 2 ingests, um OBS na nuvem controlado pelo navegador e a biblioteca de mídia. No plano anual você paga R$ 1.199,00 (Básico) ou R$ 4.999,00 (Avançado), o preço de 10 meses.',
      },
    ],
  },

  final: {
    kicker: 'A próxima live é sua',
    title: ['O sinal cai.', 'A live fica.'],
    lede: 'Bonding, BRB automático, OBS na nuvem, overlays e a sua equipe no controle. Tudo num lugar só, cobrado em real.',
    micro: 'Você entra com a sua conta da Twitch ou da Kick. A partir de R$ 119,90 por mês.',
  },

  footer: {
    blurb: 'O StreamerKit mantém lives IRL no ar quando o sinal cai. Também conhecido como Servidor do Marco.',
    product: 'Produto',
    productLinks: ['Como segura a live', 'Controle remoto', 'Canvas com widgets', 'Planos'],
    account: 'Conta e ajuda',
    help: 'Central de ajuda',
    support: 'Suporte',
    faq: 'Perguntas frequentes',
    social: 'Redes',
    rights: '© 2026 StreamerKit. Todos os direitos reservados.',
    legalAria: 'Legal',
    privacy: 'Política de Privacidade',
    terms: 'Termos de Serviço',
  },

  sticky: { from: 'a partir de R$ 119,90' },
}

export type Dict = typeof pt
