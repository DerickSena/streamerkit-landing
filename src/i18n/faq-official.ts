// Perguntas e respostas oficiais, copiadas do site atual (https://streamerkit.net) em 2026-11-19.
// Ordem do site. Os dicionários reordenam para a ordem desta página.
export const FAQ_OFFICIAL = {
  "en": [
    {
      "q": "What is an IRL streaming server?",
      "a": "It is the service that receives the stream from your phone over mobile internet, keeps the video stable and hands it to OBS, which sends it to the platforms. StreamerKit does this with SRTLA bonding, ingest servers in Brazil, the US and Europe, OBS on your PC or in the cloud, and multistreaming to Twitch, Kick and YouTube."
    },
    {
      "q": "What is SRTLA bonding?",
      "a": "SRTLA splits one SRT stream across several connections at once, such as 4G, 5G and Wi-Fi. If one connection drops or gets worse, the others keep the stream live, and SRT resends lost packets."
    },
    {
      "q": "Can my moderators control my phone during the stream?",
      "a": "Yes, with the StreamerKit app on iPhone. From the dashboard, moderators with permission switch between the front and back cameras, adjust the zoom, turn on PiP with both cameras, mute the microphone, turn on the flashlight, adjust the bitrate, reload widgets and start or stop sending. With IRL Pro or Larix the stream works normally, but without remote control."
    },
    {
      "q": "How do I add overlays and widgets to an IRL stream?",
      "a": "From your browser, in two ways. In the canvas with widgets you build a scoreboard, a map with your location, viewer count, challenges, QR code, text, images, videos and alert and chat pages, and the canvas goes into OBS as a browser source, on your PC or in the cloud. With the StreamerKit app, you can also paste the link to any overlay, such as alerts and goals, once on the Phone page of the dashboard, set position and size by dragging, and the phone draws the widget over the camera when it connects. Before, this was done on the phone itself."
    },
    {
      "q": "Do I need to keep my PC on?",
      "a": "On Basic, yes: OBS runs on your PC with the StreamerKit plugin (Windows), so the PC has to stay on for the whole stream. On Advanced, OBS runs on our servers and you start it from the dashboard, so your PC can stay off."
    },
    {
      "q": "Which apps work?",
      "a": "On iPhone, the StreamerKit app. On Android and other devices, IRL Pro, Larix Broadcaster or any app or encoder that sends SRT or SRTLA, including OBS Studio. The Ingests page shows a QR code that loads the settings into IRL Pro and Larix."
    },
    {
      "q": "Can I stream to Twitch, Kick and YouTube at the same time?",
      "a": "Yes. On every plan you can stream to up to 4 destinations at once, including Twitch, Kick, YouTube and custom RTMP. You sign in with your Twitch or Kick account."
    },
    {
      "q": "Does it work on weak 4G or 5G?",
      "a": "SRTLA spreads the stream across all your connections and SRT resends lost packets, so the stream holds up on a weak signal. H.265 cuts the data you need and the closest ingest shortens the distance. If every connection drops, OBS switches to your BRB scene and the stream stays live."
    },
    {
      "q": "What's the difference between Basic and Advanced?",
      "a": "Both plans include SRTLA bonding, the automatic BRB scene, multistreaming, the canvas with widgets, remote app control and camera previews. Basic (R$119.90/month) includes 1 ingest and works with OBS on your PC. Advanced (R$499.90/month) includes 2 ingests, a cloud OBS you control from your browser and the media library. Billed yearly it costs R$1,199.00 (Basic) or R$4,999.00 (Advanced), the price of 10 months."
    }
  ],
  "es": [
    {
      "q": "¿Qué es un servidor de directos IRL?",
      "a": "Es el servicio que recibe la transmisión de tu móvil por internet móvil, mantiene el vídeo estable y lo entrega a OBS, que lo envía a las plataformas. StreamerKit lo hace con SRTLA bonding, ingests en Brasil, EE. UU. y Europa, OBS en tu PC o en la nube y multistreaming a Twitch, Kick y YouTube."
    },
    {
      "q": "¿Qué es SRTLA bonding?",
      "a": "SRTLA reparte una transmisión SRT entre varias conexiones a la vez, como 4G, 5G y Wi-Fi. Si una conexión se cae o empeora, las demás sostienen el directo, y SRT reenvía los paquetes perdidos."
    },
    {
      "q": "¿Mis moderadores pueden controlar mi móvil durante el directo?",
      "a": "Sí, con la app StreamerKit en el iPhone. Desde el panel, los moderadores con permiso cambian entre la cámara frontal y la trasera, ajustan el zoom, activan el PiP con las dos cámaras, silencian el micrófono, encienden la linterna, ajustan el bitrate, recargan los widgets e inician o detienen el envío. Con IRL Pro o Larix el directo funciona igual, pero sin control remoto."
    },
    {
      "q": "¿Cómo pongo overlays y widgets en un directo IRL?",
      "a": "Desde el navegador, de dos formas. En el canvas con widgets montas marcador, mapa con tu ubicación, espectadores, retos, código QR, textos, imágenes, vídeos y páginas de alertas y chat, y el canvas entra en OBS como una fuente de navegador, en tu PC o en la nube. Con la app StreamerKit, también pegas una vez el enlace de cualquier overlay, como alertas y metas, en la página Móvil del panel, ajustas la posición y el tamaño arrastrando, y el móvil dibuja el widget sobre la cámara al conectarse. Antes, esto se hacía en el propio móvil."
    },
    {
      "q": "¿Tengo que dejar el PC encendido?",
      "a": "En Básico, sí: OBS funciona en tu PC con el plugin de StreamerKit (Windows), así que el PC tiene que seguir encendido durante todo el directo. En Avanzado, OBS funciona en nuestros servidores y lo inicias desde el panel, así que el PC puede quedarse apagado."
    },
    {
      "q": "¿Qué apps funcionan?",
      "a": "En iPhone, la app StreamerKit. En Android y otros dispositivos, IRL Pro, Larix Broadcaster o cualquier app o encoder que envíe SRT o SRTLA, incluido OBS Studio. La página Ingests muestra un código QR que carga la configuración en IRL Pro y Larix."
    },
    {
      "q": "¿Puedo emitir en Twitch, Kick y YouTube a la vez?",
      "a": "Sí. En todos los planes puedes emitir a hasta 4 destinos a la vez, incluidos Twitch, Kick, YouTube y RTMP personalizado. Inicias sesión con tu cuenta de Twitch o Kick."
    },
    {
      "q": "¿Funciona con 4G o 5G débil?",
      "a": "SRTLA reparte la transmisión entre todas tus conexiones y SRT reenvía los paquetes perdidos, así que el directo aguanta con señal débil. H.265 reduce los datos necesarios y el ingest más cercano acorta la distancia. Si se caen todas las conexiones, OBS cambia a tu escena de BRB y la emisión sigue en directo."
    },
    {
      "q": "¿Qué diferencia hay entre Básico y Avanzado?",
      "a": "Los dos planes incluyen SRTLA bonding, la escena de BRB automática, multistreaming, el canvas con widgets, el control remoto de la app y la vista previa de las cámaras. Básico (R$ 119,90/mes) incluye 1 ingest y funciona con el OBS de tu PC. Avanzado (R$ 499,90/mes) incluye 2 ingests, un OBS en la nube controlado desde el navegador y la biblioteca de medios. Con el pago anual cuesta R$ 1.199,00 (Básico) o R$ 4.999,00 (Avanzado), el precio de 10 meses."
    }
  ],
  "es-419": [
    {
      "q": "¿Qué es un servidor de transmisiones IRL?",
      "a": "Es el servicio que recibe la transmisión de tu celular por internet móvil, mantiene el video estable y lo entrega a OBS, que lo envía a las plataformas. StreamerKit lo hace con SRTLA bonding, ingests en Brasil, EE. UU. y Europa, OBS en tu computadora o en la nube y multistreaming a Twitch, Kick y YouTube."
    },
    {
      "q": "¿Qué es SRTLA bonding?",
      "a": "SRTLA reparte una transmisión SRT entre varias conexiones al mismo tiempo, como 4G, 5G y Wi-Fi. Si una conexión se cae o empeora, las demás sostienen la transmisión, y SRT reenvía los paquetes perdidos."
    },
    {
      "q": "¿Mis moderadores pueden controlar mi celular durante la transmisión?",
      "a": "Sí, con la app StreamerKit en el iPhone. Desde el panel, los moderadores con permiso cambian entre la cámara frontal y la trasera, ajustan el zoom, activan el PiP con las dos cámaras, silencian el micrófono, prenden la linterna, ajustan el bitrate, recargan los widgets e inician o detienen el envío. Con IRL Pro o Larix la transmisión funciona igual, pero sin control remoto."
    },
    {
      "q": "¿Cómo pongo overlays y widgets en una transmisión IRL?",
      "a": "Desde el navegador, de dos formas. En el canvas con widgets armas marcador, mapa con tu ubicación, espectadores, retos, código QR, textos, imágenes, videos y páginas de alertas y chat, y el canvas entra en OBS como una fuente de navegador, en tu computadora o en la nube. Con la app StreamerKit, también pegas una vez el enlace de cualquier overlay, como alertas y metas, en la página Celular del panel, ajustas la posición y el tamaño arrastrando, y el celular dibuja el widget sobre la cámara al conectarse. Antes, esto se hacía en el propio celular."
    },
    {
      "q": "¿Tengo que dejar la computadora encendida?",
      "a": "En Básico, sí: OBS corre en tu computadora con el plugin de StreamerKit (Windows), así que tiene que seguir encendida durante toda la transmisión. En Avanzado, OBS corre en nuestros servidores y lo inicias desde el panel, así que tu computadora puede quedarse apagada."
    },
    {
      "q": "¿Qué apps funcionan?",
      "a": "En iPhone, la app StreamerKit. En Android y otros dispositivos, IRL Pro, Larix Broadcaster o cualquier app o encoder que envíe SRT o SRTLA, incluido OBS Studio. La página Ingests muestra un código QR que carga la configuración en IRL Pro y Larix."
    },
    {
      "q": "¿Puedo transmitir en Twitch, Kick y YouTube al mismo tiempo?",
      "a": "Sí. En todos los planes puedes transmitir a hasta 4 destinos al mismo tiempo, incluidos Twitch, Kick, YouTube y RTMP personalizado. Inicias sesión con tu cuenta de Twitch o Kick."
    },
    {
      "q": "¿Funciona con 4G o 5G débil?",
      "a": "SRTLA reparte la transmisión entre todas tus conexiones y SRT reenvía los paquetes perdidos, así que la transmisión aguanta con señal débil. H.265 reduce los datos necesarios y el ingest más cercano acorta la distancia. Si se caen todas las conexiones, OBS cambia a tu escena de BRB y la transmisión sigue al aire."
    },
    {
      "q": "¿Qué diferencia hay entre Básico y Avanzado?",
      "a": "Los dos planes incluyen SRTLA bonding, la escena de BRB automática, multistreaming, el canvas con widgets, el control remoto de la app y la vista previa de las cámaras. Básico (R$ 119,90/mes) incluye 1 ingest y funciona con el OBS de tu computadora. Avanzado (R$ 499,90/mes) incluye 2 ingests, un OBS en la nube controlado desde el navegador y la biblioteca de medios. Con el pago anual cuesta R$ 1.199,00 (Básico) o R$ 4.999,00 (Avanzado), el precio de 10 meses."
    }
  ]
} as const

/** Ordem das perguntas nesta página (índices da ordem oficial). */
export const FAQ_ORDER = [0, 7, 1, 2, 4, 5, 3, 6, 8]
