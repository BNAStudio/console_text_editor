const fs = require('fs');
const path = require('path');

class Directory {
    constructor() {
        this._dir = 'docs';
        this._path = __dirname;
        this.createDocsDir(); // valida si existe o no, y si no, crea la carpeta
    }

    createDocsDir() {
        this._path = path.join(this._path, this._dir); // une segmentos de ruta en una sola valida y unificada
        if (fs.existsSync(this._dir)) {
            fs.mkdir(this._dir)
        }
    }

    getPath() {
        return this._path;
    }

    getShortPath() {
        const paths = path.parse(this._path); // descomponen en partes la ruta
        let delimiter = '/';

        if (paths.dir.indexOf(delimiter < 0)) {
            // Valida si es slash normal / o slash invertido \
            delimiter = `\\`; // se coloca doble para especificar que el segundo slash invertido es el caracter que se desea buscar y no un escape
        }

        return `${paths.root}...${delimiter}${paths.name}`
    }

    getFilesInDir() {
        const files = fs.readdirSync(this._path); // Obtiene archivos de una carpeta
        let n = 0;

        console.log(`
        =======================================
            Ubicacion: ${this.getShortPath}
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