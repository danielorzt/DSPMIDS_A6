export type Question = {
  id: string;
  category: string;
  text: string;
  /** options[0] es siempre la respuesta correcta; se barajan al iniciar el quiz. */
  options: [string, string, string, string];
  fact: string;
};

const q = (
  category: string,
  text: string,
  correct: string,
  wrong: [string, string, string],
  fact: string,
): Question => ({ id: '', category, text, options: [correct, ...wrong], fact });

const raw: Question[] = [
  // ---------- Nintendo ----------
  q('nintendo', '¿En qué año salió la Famicom (NES) en Japón?', '1983', ['1979', '1986', '1990'],
    'Llegó a Japón en julio de 1983; la versión occidental (NES) apareció entre 1985 y 1986.'),
  q('nintendo', 'Antes de los videojuegos, ¿qué fabricaba Nintendo desde 1889?', 'Cartas hanafuda', ['Relojes de pulsera', 'Juguetes de madera', 'Instrumentos musicales'],
    'Nintendo nació en Kioto como fabricante de cartas hanafuda, un juego tradicional japonés.'),
  q('nintendo', '¿Qué portátil de Nintendo, lanzada en 1989, incluyó Tetris en muchos países?', 'Game Boy', ['Game Gear', 'Nintendo DS', 'Virtual Boy'],
    'Su pantalla monocroma y su batería duradera la volvieron un fenómeno mundial.'),
  q('nintendo', '¿Qué portátil de 2004 tenía dos pantallas, una de ellas táctil?', 'Nintendo DS', ['Game Boy Advance', 'PSP', 'Nintendo 3DS'],
    'DS significa "Dual Screen" (doble pantalla).'),
  q('nintendo', '¿Cómo se llama la consola híbrida de Nintendo lanzada en 2017?', 'Switch', ['Wii U', 'GameCube', 'Switch Lite'],
    'Se puede usar conectada a la TV o en modo portátil gracias a sus mandos desmontables.'),
  q('nintendo', '¿Qué novedad principal ofrecía el mando de la Wii (2006)?', 'Detección de movimiento', ['Pantalla integrada', 'Cámara 4K', 'Control por voz'],
    'El Wii Remote reconocía los movimientos del jugador, atrayendo a un público muy amplio.'),
  q('nintendo', '¿Quién es el diseñador japonés detrás de Mario y Zelda?', 'Shigeru Miyamoto', ['Hideo Kojima', 'Satoru Iwata', 'Hironobu Sakaguchi'],
    'Miyamoto es considerado uno de los diseñadores más influyentes de la historia.'),
  q('nintendo', '¿Qué consola de Nintendo usaba discos ópticos pequeños propios?', 'GameCube', ['Nintendo 64', 'Super Nintendo', 'Game Boy Advance'],
    'Usaba miniDVD de 8 cm y salió en 2001.'),

  // ---------- PlayStation ----------
  q('playstation', '¿En qué año se lanzó la PlayStation original en Japón?', '1994', ['1991', '1996', '1998'],
    'Salió el 3 de diciembre de 1994 y popularizó los juegos en 3D en disco.'),
  q('playstation', '¿Qué formato de disco estrenó la PS3 para sus juegos?', 'Blu-ray', ['DVD-ROM', 'Cartucho', 'MiniDisc'],
    'Sony impulsó el Blu-ray frente al HD DVD, y la PS3 ayudó a ganar esa batalla.'),
  q('playstation', '¿Con qué empresa colaboró Sony al inicio de lo que acabó siendo PlayStation?', 'Nintendo', ['Sega', 'Atari', 'Microsoft'],
    'Iba a ser un lector de CD para la Super Nintendo; el acuerdo se rompió y Sony creó su propia consola.'),
  q('playstation', '¿Qué símbolos llevan los botones de acción del mando PlayStation?', 'Triángulo, círculo, cruz y cuadrado', ['A, B, X e Y', 'Estrella, luna, sol y rayo', '1, 2, 3 y 4'],
    'Estos símbolos son una seña de identidad de la marca desde 1994.'),
  q('playstation', '¿Qué consola portátil lanzó Sony en 2004?', 'PSP', ['PS Vita', 'PocketStation', 'Game Gear'],
    'PlayStation Portable permitía jugar, ver películas y escuchar música.'),
  q('playstation', '¿Cómo se llama el mando de la PS5?', 'DualSense', ['DualShock', 'SixAxis', 'Move'],
    'Incluye retroalimentación háptica y gatillos adaptativos.'),
  q('playstation', '¿Qué consola de Sony es considerada la más vendida de la historia?', 'PlayStation 2', ['PlayStation 1', 'PlayStation 4', 'PSP'],
    'Superó los 150 millones de unidades, con Nintendo DS muy cerca.'),
  q('playstation', '¿En qué año salió la PlayStation 4?', '2013', ['2010', '2011', '2015'],
    'Se lanzó en noviembre de 2013, el mismo mes que la Xbox One.'),

  // ---------- Xbox ----------
  q('xbox', '¿En qué año salió la primera Xbox?', '2001', ['1998', '2003', '2005'],
    'Fue el debut de Microsoft en el mundo de las consolas.'),
  q('xbox', '¿Cómo se llama el servicio de suscripción con catálogo de juegos de Xbox?', 'Game Pass', ['Xbox Plus', 'Live Gold', 'Play Club'],
    'Funciona como una especie de "Netflix" de videojuegos.'),
  q('xbox', '¿Qué accesorio permitía jugar con el cuerpo en la Xbox 360, sin mando?', 'Kinect', ['Move', 'Wiimote', 'Zapper'],
    'Kinect usaba cámaras y sensores de profundidad para detectar movimientos.'),
  q('xbox', '¿En qué año se lanzó la Xbox 360?', '2005', ['2002', '2007', '2009'],
    'Llegó un año antes que PS3 y Wii, con ventaja en la generación.'),
  q('xbox', '¿Qué estudio creador de Minecraft compró Microsoft en 2014?', 'Mojang', ['Mojave', 'Moonton', 'Mobius'],
    'La operación costó alrededor de 2.500 millones de dólares.'),
  q('xbox', '¿Cómo se llama el servicio en línea de Xbox lanzado en 2002?', 'Xbox Live', ['Xbox Net', 'Windows Play', 'Live Arcade Pro'],
    'Fue pionero en el juego online en consolas con una cuenta unificada.'),
  q('xbox', '¿Qué componente traía de serie la Xbox original, poco común en consolas de la época?', 'Disco duro', ['Pantalla táctil', 'Cámara web', 'Sensor de movimiento'],
    'El disco duro permitía guardar partidas y música sin tarjetas de memoria.'),
  q('xbox', '¿En qué año salieron Xbox Series X y Series S?', '2020', ['2018', '2019', '2022'],
    'Ambas llegaron en noviembre de 2020.'),

  // ---------- Sega ----------
  q('sega', '¿Cómo se llama la mascota erizo azul de Sega?', 'Sonic', ['Spyro', 'Crash', 'Rayman'],
    'Sonic nació en 1991 como rival de las mascotas de la competencia.'),
  q('sega', '¿Cuál fue la última consola doméstica de Sega?', 'Dreamcast', ['Saturn', 'Master System', 'Mega Drive'],
    'Fue descatalogada en 2001 y Sega pasó a centrarse en el software.'),
  q('sega', '¿Cómo se llamó la Mega Drive en Norteamérica?', 'Genesis', ['Exodus', 'Revelation', 'Neo Geo'],
    'El nombre "Genesis" se usó porque "Mega Drive" ya estaba registrado.'),
  q('sega', '¿Qué portátil de color lanzó Sega en 1990?', 'Game Gear', ['Game Boy', 'Lynx', 'Nomad Mini'],
    'Tenía pantalla a color, pero consumía las pilas muy rápido.'),
  q('sega', '¿Qué consola de Sega salió en Japón en 1994, antes de Dreamcast?', 'Saturn', ['Genesis', 'Pico', 'Mark III'],
    'Usaba CD-ROM y tenía una arquitectura de doble procesador.'),
  q('sega', '¿En qué año salió la Dreamcast en Japón?', '1998', ['1995', '2000', '2002'],
    'Fue la primera consola de su generación con módem integrado.'),
  q('sega', '¿Qué personaje fue mascota de Sega antes que Sonic?', 'Alex Kidd', ['Ristar', 'Vectorman', 'Ecco'],
    'Alex Kidd protagonizó juegos de la Master System a mediados de los 80.'),
  q('sega', '¿Qué año marcó el fin de la fabricación de consolas de Sega?', '2001', ['1996', '1999', '2005'],
    'Tras Dreamcast, la compañía se convirtió en desarrolladora multiplataforma.'),

  // ---------- Retro y Arcade ----------
  q('retro', '¿En qué año salió el arcade Pong, de Atari?', '1972', ['1962', '1980', '1985'],
    'Pong fue uno de los primeros videojuegos con éxito comercial.'),
  q('retro', '¿Qué come Pac-Man para poder perseguir a los fantasmas?', 'Píldoras de poder', ['Cerezas', 'Monedas', 'Estrellas'],
    'Las píldoras grandes vuelven vulnerables a los fantasmas por unos segundos.'),
  q('retro', '¿Qué compañía japonesa creó Space Invaders?', 'Taito', ['Namco', 'Konami', 'Capcom'],
    'Estrenado en 1978, provocó un auge de salones recreativos.'),
  q('retro', '¿Quién creó Tetris en 1984?', 'Alekséi Pázhitnov', ['Shigeru Miyamoto', 'Nolan Bushnell', 'Yuji Naka'],
    'Lo programó en la Unión Soviética mientras trabajaba en la Academia de Ciencias.'),
  q('retro', '¿De cuántos bloques está formada cada pieza clásica de Tetris?', '4', ['3', '5', '6'],
    'Se llaman tetrominós: "tetra" significa cuatro.'),
  q('retro', '¿En qué año salió la Atari 2600?', '1977', ['1972', '1983', '1990'],
    'Fue clave para llevar los videojuegos a los hogares.'),
  q('retro', '¿Cómo se llamaba originalmente Mario en Donkey Kong (1981)?', 'Jumpman', ['Marty', 'Luigi', 'Mr. Video'],
    'Más tarde fue rebautizado como Mario.'),
  q('retro', '¿Quién cofundó Atari en 1972?', 'Nolan Bushnell', ['Ralph Baer', 'Masaya Nakamura', 'Hiroshi Yamauchi'],
    'Bushnell también fundó la cadena de restaurantes con juegos recreativos Chuck E. Cheese.'),

  // ---------- Cultura Gamer ----------
  q('general', 'En juegos, ¿qué significa "FPS" como género?', 'Disparos en primera persona', ['Fútbol por salidas', 'Fuego, pólvora y sigilo', 'Fantasía y puzles'],
    'Se juega viendo la acción a través de los ojos del personaje.'),
  q('general', '¿Qué significa NPC?', 'Personaje no jugable', ['Nuevo punto de control', 'Nivel por completar', 'Nombre de perfil con clave'],
    'Son personajes controlados por el juego, como comerciantes o aldeanos.'),
  q('general', '¿Cuál es el videojuego más vendido de la historia?', 'Minecraft', ['Tetris', 'GTA V', 'Wii Sports'],
    'Supera las 300 millones de copias vendidas.'),
  q('general', '¿A qué género pertenece League of Legends?', 'MOBA', ['Battle Royale', 'Plataformas', 'Simulación'],
    'MOBA significa "Multiplayer Online Battle Arena".'),
  q('general', '¿Qué es un "speedrun"?', 'Terminar un juego lo más rápido posible', ['Jugar sin parar 24 horas', 'Jugar sin morir', 'Completar solo el modo difícil'],
    'Las comunidades de speedrunners buscan atajos y récords mundiales.'),
  q('general', '¿Qué empresa desarrolla el motor Unreal Engine?', 'Epic Games', ['Valve', 'Unity Technologies', 'Ubisoft'],
    'Epic Games también es la empresa detrás de Fortnite.'),
  q('general', '¿Qué compañía creó la plataforma de distribución digital Steam?', 'Valve', ['Epic Games', 'Electronic Arts', 'Blizzard'],
    'Steam se lanzó en 2003 y hoy es la mayor tienda de juegos para PC.'),
  q('general', '¿Qué significa RPG?', 'Juego de rol', ['Juego de plataformas rápidas', 'Rally profesional de gamers', 'Rutina de puntos globales'],
    'Del inglés "Role-Playing Game": eliges y desarrollas a tu personaje.'),
  q('general', 'En un juego, ¿qué es un DLC?', 'Contenido descargable adicional', ['Un tipo de dificultad', 'Un mando especial', 'Un modo multijugador local'],
    'Son las siglas de "Downloadable Content".'),
  q('general', 'Al hablar de rendimiento, ¿qué mide "FPS"?', 'Fotogramas por segundo', ['Fuerza por segundo', 'Fallos por sesión', 'Fases por semana'],
    'A más FPS, más fluida se ve la imagen: 60 FPS es el estándar habitual.'),
];

export const QUESTIONS: Question[] = raw.map((item, i) => ({ ...item, id: `q${i + 1}` }));
