from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter

F='Arial'
H=Font(name=F,bold=True,color='FFFFFF',size=10); HF=PatternFill('solid',fgColor='D84515')
B=Font(name=F,size=10); BB=Font(name=F,size=10,bold=True)
IN=Font(name=F,size=10,color='0000FF'); YF=PatternFill('solid',fgColor='FFF2CC')
T=Font(name=F,size=14,bold=True)
thin=Side(style='thin',color='DDDDDD'); BD=Border(bottom=thin)
W=Alignment(wrap_text=True,vertical='top')

wb=Workbook()
def sheet(name,headers,rows,widths,first=False):
    ws=wb.active if first else wb.create_sheet()
    ws.title=name
    ws.append(headers)
    for c in ws[1]: c.font=H; c.fill=HF; c.alignment=Alignment(wrap_text=True,vertical='center')
    for r in rows: ws.append(r)
    for row in ws.iter_rows(min_row=2):
        for c in row: c.font=B; c.alignment=W; c.border=BD
    for i,w in enumerate(widths,1): ws.column_dimensions[get_column_letter(i)].width=w
    ws.freeze_panes='B2'; ws.row_dimensions[1].height=30
    return ws

# ---------- Cómo usar ----------
ws=wb.active; ws.title='Cómo usar'
lines=[
("Mapa de anuncios · Reels y TikTok (Baza, Game Station, Power Case)",T),
("",B),
("Para qué sirve",BB),
("1) Diferenciar cada tipo de anuncio que hacemos y que hay en el mercado.",B),
("2) Ver qué combinaciones todavía no probamos (pestaña Matriz) e inventar híbridos (pestaña Híbridos).",B),
("3) Filtrar videos buenos y malos con un mismo criterio antes de copiar o entregar (pestaña Filtro).",B),
("4) Registrar cada video y sus resultados para saber qué funciona por producto y por cuenta (pestaña Videos).",B),
("",B),
("Cómo se nombra un anuncio",BB),
("FORMATO · GANCHO · AUDIO   →   ej.: \"Historia con chica · Todos los usos · Voz\"",B),
("Formato = quién o qué se ve. Gancho = cómo agarra en el primer segundo y medio. Audio = qué se escucha.",B),
("Regla de prueba: por producto hacer 2–3 variantes cambiando UNA sola de las tres partes, así se sabe qué hizo la diferencia.",B),
("Recordatorio: 20 % idea, 80 % ejecución. El nombre ordena la idea; la ejecución se controla con el Filtro (puntaje mínimo para entregar: 75).",B),
("",B),
("Qué completar",BB),
("Videos: una fila por video. Se completan las celdas amarillas (marca, producto, formato, gancho, audio, fecha, resultados). El nombre y las columnas grises se calculan solos.",B),
("Formato, Gancho y Audio se eligen de la lista desplegable (sale de las pestañas Formatos, Ganchos y Audio). Para sumar un tipo nuevo, agregarlo al final de esa pestaña.",B),
("Filtro: poner 0, 1 o 2 en cada criterio para el video que se evalúa (columna amarilla). El puntaje sale solo.",B),
("Matriz: no se toca; cuenta sola cuántos videos hay de cada formato por marca. Los ceros son lo que todavía no probamos.",B),
]
for i,(t,f) in enumerate(lines,1):
    c=ws.cell(row=i,column=1,value=t); c.font=f; c.alignment=Alignment(wrap_text=True,vertical='top')
ws.column_dimensions['A'].width=130

