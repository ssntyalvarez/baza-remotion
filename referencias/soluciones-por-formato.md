# Soluciones a los límites de la IA, por formato (manual de ejecución)

Complementa la planilla `mapa-anuncios` (pestaña Formatos, columna "Nuestro límite con IA"). Acá está **cómo se resolvió cada límite**, paso a paso, para que la automatización no falle.

**Estado de cada solución:**
- **[comprobado]**: lo hicimos y Santy lo aprobó.
- **[parcial]**: funcionó con un detalle pendiente.
- **[sin validar]**: método propuesto o investigado, todavía sin probar.

Herramientas (detalle en `argolink-api.md`):
- **Video:** ArgoLink Seedance 2.5 (`POST /v1/videos`). Siempre 720p, 9:16 y `generate_audio: true`.
- **Imagen guía:** ArgoLink nano-banana-pro (`POST /v1/images/edits`, US$0,03, `resolution: "2k"`).
- **Corrección de un clip:** ArgoLink edit (`omni_reference_task_type: "edit"`, sin `aspect_ratio`).
- **Búsquedas:** Apify.
- **Montaje:** Remotion del repo `baza-remotion`.
- **Helper:** `argo.py`, con `req`, `upload`, `submit` y `fetch`.
- Las llaves salen de `llaves.env` (Drive) o de `argolink-key.txt`, y nunca se imprimen.

---

## 0. Problemas comunes a todos los formatos (aplicar siempre)

### 0.1 Look de celular real (que no parezca IA ni cine) [comprobado]

**Bloque fijo que va al principio de todo prompt de Seedance:**

> Vertical 9:16 video, N seconds. It must look like a real casual video shot on an iPhone main camera at 1x: wide-angle phone lens, everything in focus near and far, no background blur, natural slightly washed-out phone colors, real-time speed, NOT slow motion, no cinematic look. The camera does not move inside each cut.

**Qué no hacer:**
- Nunca escribir "tripod" ni "phone" como objeto en la escena: aparecen en el video. Decir "static shot" o "the camera does not move".
- Wan tiende a lente largo, con perspectiva aplanada y bokeh. Hay que aclarar "wide-angle phone lens, distorted close perspective, almost no blur".

**Luz:**
- Leer antes los 3 ejemplos de `referencias/luz/` del repo: 1) solo luz natural; 2) luz artificial completa; 3) mezcla.
- Pedir zonas quemadas por el sol "blown out almost to white like a real phone exposes it" y el resto "bright and open with soft shadows, no deep black areas".
- Nada de "rim light, backlight, glowing orange edges". Si hace falta, escribir: "the sun is BEHIND THE PERSON FILMING… NO backlight, NO rim light".

**Cámara totalmente quieta:**
- Ningún prompt la deja quieta del todo en modo referencias.
- Lo más quieto es image-to-video desde un cuadro bueno.
- En Premiere: Estabilizador de deformación → "Sin movimiento".

### 0.2 Producto fiel en todos los planos [comprobado]

**Referencias del producto:**
- Solo fotos del producto, preferentemente sobre fondo blanco, más los accesorios. Nunca imágenes de lifestyle o mockups.
- En el prompt, describir el producto con sus rasgos visibles. Ejemplo Indy Evo: "matte black rounded-square case with a grey band, four small white lights, grey skull logo; earbuds with short straight stem…".
- Decir qué es lo único que lleva el logo: "the only things that carry the skull logo; nothing else has a skull". En el gym, el logo se coló en las zapatillas.

**Orientación del producto:**
- Si las referencias muestran el frente, el modelo pone el frente hacia la cámara.
- Para una selfie se pasan solo las vistas del dorso y se aclara que el frente nunca se ve. Pasó con la Kodak.

**Cómo se usa o se pone el producto:**
- Si Seedance no entiende cómo va, no se reintenta con texto. Ejemplo: el auricular salió al revés, saliendo por detrás de la oreja.
- Se edita ANTES un cuadro con nano-banana mostrándolo bien puesto (oreja de perfil con el Indy Evo, cuerpo en el canal auditivo, palito hacia abajo, calavera hacia afuera). Ese cuadro se pasa recortado al detalle.
- En el prompt: "worn exactly like @Image N (only a reference of how it is worn, NOT a shot)".

