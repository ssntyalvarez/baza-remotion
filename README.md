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
- Con `speed: 1.28` a 30 fps: el naranja tapa todo en el cuadro **56** desde que arranca la outro. Entonces `outro.at = finVideoChica - 57` (el video de la chica cubre hasta ese cuadro inclusive) y `duration: 75` (la outro se corta 1,5 s antes de su final: mucho naranja sobra). Verificar siempre mirando los cuadros alrededor del corte.

## Audio (paso obligatorio)

- Bajar el audio de TODOS los clips generados por IA entre −8 y −13 dB (`volume` 0,40 a 0,22). La voz en off queda en 1.
- Si ya estaba a −8, llevarlo a −12. Los clips con ruidos ASMR que suman (cápsula en el portacápsulas, cargar café) pueden quedar en ~−8 dB.
- Voz en off corrida de punta a punta, sin huecos: pausas de ~0,15 s y cortes solo en silencios reales.