# ---------- Formatos ----------
fmt=[
# (ID, Familia, Formato, Qué se ve, Cómo está en el mercado, Nuestra versión / qué hacemos distinto, Estado nuestro, Límite con IA, Dificultad IA, Queda mejor para, Qué lo hace bueno, Qué lo hace malo, Marcas, Ejemplos nuestros)
("F1","UGC","Historia con chica (UGC narrado)","Chica muy atractiva en su casa vive un momento (mañana, escritorio, merienda) y en el medio usa el producto mostrando cada función con su resultado. Voz en off que cuenta la historia; nadie habla a cámara.","El UGC del mercado suele ser alguien hablando a cámara o un demo plano. Pocas marcas hacen historia + demo con voz en off.","Es NUESTRO formato: historia con contexto (lugar lindo, chica cheta, pacing alto) + todos los usos + plano de abundancia + outro Baza.","Lo hacemos","Manos lentas, objetos que cambian entre planos, mecanismos no documentados. Se resuelve con guion de acciones de 1 s, referencias por objeto y QA.","Media","Electrodomésticos con varios usos o resultados lindos (cafeteras, sandwicheras, aspiradoras).","Cada uso con su resultado visible; cortes cada 0,7–0,8 s; chica linda y natural; abundancia; voz sin huecos.","Manos tipo IA; tazas que cambian; pasos de primer uso; voz cortada.","Baza (principal)","Cafetera rosa, cafetera negra v2"),
("F2","UGC","Habla a cámara (reseña/testimonio)","Persona mirando a cámara: \"me compré esto y…\", reseña honesta, recomendación.","Es el UGC más común en TikTok y Reels; funciona por confianza y cercanía.","No lo hacemos todavía.","Límite fuerte: lipsync y voz IA se notan (ElevenLabs a veces sale mal). Probar recién con lipsync muy bueno o planos cortos.","Alta","Productos que necesitan explicación o confianza (precio alto, uso nuevo).","Persona creíble, primera frase gancho, tono argentino natural.","Lipsync malo; guion que suena a anuncio; persona tiesa.","Baza, Game Station",""),
("F3","UGC","GRWM / rutina","\"Get ready with me\" o rutina (mañana, noche, skincare, outfit) con el producto en el medio.","Muy usado en Reels por chicas; el producto aparece natural en la rutina.","Cerca de lo que hacemos (historia), pero en primera persona y con más vida cotidiana.","Sin probar","Mismos que F1; más planos = más riesgo de continuidad.","Media","Cuidado personal, afeitadora, secador, cafetera de la mañana.","Rutina real y aspiracional; ritmo rápido; producto como paso clave.","Rutina larga sin producto; demasiados pasos.","Baza",""),
("F4","UGC","Unboxing / primera impresión","Abrir la caja y reaccionar; primeras pruebas.","Clásico de tecnología y regalos.","Lo usamos en parte (caja en algunos planos), nunca como formato entero.","No mostrar el interior de la caja sin fotos reales; packaging de Baza solo si está en Drive.","Media","Tecnología, regalos, productos con buena caja.","Caja linda y real; reacción creíble; producto que sorprende.","Caja inventada; interior falso.","Game Station, Baza",""),
("F5","Producto","En mano","Solo manos y producto, sin cara. El texto lleva el mensaje.","Muy usado en gadgets y Mercado Libre; barato de producir.","Lo hicimos con la Kodak (con música y frase de identidad).","Probado una vez","Manos IA raras si el plano es largo; producto tiene que ser fiel.","Baja","Productos chicos y lindos de ver (cámaras, auris, accesorios).","Producto lindo; frase de identidad fuerte; lugar con contexto (auto, cama, viaje); música.","Producto feo o borroso; texto largo.","Game Station, Power Case, Baza (ML)","Kodak FZ55"),
("F6","Producto","Satisfactorio / ASMR","Primeros planos del producto funcionando; el sonido es protagonista.","Muy fuerte en cocina y limpieza.","Lo usamos como planos sueltos dentro de F1 (cápsula, cucharita), nunca entero.","Sin probar","Sonidos IA a veces raros; reemplazar o reforzar con sonidos reales.","Media","Cafeteras, limpieza, cocina.","Sonido real y nítido; planos muy cerca; resultado apetitoso.","Sonido falso; planos largos sin cambio.","Baza",""),
("F7","Producto","Comparación / antes-después","Problema y solución, o lado a lado contra lo que usabas.","Muy usado en limpieza y belleza.","No lo hacemos. Regla: nunca contra productos mejores ni mostrando logos de la competencia.","Sin probar","El \"antes\" generado puede parecer exagerado o falso.","Media","Limpia tapizados, organización, cocina.","Problema reconocible en 1 s; resultado claro y creíble.","Antes exagerado; comparar contra algo mejor.","Baza, Power Case",""),
("F8","Escena","Vida real (situación de uso)","Una persona en una situación cotidiana del público, con el producto usándose. No habla: cada plano demuestra un beneficio y el texto le pone nombre.","Lo hacen marcas deportivas y tech; poco en marcas chicas.","Lo inventamos como híbrido para el Skullcandy (gym).","Probado una vez","Producto mal puesto (auricular al revés) y ropa que cambia: guía con imagen editada y referencia de outfit.","Media-alta","Productos de una actividad (gym, viaje, oficina, gaming, facu).","Identidad aspiracional; arco del día; look celu; continuidad.","Situación forzada; persona poco atractiva; beneficio dicho y no mostrado.","Game Station (principal), Baza","Skullcandy Indy Evo"),
("F9","Escena","POV / situación graciosa","\"POV: cuando…\" o sketch corto donde el producto es la solución o el remate.","Muy viral en TikTok, público joven.","No lo hacemos.","Actuación y timing cómico difíciles con IA; mejor sin diálogo, con texto.","Media","Consumo masivo y tecnología para jóvenes.","Situación muy reconocible; remate rápido.","Chiste largo; producto que no aparece.","Game Station, Baza",""),
("F10","Tendencia","Copia de viral","Viral o meme del momento recreado con nuestro producto (texto, acción y audio).","La base de muchos videos de volumen.","Lo hicimos con la Kodak (\"regalo soñado\"); método de video de referencia aprobado.","Probado una vez","Hay que cambiar persona y producto en todos los planos; no copiar textos del original.","Baja","Cualquier producto que entre en el chiste o formato.","Viral reciente; mismo público y estética; producto bien integrado.","Viral viejo; producto que no tiene que ver.","Game Station, Power Case","Kodak regalo soñado"),
("F11","Tendencia","Customización","Producto crudo y después tuneado (stickers, fundas, setup), aclarando que lo tuneado no viene incluido.","Muy usado en cámaras y consolas.","No lo hacemos.","El tuneo generado puede tapar o deformar el producto.","Media","Cámaras, consolas, auris, gadgets.","Transformación grande; producto reconocible.","Tuneo que tapa el producto.","Game Station",""),
("F12","Tendencia","Carrusel de fotos / slideshow","Secuencia de fotos con texto y música en tendencia (TikTok photo mode).","Muy barato y fuerte en TikTok.","No lo hacemos.","Fotos IA con cara muy nítida se notan; usar defectos de digicam.","Baja","Cualquier producto con fotos lindas; volumen.","Fotos reales/creíbles; texto corto; audio en tendencia.","Fotos IA perfectas; demasiado texto.","Game Station, Baza",""),
]
ws=sheet('Formatos',["ID","Familia","Formato","Qué se ve","Cómo está en el mercado","Nuestra versión / qué hacemos distinto","Estado nuestro","Nuestro límite con IA","Dificultad IA","Queda mejor para","Qué lo hace bueno","Qué lo hace malo (filtro)","Marcas","Ejemplos nuestros","Videos hechos","Solución (claude/soluciones-por-formato.md)"],fmt,[6,11,24,42,34,38,14,40,10,32,38,32,20,22,9,40])
for r in range(2,len(fmt)+2):
    ws.cell(row=r,column=15,value=f"=COUNTIF(Videos!$E:$E,C{r})").font=B
    sol={"F1":"§1 [comprobado] + §0","F2":"§2 [sin validar]: video negro con la voz + primer plano fijo","F3":"§1 + §0 [sin validar como formato]","F4":"§4.1 unboxing [comprobado]","F5":"§4 [comprobado]: recortes pegados al objeto, fotos digicam con moldes","F6":"§6 [planos sueltos comprobados]","F7":"§7 [sin validar]","F8":"§3 [comprobado]: video de referencia con cara difuminada + cara/ropa/producto/lugar","F9":"§8 [sin validar]","F10":"§5 [comprobado]","F11":"§9 [sin validar]","F12":"§10 [sin validar] con fotos de §4.2"}[ws.cell(row=r,column=1).value]
    c=ws.cell(row=r,column=16,value=sol); c.font=B; c.alignment=W