**Mecanismos:**
- Solo se muestran mecanismos que el manual y las fotos muestran claros.
- Si hace falta enseñar cómo encastra algo, se pasa un tramo de un video real, sin audio, en `reference_videos`: "Copy EXACTLY its mechanics… Ignore that video's color, brand, on-screen text, hands and kitchen".
- Ojo: copia el diseño del objeto del video. Hay que pasar la foto real del nuestro y nombrarla como verdad.

### 0.3 Continuidad (persona, ropa, lugar, objetos) [comprobado]

**Biblia de continuidad (`continuidad.md`):** antes de generar, armar una lista cerrada de la utilería del video. Cada objeto lleva su propia foto (taza 1, taza 2…), una imagen por objeto y no todas juntas: en la cafetera negra, con las tres tazas en una sola imagen, cambiaron de tamaño. Cada plano lleva las fotos de los objetos que aparecen y el prompt dice cuáles hay y cuáles no.

**Referencia de cara:**
- Se saca de un cuadro de un clip aprobado de nuestra persona. Ejemplo: `face_ref.jpg`, sacado del plano 1 del gym.
- En el prompt: "@Image 1 is the only face reference".

**Referencia de ropa, sin cara (nuevo, gym):**
- Armar con nano-banana una imagen del cuerpo con la ropa exacta, sin la cara. La cara la hace mejor Seedance.
- Se pasa en TODOS los planos: "Clothes exactly like @Image 2: plain black fitted short-sleeve gym t-shirt with a small grey logo, mid-thigh grey athletic shorts, plain white sneakers".
- Sin esto salió jogging en un plano y short en otro.
- [parcial] El press salió con pantalón largo igual. Cuando la ropa es clave, además de la referencia de ropa, pasar un cuadro guía editado con nano-banana de ese plano con la ropa correcta. Así se resolvió el espejo (g04c).

**Referencia de lugar:**
- Un cuadro del lugar aprobado (ej. `gym_espejo.png`), con la aclaración "only a reference for the place".
- Los planos en el mismo lugar llevan el mismo cuadro.

**Cuadro de continuidad:** nunca puede mostrar el error que se quiere corregir, porque lo vuelve a copiar.

### 0.4 Manos y acciones naturales (no "lentas tipo IA") [comprobado]

- Cada acción simple dura ~1 s en el guion: "in one quick natural move (about 1 second)… fast, casual, a bit rough, like a real person in a hurry". Después ~1 s de cámara quieta sin la mano.
- Si se le dan 3 s a una acción fácil, la hace en 3 s. Es error de guion.
- Si igual sale lenta, se arregla en edición: cortar 6 a 10 cuadros más desde el arranque del recorrido.
- Clips de 4–5 s con 1 o 2 cortes duros como máximo. Con clips de 8–10 s y muchas acciones aparecen objetos de la nada, cambian las tazas y hay acciones sin sentido. Se tiraron ~US$10 en la cafetera negra.

### 0.5 Errores típicos de Seedance y cómo se corrigen [comprobado]

**Errores típicos:**
- Enchufes europeos: se corrige con un cuadro guía con enchufe argentino tipo I, usando el recorte bueno de Santy como referencia.
- Logos de la competencia: se sacan con ArgoLink edit.
- Accesorios inventados o duplicados, y cambios de color.
- El celular que graba visible.
- Ruidos raros con la boca.

**Orden para corregir, de más barato a más caro:**
1. Cortar en edición.
2. ArgoLink edit sobre el clip original, más la foto real del objeto (~US$1,17 por 4 s). Sirve para un solo objeto mal.
3. Cuadro original editado con nano-banana, mostrado a Santy, y regenerar con ese cuadro como guía.
4. Regenerar con el prompt corregido.

**Lo que el edit NO hace:**
- No cambia objetos chicos del fondo ni un objeto que ya está (un vaso por una taza).
- Una vez bajó el bitrate. Comparar siempre con `ffprobe`.

**Toda edición se hace sobre el ORIGINAL**, nunca sobre algo ya editado.

### 0.6 La persona no habla y no se parece a nadie real [comprobado]

