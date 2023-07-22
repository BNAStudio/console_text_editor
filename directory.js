const fs = require('fs');
const path = require('path');

class Directory {
    constructor() {
        this._dir = 'docs';
        this._path = __dirname;
        this.createDocsDir(); // valida si existe o no, y si no, crea la carpeta
    }

    /**
     * Crea la ruta de acuerdo a los argumentos suministrados
     */
    createDocsDir() {
        this._path = path.join(this._path, this._dir, ''); // une segmentos de ruta en una sola valida y unificada
        if (!fs.existsSync(this._dir)) {
            fs.mkdirSync(this._dir)
        }
    }

    /**
     * 
     * @returns ruta
     */
    getPath() {
        return this._path;
    }

    /**
     * Crea una abreviacion de la ruta 
     * @returns ruta abreviada
     */
    getShortPath() {
        const paths = path.parse(this._path); // descomponen en partes la ruta
        let delimiter = '/';

        if (paths.dir.indexOf(delimiter < 0)) {
            // Valida si es slash normal / o slash invertido \
            delimiter = `\\`; // se coloca doble para especificar que el segundo slash invertido es el caracter que se desea buscar y no un escape
        }

        return `${paths.root}...${delimiter}${paths.name}`
    }

    /**
     * Obtiene e imprime la ruta actual del documento
     */
    getFilesInDir() {
        const files = fs.readdirSync(this._path); // Obtiene archivos de una carpeta
        let n = 0;

        console.log(`
        =======================================
        Ubicacion: ${this.getShortPath()}
        =======================================
        `);

        files.forEach(file => {
            if (file != 'DS_store') {
                console.log(`   ${file}`);
                n++;
            }
        })
    }

}

module.exports = Directory;