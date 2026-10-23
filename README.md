# baza-remotion

Paquete de montaje en Remotion para los reels de Baza, Power Case y Game Station. Se renderiza en la máquina en la nube de Claude, sin la PC prendida.

## Arrancar en un chat nuevo

```bash
gh repo clone ssntyalvarez/baza-remotion /tmp/claude-0/rmt
cd /tmp/claude-0/rmt && npm ci
export REMOTION_CHROME_EXECUTABLE=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell | head -1)
npm run render -- <timeline.json> renders/<salida>.mp4
```

- Los clips y la voz van en `public/<trabajo>/` (no se suben al repo, están en `.gitignore`).
- Formato del JSON: ver `CLAUDE.md`. Todo en cuadros (30 fps); el validador exige cubrir todo el tiempo con imagen.
- Ejemplo real completo: `examples/negra/montaje-cafetera-negra-v2.json`.

## Outro de Baza

- `public/baza/outro720.webm`: outro con transparencia (VP9 + alfa, 720x1280, 25 fps, 5,12 s). Usarla con `"transparent": true` y `"src": "baza/outro720.webm"`.
- `assets-originales/outro720.mov`: el original de Santy (QuickTime Animation con alfa); Chromium no lo decodifica, por eso se usa el .webm.
- **Regla:** va al final acelerada a ~1,28 (125–130 %), muy timeada: el video de la chica termina JUSTO en el cuadro en que el naranja tapa toda la pantalla y nunca se ve un cuadro negro debajo.
- Con `speed: 1.28` a 30 fps: el naranja tapa todo en el cuadro **56** desde que arranca la outro. Entonces `outro.at = finVideoChica - 57` (el video de la chica cubre hasta ese cuadro inclusive) y `duration` ~98 (90–105): la outro completa (120) deja mucho naranja, pero cortada a 75 termina de golpe; dejar ~0,5–1 s después de que termina la animación. Verificar siempre mirando los cuadros alrededor del corte.

## Audio (paso obligatorio)

- Bajar el audio de TODOS los clips generados por IA entre −8 y −13 dB (`volume` 0,40 a 0,22). La voz en off queda en 1.
- Si ya estaba a −8, llevarlo a −12. Los clips con ruidos ASMR que suman (cápsula en el portacápsulas, cargar café) pueden quedar en ~−8 dB.
- Voz en off corrida de punta a punta, sin huecos: pausas de ~0,15 s y cortes solo en silencios reales.

## Texto Baza (equivalente al MOGRT texto-baza)

En `texts`: `{"style":"baza","sub":"Cafetera de cápsulas","text":"3 EN 1","at":135,"duration":53,"y":0.14}`.
- Forma de T: cada renglón con su propia caja naranja `#D84515`, pegadas. Arriba regular (nombre del producto), abajo bold grande. Interlineado muy bajo.
- Opcionales: `size` (renglón grande, 104), `subSize` (56), `scale`, `y` (centro vertical, 0 a 1; arriba o abajo según el plano).
- Si el nombre es corto (p. ej. "Sandwichera"), el renglón grande se agranda hasta el ancho del de arriba (un solo bloque parejo).
- Fuente: `public/baza/fonts/texto-medium.otf` y `texto-bold.otf`. HOY es Inter Display (provisoria): reemplazar por la Redonda de Santy (.ttf/.otf) con el mismo nombre de archivo o ajustar `src/index.jsx`.
- Cada texto entra con su efecto de sonido: `public/baza/sonidos/` (en `audio`, volumen ~0,5). Ej.: campanita (bell1) justo en el corte al plano donde aparece el producto + texto con su nombre.

### Texto secundario y zonas seguras
- Texto secundario (menos jerarquía, p. ej. "Cápsula Nespresso", "Café molido", o una característica que importe: sumergible, inalámbrico): `{"style":"baza","level":"secundario","text":"Café molido",...}` + sonido de tecla (`baza/sonidos/key5.wav`, el golpe suena a 0,07 s: arrancarlo 2 cuadros antes del texto). Intercalar sonidos de tecla distintos (Key1–Key5 de la carpeta de Drive "Baza reels sonidos"): nunca el mismo en textos seguidos, cansa. Es opcional: usarlo solo si suma y no satura; no poner características que no importan.
- Zonas seguras de Reels/TikTok: abajo ~25 % del alto tapado (no poner texto ahí), arriba una franja (~10 %) y a la derecha los botones (likes, comentarios). Ubicar los textos entre `y` 0,12 y 0,70, centrados.