- "He/She never talks, mouth stays closed". La voz va en off, después.
- Para cambiar a la persona de un video de referencia hay que difuminar la cara en el video (ver 3.1) y describir a la persona nueva. Si no, copia ojos, cejas, nariz y labios.
- No-Baza: personas lindas y aspiracionales; chicos facheros y chicas jóvenes muy atractivas. Nunca torso descubierto ni piel enrojecida: escribir "normal skin color (no red face)".

### 0.7 Textos y audio del montaje [comprobado]

**Baza:**
- Texto naranja en forma de T (`style: "baza"`) con su sonido: bell para el nombre del producto y teclas que se alternan, nunca la misma repetida.
- Voz corrida sin huecos que termina en "Baza. Tu hogar, tu estilo", y outro completa.

**No Baza:**
- Texto `style: "tiktok"`: TikTok Sans Medium, mayúscula inicial, trazo negro de 7 px, 44 px, sin sonidos.
- Música elegida por Santy con el método de `busqueda-audios.md`.

**Siempre:**
- Audio de los clips IA bajado entre −8 y −13 dB.
- Textos fuera del cuarto inferior de la pantalla y fuera de la franja de los botones.
- En los prompts nunca se piden textos ni subtítulos: Seedance se vuelve loco.

---

## 1. Historia con chica (UGC narrado): cafeteras Baza [comprobado]

| Límite | Solución |
|---|---|
| Chica poco atractiva o con cara "IA" | Describirla en detalle: joven, "cheta", cuerpo como la de la aspiradora B12, cara como la de la cafetera rosa. Si la primera generación no sale muy atractiva, el clip no va. |
| Manos lentas | 0.4 |
| Tazas y objetos que cambian | Biblia de continuidad: una imagen por recipiente en cada plano (0.3) |
| Mecanismos inventados (portacápsulas que se desmonta, cápsula al revés) | Mostrar solo cargar la cápsula o el café en el portacápsulas. Pasar la foto real de cada cápsula (KitKat, Nespresso). Seedance tiende a usar el portacápsulas cuadrado de DG para todo: nombrar cuál va en cada plano. |
| Agua de la canilla | Siempre potable: jarra filtrante, filtro en la canilla o bidón |
| Pacing | Edición: entrar a la acción a mitad del recorrido; ~5 cuadros después de cada acción; lo importante (café cayendo) ~2 s; cortes de 0,7–0,8 s. Referencia: `cafetera-rosa.mp4` |
| Voz con huecos o cortada | Medir el corte, escribir el guion con palabras de más, generar la voz entera y comprimir las pausas a 0,15 s cortando solo en silencios reales (`silencedetect`) |
| Outro | `outro720.webm`, `speed: 1.28`, `at = finVideoChica − 57` a 30 fps, `duration: 120` |

## 2. Habla a cámara (reseña, testimonio) [sin validar]

| Límite | Solución propuesta (investigación en `investigacion-lipsync-seedance.md`) |
|---|---|
| Seedance no reproduce el audio subido: genera una voz nueva | Pasar un video negro con el audio de ElevenLabs en `reference_videos`, con duración en segundos enteros, igual a la del clip. Etiquetarlo en el prompt: "lip-sync dialogue to @Video 1". |
| Lipsync con temblor o corrido | Primer plano de pecho para arriba, cámara fija, sin giros de cabeza, frase corta (≤13 s) y común, en castellano, sin nombres en inglés. 2–3 intentos. En la edición, reemplazar el audio por el original de ElevenLabs. |
| Alternativa con la voz exacta | Lipsync de video a video (Sync Lipsync 3 o Kling Lipsync en Higgsfield) sobre un clip de Seedance. Es Higgsfield: avisarle antes a Santy. |
| Guion que suena a anuncio | Escribir como habla una persona: "me lo compré porque…", voseo y cortes de frase. |

## 3. Vida real (situación de uso) y método de video de referencia: Skullcandy gym [comprobado]

### 3.1 Conseguir el movimiento real de la persona (ejercicio, pose de espejo)

