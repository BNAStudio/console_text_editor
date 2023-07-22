const fs = require('fs');
const os = require('os');

class Document {
    constructor(dir) {
        this._content = '';
        this._isSaved = false;
        this._fileName = '';
        this._dir = dir;
    }

    /**
     * Comprueba si existe un archivo con el mismo nombre asignado
     */
    exist(name) {
        return fs.existsSync(`${this._dir}/${name}`);
    }
    
    /**
     * Almacena el texto ingresado por el usuario
     */
    append(text) {
        this._content = os.EOL + text; // os.EOL === \n, basicamente es un salto de linea
        this._isSaved = false;
    }
    
    /**
     * Almacena el documento, y si es el caso lo renombra
     */
    saveAs(name) {
        fs.writeFileSync(`${this._dir}/${name}`, this._content);
        this._isSaved = true;
        this._fileName = name;
    }
    
    /**
     * Almacena el documento conservando el nombre actual
     */
    save() {
        fs.writeFileSync(`${this._dir}/${this._fileName}`, this._content);
    }

    /**
     * Obtiene el contenido ingresado por el usuario
     */
    getContent() {
        return this._content;
    }

    /**
     * Comprueba si el documento tiene nombre
     */
    hasName() {
        if(this._fileName != ' ') return true;
        return false
    }

    /**
     * Obtiene el nombre
     */
    getName() {
        return this._fileName
    }

    /**
     * Valida si el documento ha sido almacenado
     */
    isSaved() {
        return this._isSaved
    }

    /**
     * 
     */
    open(name) {
        this._content = fs.readFileSync(`${this._dir}/${name}`, 'utf-8');
        this._fileName = name;
        this._isSaved = true;
        return this._content;
    }

}

module.exports = Document;