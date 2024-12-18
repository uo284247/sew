import xml.etree.ElementTree as ET 


def verXML(archivoXML):
    try:
        arbol = ET.parse(archivoXML)
    except IOError:
        print("No se encuentra el archivo", archivoXML)
        exit()
    except ET.ParseError:
        print("Error procesando en el archivo XML =", archivoXML)
        exit()

    raiz = arbol.getroot()
    
    # Crear una cadena para almacenar las coordenadas en formato KML
    coordinates_string = []

    # Extraer coordenadas de tramos
    for tramo in raiz.findall('./{*}tramos/{*}tramo'):
        longitud_text = tramo.find('./{*}coordenadas/{*}longitud_coordenadas').text 
        latitud_text = tramo.find('./{*}coordenadas/{*}latitud').text 
        altitud_text = tramo.find('./{*}coordenadas/{*}altitud').text
        
        

        # Convertir y almacenar las coordenadas en formato (longitud, latitud, altitud)
        coordinates_string.append(f"{longitud_text},{latitud_text},0.0")

    # Unir todas las coordenadas en un solo string separado por saltos de línea
    return '\n'.join(coordinates_string)

class Kml(object):
    def __init__(self):
        self.raiz = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
        self.doc = ET.SubElement(self.raiz, 'Document')

    def addLineString(self, nombre, listaCoordenadas, modoAltitud, color, ancho):
        pm = ET.SubElement(self.doc, 'Placemark')
        ET.SubElement(pm, 'name').text = nombre
        ls = ET.SubElement(pm, 'LineString')
        ET.SubElement(ls, 'extrude').text = '1'
        ET.SubElement(ls, 'tessellation').text = '1'
        ET.SubElement(ls, 'coordinates').text = listaCoordenadas
        ET.SubElement(ls, 'altitudeMode').text = modoAltitud
        
        # Estilo para la línea
        estilo = ET.SubElement(pm, 'Style')
        linea = ET.SubElement(estilo, 'LineStyle')
        ET.SubElement(linea, 'color').text = color
        ET.SubElement(linea, 'width').text = ancho

    def escribir(self, nombreArchivoKML):
        arbol = ET.ElementTree(self.raiz)
        arbol.write(nombreArchivoKML, encoding='utf-8', xml_declaration=True)

def main():
    # Nombre del archivo XML que contiene los datos
    miArchivoXML = 'circuitoEsquema.xml'
    listaCoordenadas = verXML(miArchivoXML)

    # Crear un nuevo archivo KML
    nombreKML = 'rutaCircuito.kml'
    nuevoKML = Kml()

   

    # Añadir la línea al KML
    nuevoKML.addLineString(
        nombre='Ruta del Circuito',
        listaCoordenadas=listaCoordenadas,
        modoAltitud='relativeToGround',
        color='#ff0000ff',  # Color de la línea (rojo)
        ancho='5'  # Ancho de la línea
    )
    
    # Crear el archivo KML
    nuevoKML.escribir(nombreKML)
    print("Archivo KML creado:", nombreKML)

if __name__ == "__main__":
    main()