1. **Buscar un video REAL** del movimiento exacto con Apify:
   - TikTok: `clockworks~tiktok-scraper` con `searchQueries`, por ejemplo "lat pulldown form", "seated dumbbell shoulder press", "gym mirror selfie pump".
   - Instagram: `apify~instagram-hashtag-scraper`, reels.
   - Bajar los candidatos (`shouldDownloadVideos` / `mediaUrls` con Bearer) y armar una hoja de miniaturas para elegir.
2. **Criterios para elegir el video:**
   - Ejercicio NORMAL, con peso creíble y forma correcta.
   - Cámara de celular fija, sin cortes, con un encuadre parecido al que queremos.
   - No hace falta que sea el más visto.
   - Nunca powerlifting con cargas enormes ni torso descubierto.
3. **Recortar el tramo** útil a ~4 s enteros con ffmpeg, sin cuadros negros.
4. **Difuminar la cara y la cabeza** de la persona real en todo el tramo: ffmpeg `boxblur` sobre la zona de la cabeza, siguiendo cada plano. En el prompt: "The head area in @Video 1 is blurred on purpose: never copy that person". Sin esto copia la identidad.
5. **Tapar el texto o los subtítulos** del original si los hay, y decir "No on-screen text, captions or watermarks (ignore the text in @Video 1)".

### 3.2 Armar las referencias

Orden de las imágenes, que se nombran en el prompt:

1. **Cara:** cuadro de nuestra persona de un plano aprobado (`face_ref.jpg`).
2. **Ropa:** cuerpo y ropa sin cara, armado con nano-banana (`outfit_ref.jpg`).
3. **Cómo se pone el producto:** recorte del cuadro editado con nano-banana (oreja con el Indy bien puesto), agrandado a ≥600 px.
4. **Lugar:** cuadro del gym aprobado (`gym_espejo.png`).
5. **Producto:** fotos oficiales del producto.

Y el video de referencia (`@Video 1`), con la cara difuminada.

### 3.3 Prompt (estructura que funcionó)

> Vertical 9:16 video, 4 seconds, recreate @Video 1: ONE continuous shot, same camera position, same framing, the same [movimiento] with the same rhythm, real-time pace. Normal believable weight. Real phone video look: [bloque 0.1]. No on-screen text… The head area in @Video 1 is blurred on purpose: never copy that person.
> PERSON: the young man of @Image 1 (… @Image 1 is the only face reference). Clothes exactly like @Image 2: … Normal skin color, mouth closed, he never talks.
> EARBUD: … worn exactly like @Image 3 (…). @Image 3 is only a reference of how it is worn, not a shot.
> PLACE: the same gym as @Image 4; @Image 4 is only a reference for the place.
> SOUND: [sonidos reales del lugar]. No voice, no music.

**Errores que corrigió esta estructura:**
- Si no se dice "only a reference, not a shot", Seedance convierte el recorte en un plano. Inventó un primerísimo primer plano de la oreja.
- En la prueba 2, entre los dedos quedaron los auriculares del original. Hace falta un cuadro guía más grande del producto en la mano.
- Escribir "not curly", "no red face" o "NOT round button earbuds" cuando el modelo tiende a otra cosa.

### 3.4 Planos que no necesitan video de referencia

**Preparación en el cuarto** (p01): solo texto, más las fotos del producto. Describir:
- el lugar argentino vivido;
- el sol quemando la cama;
- dos cortes con acciones de 1 s (atarse la zapatilla, agarrar la mochila y el estuche).

**Detalle del producto** (p02, p08):
- Cerca, con la mano rápida.
- Para el plano del producto solo en la cama (p08): "@Image 1 (the scene to recreate)" con el cuadro del lugar, cámara a mano lenta "gentle handheld push-in and slight arc… tiny natural hand shake", "Nothing moves except the camera. Nothing else on the bed".

**Espejo del gym** (g04c):
- Video de referencia de una selfie al espejo con el celular tapando la cara.
- Cuadro guía con nano-banana con el short correcto.
- "His physique looks pumped… full arms and chest under the fitted t-shirt".
- La pose es suave y natural, mostrando el brazo, nada de culturista.

### 3.5 Guion (por qué funciona)

Ver `metodo-guion-sin-referencia.md`: identidad aspiracional, cada plano demuestra un beneficio y el texto solo le pone nombre, arco del día y final con recompensa.