# ---------- Ganchos ----------
gan=[
("G1","Todos los usos","Arranca mostrando lo más llamativo y después recorre cada uso rápido.","Cafetera rosa: cápsula por cápsula."),
("G2","Frase de identidad","Texto que define al público o la ocasión: \"Los mejores auris para entrenar\", \"La camarita que te va a salvar las vacaciones\".","Kodak, Skullcandy."),
("G3","Situación/problema","Una escena que el público reconoce al toque (tipeando en el escritorio, cocina sucia, perdiste los auris).","Cafetera negra: chica tipeando."),
("G4","Resultado primero","Se ve el resultado final (café servido, piso limpio, foto linda) y después cómo se llegó.",""),
("G5","Precio/oferta","Precio o ventaja de precio en el primer segundo. Baza es muy barato: es un ángulo fuerte.",""),
("G6","Pregunta","Pregunta directa al público: \"¿Todavía usás…?\", \"¿Sabías que…?\".",""),
("G7","Súper gancho visual","Imagen exagerada o imposible que rompe el scroll (se permite romper el realismo solo en el gancho).",""),
("G8","Tendencia","El gancho es el del viral copiado (texto, acción o audio reconocible).","Kodak regalo soñado."),
]
sheet('Ganchos',["ID","Gancho","Cómo funciona","Ejemplos"],gan,[6,22,70,36])

