# Editar en Remotion

1. `git clone https://github.com/ssntyalvarez/baza-remotion` y `cd baza-remotion`
2. `npm ci`
3. `npm run studio` abre el Skullcandy final (con logo y música) en http://localhost:3000
   - Panel Props (derecha): cambiás tiempos, textos, volúmenes y ves el resultado en vivo.
   - Los cambios de Studio no se guardan solos: copiá el JSON editado a `examples/skullcandy/musica-wdwww.json`.
4. Exportar: `npm run render -- examples/skullcandy/musica-wdwww.json renders/mi-version.mp4`

Otros montajes: `examples/skullcandy/*.json` (sin música, otras canciones). Para abrir uno:
`npx remotion studio src/index.jsx --props=examples/skullcandy/textos.json`

Todos los tiempos son cuadros (fps del JSON, 24 en Skullcandy). Detalle del formato en CLAUDE.md.
Diseño de los textos y logo: `src/index.jsx` (`TikTokText`, `BazaText`, capa `images`).
Si Studio muestra "MediaPlaybackError" de smoke.mp4: abriste `npm run studio:vacio`; usá `npm run studio`.