## 4. En mano (Kodak) y fotos estilo digicam [comprobado]

### 4.1 Planos de manos con el producto

**Unboxing (v4, la que funcionó):**
- Pasar solo 2 recortes pegados al objeto, sacados de un unboxing real: la caja cerrada y la caja abierta por arriba. Sin el cuarto ni las uñas de la creadora.
- La foto oficial del producto en el color correcto, como verdad del color.
- El resto (bolsita, tarjeta, etiqueta con cadenita) descrito con palabras, paso a paso.
- En el prompt: "ignore the hands and nails in those images", "plain WHITE sheet", "camera ALWAYS MATTE BLACK".

**Qué no hacer:**
- No recolorear el producto con máscara HSV: mancha la piel de las manos.
- Recortar para que el producto de otro color casi no aparezca.
- No usar la foto de la caja de otro color. Con la FZ55 azul, salió la caja equivocada.

**Bloqueo nsfw:** pasó con "hands… just above a bed" junto con fotos de chicas. Se resolvió con "plain soft white linen fabric" en vez de "bed". No se cobra.

**Continuidad:** unboxing, encendido y galería sobre la misma sábana blanca con luz de ventana.

**Galería en la pantalla:** las fotos van en `image_urls`/`reference_images` y aparecen en la pantalla, en orden y con la flechita. Plano detalle del dorso sobre tela blanca.

### 4.2 Fotos "sacadas con la cámara" con nuestra chica (método aprobado: "ahora sí se nota mucho más real")

Tandas anteriores:
- Fotos inventadas desde cero: muy nítidas y limpias, se nota la IA. Rechazado.
- Pinterest como "estilo": la IA reinterpreta, cambia el ángulo y saca los defectos.

**Procedimiento:**

1. **Moldes:** buscar fotos reales de Pinterest con Apify, del tipo de foto que saca esa cámara: digicam de noche con flash, espejo, amigas, playa al atardecer, cortina roja. Elegir moldes con defectos reales. Moldes usados: p02 besito de noche, p15 espejo con remera amarilla, p05 cortina roja, p24 amigas de día con tragos, p26 atardecer en la playa.
2. **Imágenes que se pasan**, en este orden:
   1. recorte de la cara de nuestra chica (sacado de un clip aprobado, por ejemplo el cuadro de 2,1 s de la selfie de Palermo);
   2. plano medio de nuestra chica;
   3. el molde.
3. **El prompt pide EDITAR la imagen 3, no crear.** Lo que se mantiene, bajo "KEEP IDENTICAL":
   - encuadre, ángulo y fondo;
   - objetos;
   - **flash quemado** (cara y frente blanquecinas, brillo en la piel);
   - **caída a oscuro** (el fondo se pierde en negro detrás del flash);
   - **color de la cámara** (dominantes, saturación, balance de blancos);
   - **movimiento o cámara movida** (estela, doble contorno);
   - **desenfoque** (foco errado o suave);
   - **ruido** (grano digital en las sombras);
   - **compresión** (artefactos JPEG, bloques);
   - **ojos rojos** si los tiene;
   - **poses**.
4. **"CHANGE ONLY THE PEOPLE":**
   - nuestra chica reemplaza a la protagonista;
   - todas las demás personas del molde pasan a ser inventadas, nunca queda nadie real;
   - ropa distinta a la del molde.
5. **Calidad de la cara:** "her face at the SAME LOW QUALITY as the rest of the photo": sin poros, sin pecas, sin pestañas nítidas, sin retoque. La cara hiperrealista con pecas delata la IA.
6. **Revisión:**
   - Comparar el molde contra el resultado lado a lado.
   - A veces queda una persona real del molde (pasó con el chico de atrás en la foto 3). Se rehace editando el RESULTADO y pidiendo cambiar solo esa persona.
   - Verificar que los defectos sigan ahí.
7. **Filtro de seguridad:** rechazó un molde de espejo con top lencero. Se cambia de molde, no se insiste.
8. **Herramienta:** en su momento fue GPT Image por Codex CLI (plan de ChatGPT de Santy). Hoy se puede hacer con nano-banana-pro de ArgoLink (US$0,03) con el mismo prompt [sin validar con nano: comparar con una foto antes de hacer la tanda].