# ---------- Audio ----------
aud=[
("A1","Voz","Voz en off (ElevenLabs), voseo argentino, sin huecos; en Baza termina con \"Baza. Tu hogar, tu estilo\"."),
("A2","Música","Música en tendencia de fondo que haga blend (ver claude/busqueda-audios.md). Siempre mandar links antes de montar."),
("A3","Original","Sonido ambiente y ASMR de los clips, sin música ni voz."),
("A4","Voz + música","Voz en off con música baja de fondo."),
("A5","Audio del viral","El audio original del viral copiado (diálogo, meme, canción)."),
]
sheet('Audio',["ID","Audio","Detalle"],aud,[6,18,90])

# ---------- Videos ----------
vid=[
("2026-10-21","Baza","Cafetera Cápsula 3en1 BZCF-0002R Rosa","Redes","Historia con chica (UGC narrado)","Todos los usos","Voz",28,"referencias/aprobados/cafetera-rosa.mp4",12,"Aprobado","El mejor ejemplo: chica, luz y pacing."),
("2026-10-23","Baza","Cafetera de cápsulas 3 en 1 Negra","Redes","Historia con chica (UGC narrado)","Situación/problema","Voz",None,"examples/negra/montaje-cafetera-negra-v2.json",8.57,"Aprobado","Gancho: chica tipeando en el escritorio. Generación con errores (tazas)."),
("2026-10-14","Game Station","Kodak PIXPRO FZ55","Redes","Copia de viral","Tendencia","Audio del viral",None,"kodak/gen/regalo-sonado-v1.mp4",None,"Hecho","Copia de \"A women's dream gift\" (esfuerzo bajo)."),
("2026-10-15","Game Station","Kodak PIXPRO FZ55","Redes","En mano","Frase de identidad","Música",None,"Downloads/Kodak FZ55 1.mp4",None,"Publicado","Sin cara; texto estilo TikTok; música en tendencia."),
("2026-10-26","Game Station","Skullcandy Indy Evo True Black","Redes","Vida real (situación de uso)","Frase de identidad","Música",17.8,"baza-video/skullcandy-we-do-what-we-want.mp4",11.07,"En revisión","Gym: preparación, detalle, jalón, press, espejo. Audio: We Do What We Want (slowed)."),
]
hdr=["Fecha","Marca","Producto","Canal","Formato","Gancho","Audio","Duración (s)","Archivo","Costo IA (US$)","Estado","Notas","Nombre del anuncio","Vistas","Likes","Guardados","Compartidos","Ventas atribuidas","Engagement %","Puntaje filtro"]
ws=sheet('Videos',hdr,[list(v)+[None]*8 for v in vid],[11,13,30,9,18,20,12,9,34,10,12,40,44,10,9,10,11,10,11,10])
N=200
for r in range(2,N+2):
    ws.cell(row=r,column=13,value=f'=IF(E{r}="","",E{r}&" · "&F{r}&" · "&G{r})')
    ws.cell(row=r,column=19,value=f'=IF(OR(N{r}="",N{r}=0),"",(O{r}+P{r}+Q{r})/N{r})')
    ws.cell(row=r,column=19).number_format='0.0%'
    for c in list(range(1,13))+list(range(14,19))+[20]:
        cell=ws.cell(row=r,column=c); cell.fill=YF; cell.font=IN
    for c in (13,19):
        ws.cell(row=r,column=c).fill=PatternFill('solid',fgColor='EEEEEE'); ws.cell(row=r,column=c).font=B
    ws.cell(row=r,column=10).number_format='0.00'
