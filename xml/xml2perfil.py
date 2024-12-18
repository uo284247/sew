import xml.etree.ElementTree as ET

# Definir el tamaño del SVG y márgenes
SVG_WIDTH = 800
SVG_HEIGHT = 350
PADDING = 10
GRAPH_WIDTH = 735

# Cargar el archivo XML
arbol = ET.parse('circuitoEsquema.xml')
raiz = arbol.getroot()

# Variables para almacenar las distancias y altitudes
altitudes = []
ejex = []

# Recorrer los tramos del circuito
eje_x = 0
for tramo in raiz.findall('./{*}tramos/{*}tramo'):
    # Obtener la altitud
    altitud = float(tramo.find('./{*}coordenadas/{*}altitud').text)
    
    # Guardar los valores en las listas
    altitudes.append(altitud)
    ejex.append(eje_x)
    eje_x += 15  

max_altitud = max(altitudes)
min_altitud = min(altitudes)

puntos = []

rango_base = 20  # Valor base desde el cual partir
rango_superior = SVG_HEIGHT - 2.5 * PADDING

for altitud, x in zip(altitudes, ejex):
    y_normalizado = (altitud - min_altitud) / (max_altitud - min_altitud) * (rango_superior - rango_base)
    y = rango_base + y_normalizado

    y = SVG_HEIGHT - PADDING - y
    puntos.append(f"{x + PADDING},{y}")  # Añadir padding a x también

# Crear el archivo SVG
svg_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{SVG_WIDTH}" height="{SVG_HEIGHT}" viewBox="0 0 {SVG_WIDTH} {SVG_HEIGHT}">
    <polyline style="fill:none;stroke:red;stroke-width:4" points="{' '.join(puntos)}" />
    <rect x="{PADDING}" y="{PADDING}" width="{GRAPH_WIDTH}" height="{SVG_HEIGHT - 2 * PADDING}" style="fill:none;stroke:red;stroke-width:4" />
    <text x="{GRAPH_WIDTH }" y="{5+SVG_HEIGHT / 2}" font-size="14" text-anchor="middle" transform="rotate(-90 {GRAPH_WIDTH + 20},{SVG_HEIGHT / 2})">Altitud (m)</text>
    
    <!-- Añadir las etiquetas de altitud a la derecha -->
    {"".join(
        f'<text x="{GRAPH_WIDTH + 35}" y="{SVG_HEIGHT - PADDING - (y_normalizado + rango_base)}" font-size="12" text-anchor="start">{altitud:.1f}</text>'
        for altitud, y_normalizado in zip(altitudes, [(altitud - min_altitud) / (max_altitud - min_altitud) * (rango_superior - rango_base) for altitud in altitudes])
    )}
</svg>"""

# Guardar el archivo SVG
with open('altimetria.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

print("SVG generado con éxito: altimetria.svg")