### 4.3 Selfie con el producto (Palermo)

- Pasar solo las vistas del dorso de la cámara (0.2).
- Luz lavada de iPhone, sin rim light.
- Tanques de agua porteños: "stainless-steel and white plastic water tanks… NO round wooden New York water towers".
- Elegida: Seedance v2 (`17e3f51e…`). Wan se desplaza como cámara en mano.

## 5. Copia de viral [comprobado]

1. Buscar el viral con Apify. El criterio de elección está en la memoria del proyecto:
   - primero el mismo producto;
   - si no hay, el más parecido VISUAL y estéticamente y por público;
   - que sea reciente.
2. Dividir el viral en planos detectando los cortes (ffmpeg `scdet`/`select='gt(scene,0.3)'`) y generar cada clip de 1–2 planos con ese tramo como `reference_videos`.
3. Referencias:
   - cara difuminada (3.1);
   - cuadro del viral editado con nano-banana con NUESTRO producto en su lugar, sin cambiar a la persona en el cuadro porque queda poco realista (la persona nueva la hace Seedance);
   - fotos del producto;
   - persona nueva descrita.
4. No copiar textos ni subtítulos del original. Los textos se ponen después en Remotion.
5. Cambiar el lugar es difícil; se puede dejar el original.
6. Audio: el del viral, en la app al publicar, o el elegido con `busqueda-audios.md`.
7. Verificar el producto en TODOS los planos, porque se cuela el del original, y que la persona sea otra, mirando ojos, cejas, nariz y labios.

## 6. Satisfactorio / ASMR [sin validar como formato entero; comprobado en planos sueltos]

- Planos muy cerca, cámara fija, acción de 1 s y resultado apetitoso (café cayendo ~2 s, cápsula encastrando con su "tlac").
- Pedir sonidos reales y concretos en SOUND ("the capsule clicks into the holder, the spoon taps the ground coffee"). Si el sonido IA sale raro, reemplazarlo en el montaje por un sonido real (carpeta "Baza reels sonidos" o grabado) y bajar el del clip.
- Audio del clip a ~−8 dB cuando el ASMR suma.

## 7. Comparación / antes-después [sin validar]

- Para el antes, generar el problema creíble y no exagerado (mancha real, no "suciedad artificial") con fotos de referencia reales de ese problema buscadas en Google.
- Nunca comparar contra un producto mejor ni mostrar logos de la competencia; si aparece uno, se saca con ArgoLink edit.
- Misma locación, ángulo y luz en el antes y el después: el antes es un cuadro y el después se genera con ese cuadro como guía de lugar.

## 8. POV / situación graciosa [sin validar]

- Sin diálogo: el chiste va en el texto en pantalla y en la acción, porque el timing cómico y la voz IA fallan.
- Acción en planos de 4–5 s con remate visual claro; producto visible en el remate.

## 9. Customización [sin validar]

- Plano 1: el producto crudo, con las fotos oficiales.
- Plano 2: el tuneado, con un cuadro guía editado con nano-banana (stickers o funda) que no tape la forma ni el logo.
- Aclarar en el texto que lo tuneado no viene incluido.

## 10. Carrusel de fotos / slideshow [sin validar]

- Mismo método de fotos de 4.2 (moldes reales y defectos), con 5–8 fotos y nuestra persona y producto.
- Texto corto en la primera foto y audio en tendencia elegido con `busqueda-audios.md`.
- Montaje en Remotion: cada foto ~0,7–1 s, al ritmo de la música.

---

## Checklist final antes de entregar (todos los formatos)

1. Pasar el Filtro de la planilla `mapa-anuncios`: puntaje ≥75, y ningún 0 en "producto fiel" ni en "sin errores de IA".
2. Cuadros cada ~0,5 s con zoom al 100 % en manos, producto, ropa y objetos, comparados contra la biblia de continuidad.
3. `ffprobe`: 720p y bitrate igual o mayor que el original en todo lo editado.
4. Registrar el video en la pestaña Videos con su nombre FORMATO · GANCHO · AUDIO y el costo.