dv=lambda f: DataValidation(type='list',formula1=f,allow_blank=True)
for col,f in (('B','"Baza,Game Station,Power Case"'),('D','"Redes,Mercado Libre,Ambos"'),('E',"=Formatos!$C$2:$C$40"),('F',"=Ganchos!$B$2:$B$40"),('G',"=Audio!$B$2:$B$20"),('K','"Idea,En producción,En revisión,Aprobado,Publicado,Descartado"')):
    d=dv(f); ws.add_data_validation(d); d.add(f"{col}2:{col}{N+1}")

# ---------- Matriz ----------
ws=wb.create_sheet('Matriz')
marcas=["Baza","Game Station","Power Case"]
ws.append(["Formato"]+marcas+["Total","Estado","Familia","Límite con IA"])
for c in ws[1]: c.font=H; c.fill=HF
for i in range(len(fmt)):
    r=i+2
    ws.cell(row=r,column=1,value=f"=Formatos!C{r}")
    for j,m in enumerate(marcas):
        col=get_column_letter(j+2)
        ws.cell(row=r,column=j+2,value=f'=COUNTIFS(Videos!$E:$E,$A{r},Videos!$B:$B,{col}$1)')
    ws.cell(row=r,column=5,value=f"=SUM(B{r}:D{r})")
    ws.cell(row=r,column=6,value=f'=IF(E{r}=0,"Sin probar",IF(E{r}<3,"Pocas pruebas","Probado"))')
    ws.cell(row=r,column=7,value=f"=Formatos!B{r}")
    ws.cell(row=r,column=8,value=f"=Formatos!H{r}")
    for c in ws[r]: c.font=B; c.border=BD
rr=len(fmt)+3
ws.cell(row=rr,column=1,value="Ganchos por marca").font=BB
ws.cell(row=rr+1,column=1,value="Gancho").font=H; ws.cell(row=rr+1,column=1).fill=HF
for j,m in enumerate(marcas):
    c=ws.cell(row=rr+1,column=j+2,value=m); c.font=H; c.fill=HF
for i in range(len(gan)):
    r=rr+2+i
    ws.cell(row=r,column=1,value=f"=Ganchos!B{i+2}")
    for j in range(3):
        col=get_column_letter(j+2)
        ws.cell(row=r,column=j+2,value=f'=COUNTIFS(Videos!$F:$F,$A{r},Videos!$B:$B,{col}${rr+1})')
    for c in ws[r]: c.font=B; c.border=BD
for col,w in zip('ABCDEFGH',[30,12,14,13,8,16,11,70]): ws.column_dimensions[col].width=w
from openpyxl.formatting.rule import CellIsRule
ws.conditional_formatting.add(f"B2:D{len(fmt)+1}",CellIsRule(operator='equal',formula=['0'],fill=PatternFill('solid',fgColor='FCE4D6')))
ws.conditional_formatting.add(f"B{rr+2}:D{rr+1+len(gan)}",CellIsRule(operator='equal',formula=['0'],fill=PatternFill('solid',fgColor='FCE4D6')))

