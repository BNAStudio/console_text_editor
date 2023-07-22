// app.js

const readline = require('readline');
const Messages = require('./messages');
const Document = require('./document');
const Directory = require('./directory');

const dir = new Directory();

let interface = readline.createInterface(process.stdin, process.stdout);


const tools = `Comandos: :q = salir, :sa = guardar como, :s = guardar
--------------------------------------`
const pantalla = `
                    ================
                    Editor de texto.\n
                    ================
                    Elige una opcion:\n
                    1 Crear nuevo documento
                    2 Abrir documento
                    3 Cerrar editor\n> `;

mainScreen();
function mainScreen() {
    process.stdout.write('\033c');
    interface.question(pantalla, (res) => {
        switch (res.trim()) {
            case '1':
                createFile();
                break;

            case '2':
                openFileInterface();
                break;

            case '3':
                interface.close();
                break;

            default:
                mainScreen();
        }
    });
}

function readCommands(file) {
    interface.on('line', (input) => {
        switch (input.trim()) {
            case ':sa':
                saveAs(file);
                break;

            case ':q':
                interface.removeAllListeners('line');
                mainScreen();
                break;

            case ':s':
                save(file);
                break;

            default:
                file.append(input.trim());
        }
    })
}

function createFile() {
    let file = new Document(dir.getPath());

    renderInterface(file);
    readCommands(file);
}

function save(file) {
    if (file.hasName()) {
        file.save()
        renderInterface(file, `${Messages.fileSaved}\n`);
    } else {
        saveAs(file);
    }
}

function saveAs(file) {
    interface.question(Messages.requestFileName, (name) => {
        if (file.exists(name)) {
            console.log(Messages.fileExists);
            interface.question(Messages.replaceFile, (confirm) => {
                if (confirm == 'y') {
                    file.saveas(name);
                    renderInterface(file, `${Messages.fileSaved}\n`);
                } else {
                    renderInterface(file, `${Messages.fileNotSaved}\n`);
                }
            });
        } else {
            file.saveas(name);
            renderInterface(file, `${Messages.fileSaved}\n`);
        }
    });
}

function openFile(file, name) {
    content = file.open(name);
    renderInterface(file);
    readCommands(file);
}

function renderInterface(file, mensaje) {
    process.stdout.write('\033c');
    (file.getName() == '') ? console.log(`| Untitled |`) : console.log(`| ${file.getName()} |`);
    console.log(tools);
    if (mensaje != null) console.log(mensaje);
    console.log(file.getContent());
}

function openFileInterface() {
    let file = new Document(dir.getPath());
    dir.getFilesInDir();
    interface.question(Messages.requestFileName, (name) => {
        if (file.exists(name)) {
            openFile(file, name);
        } else {
            console.log(Messages.fileNotFound);
            interface.removeAllListeners('line');
            mainScreen();
        }
    });
}


// ======================================================================

// document.js


const fs = require('fs');
const os = require('os');

class Document {

    constructor(dir) {
        this._content = '';
        this._isSaved = false;
        this._filename = '';
        this._dir = dir;
    }

    exists(name) {
        return fs.existsSync(`${this._dir}/${name}`);
    }

    append(text) {
        this._content += os.EOL + text;
        this._isSaved = false;
    }

    saveas(name) {
        fs.writeFileSync(`${this._dir}/${name}`, this._content);
        this._filename = name;
        this._isSaved = true;
    }

    save() {
        fs.writeFileSync(`${this._dir}/${this._filename}`, this._content);
        this._isSaved = true;
        this._filename = this._filename;
    }

    getContent() {
        return this._content;
    }

    hasName() {
        if (this._filename != '') {
            return true;
        } else {
            return false;
        }
    }
    getName() {
        return this._filename;
    }

    isSaved() {
        return this._isSaved;
    }

    open(name) {
        this._content = fs.readFileSync(`${this._dir}/${name}`, 'UTF-8');
        this._filename = name;
        this._isSaved = true;
        return this._content;
    }

}

module.exports = Document;


// ===============================================================================

// Directory.js

const fs = require('fs');
const path = require('path');

class Directory {

    constructor() {
        this._path = __dirname;
        this.createDocsDir();
    }

    createDocsDir() {
        this._path = path.join(this._path, 'docs', '');
        if (!fs.existsSync('./docs')) {
            fs.mkdirSync('./docs');
        }

    }

    getPath() {
        return this._path;
    }

    getShortPath() {
        const paths = path.parse(this._path);
        let delimiter = "/";

        if (paths.dir.indexOf(delimiter < 0)){
            delimiter = `\\`;
        }
        //const dirs = paths.dir.split(delimiter);
        return `${paths.root}...${delimiter}${paths.name}`;
    }

    getFilesInDir() {
        const files = fs.readdirSync(this._path);
        let n = 0;
        console.log(`
====================================
Ubicación: ${this.getShortPath()}
====================================`);
        files.forEach(file => {
            if (file != '.DS_Store') {
                console.log(`   ${file}`);
                n++;
            }
        });
    }
}

module.exports = Directory;