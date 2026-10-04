# Pixel Quest · Trivia de Videojuegos

App móvil en **React Native (Expo + TypeScript)** para la actividad *Explorando la experiencia de usuario* de
Desarrollo de Software en Plataformas Móviles (Uniminuto).

Las preguntas son factuales (compañías, consolas, términos y curiosidades). No se usan logos, personajes,
música ni arte de terceros, así que no hay material con copyright: los íconos son de `@expo/vector-icons`.

## Requisitos del PDF → dónde están

| Requisito | Implementación |
|---|---|
| Pantalla principal con categorías | `src/app/index.tsx` (6 categorías + Modo Mezcla) |
| Pantalla de preguntas: 1 pregunta, 4 opciones | `src/app/quiz/[id].tsx`, `src/components/AnswerOption.tsx` |
| Pantalla de resultados: correctas / incorrectas | `src/app/results.tsx` |
| Navegación fluida | Expo Router (Stack) con transiciones `slide`, `fade_from_bottom` y `fade` |
| SQLite | `src/lib/scores.ts` guarda el mejor puntaje por categoría con `expo-sqlite` (en web usa `localStorage`) |

## Diseño y experiencia de usuario

Dirección visual: **minimalista y sobria**, papel cálido y tinta (con modo oscuro automático), tipografías
Instrument Serif + DM Sans y una paleta de acentos usada en dosis pequeñas.

- Cada pregunta tiene una **ilustración original animada** (vectores propios con `react-native-svg`, 29 motivos): no hay imágenes ni GIF de terceros.
- Cada respuesta lleva una forma (triángulo, rombo, círculo, cuadrado), al estilo de los quizzes de aula.
- Temporizador de 20 s, racha, vibración al responder y un dato curioso tras cada respuesta.
- Resultados con repaso de cada pregunta y su respuesta correcta.
- Respeta "reducir movimiento", usa áreas táctiles de 48 dp y etiquetas de accesibilidad.
- La guía de diseño usada es la skill [Impeccable](https://github.com/pbakaus/impeccable) (Apache 2.0), instalada en `.claude/skills/impeccable` sin sus hooks.

## Ejecutar

```bash
npm install
npx expo start      # escanea el QR con Expo Go, o pulsa a (Android) / i (iOS) / w (web)
npm run typecheck
```

## Estructura

```
src/
  app/          rutas (Expo Router): index, quiz/[id], results
  components/   Illustration, ShapeGlyph, CategoryRow, AnswerOption, PressableScale
  data/         categorías y banco de preguntas (50 preguntas)
  lib/          lógica del quiz, SQLite, háptica
  theme/        colores, radios y sombras
```

## Guion sugerido para el video (máx. 5 min)

1. **Introducción (0:00–0:40):** qué es la app, categorías y flujo general.
2. **Desarrollo (0:40–3:40):** planificación y diagrama de flujo (Inicio → Preguntas → Resultados), herramientas
   (Expo, Expo Router, SQLite), código clave: `PressableScale`, animaciones con `Animated`, temporizador, navegación con `router.push/replace`.
3. **Conclusión (3:40–5:00):** demostración de la app en funcionamiento.