# ---------- Filtro ----------
crit=[
("Gancho","Corta el scroll en el primer 1,5 s (imagen, texto o audio)",3),
("Gancho","Se entiende sin sonido (texto o imagen alcanzan)",1),
("Idea","Lo que se ve ES lo que se vende (el beneficio se demuestra, no se dice)",3),
("Idea","Encaja con el público y el perfil de la cuenta (no nicho para Game Station)",2),
("Idea","No compara contra productos mejores ni ataca a la competencia",1),
("Persona","Persona atractiva, joven y aspiracional (si aparece)",2),
("Persona","Natural: gestos con sentido, manos imperfectas pero rápidas, nada tieso",2),
("Realismo","Look de celular creíble (gran angular, luz real, sin rim light de IA ni negros profundos)",2),
("Realismo","Producto fiel en TODOS los planos (forma, color, cómo se usa/pone)",3),
("Realismo","Continuidad: misma persona, ropa, lugar y objetos entre planos",2),
("Realismo","Sin errores de IA (objetos que aparecen, atraviesan, enchufes europeos, celular visible)",3),
("Edición","Pacing alto: cortes cada 0,4–0,8 s, entrando a la acción a mitad de recorrido",2),
("Edición","Audio: voz sin huecos o música que hace blend; clips IA bajados −8 a −13 dB",2),
("Edición","Textos en zona segura, cortos y del estilo correcto (Baza naranja / TikTok)",1),
("Cierre","Cierre claro: outro Baza o dónde comprar",1),
]
ws=sheet('Filtro',["Área","Criterio","Peso","Nota (0, 1 o 2)","Puntos"],crit,[12,80,8,14,9])
for r in range(2,len(crit)+2):
    ws.cell(row=r,column=4).fill=YF; ws.cell(row=r,column=4).font=IN
    ws.cell(row=r,column=5,value=f'=IF(D{r}="","",C{r}*D{r})')
d=DataValidation(type='whole',operator='between',formula1='0',formula2='2',allow_blank=True); ws.add_data_validation(d); d.add(f"D2:D{len(crit)+1}")
e=len(crit)+3
ws.cell(row=e,column=2,value="Puntaje (0–100)").font=BB
ws.cell(row=e,column=5,value=f'=IF(COUNT(D2:D{len(crit)+1})=0,"",ROUND(SUM(E2:E{len(crit)+1})/(2*SUM(C2:C{len(crit)+1}))*100,0))').font=BB
ws.cell(row=e+1,column=2,value="Veredicto").font=BB
ws.cell(row=e+1,column=5,value=f'=IF(E{e}="","",IF(E{e}>=75,"Entregar",IF(E{e}>=55,"Corregir","Descartar")))').font=BB
ws.cell(row=e+3,column=2,value="Uso: también sirve para evaluar virales ajenos antes de copiarlos. Un 0 en \"Producto fiel\" o \"Sin errores de IA\" no se entrega aunque el puntaje dé alto.").font=B
ws.cell(row=e+3,column=2).alignment=W

# ---------- Híbridos ----------
hib=[
("H1","Vida real + Satisfactorio","Arco del día con 2–3 primeros planos ASMR del producto funcionando en medio.","Baza (cafeteras: mañana antes de la facu)","Vida real · Situación/problema · Original + música baja","Sin probar"),
("H2","En mano + Customización","Unboxing en mano y corte al producto tuneado en su setup.","Game Station (auris, cámaras, joysticks)","En mano · Frase de identidad · Música","Sin probar"),
("H3","Historia con chica + Comparación","La chica sufre el problema (cocina sucia, café feo) y después la demo de usos.","Baza (limpia tapizados, cafeteras)","Historia con chica · Situación/problema · Voz","Sin probar"),
("H4","Tendencia + Vida real","Audio/meme en tendencia montado sobre una escena real del público con el producto.","Game Station","Copia de viral · Tendencia · Audio del viral","Sin probar"),
("H5","Satisfactorio + Precio","Solo ASMR del producto y al final el precio grande.","Baza (Mercado Libre)","Satisfactorio / ASMR · Precio/oferta · Original","Sin probar"),
("H6","POV + En mano","\"POV: …\" con manos y producto resolviendo la situación, sin cara.","Game Station, Power Case","POV / situación graciosa · Pregunta · Música","Sin probar"),
]
sheet('Híbridos',["ID","Mezcla","Idea","Para qué productos","Nombre propuesto","Estado"],hib,[6,30,60,34,46,12])

wb.save('mapa-anuncios.xlsx')
