const readline = require('readline');
const Messages = require('./messages');
const Directory = require('./directory');
const Document = require('./document');

const dir = new Directory();

let interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const tools = `Comandos: :q = salir, :sa = Guardar como, :s = Guardar
------------------------------------------------------`;

const screen = `
=======================
    Editor de texto \n
=======================

    Elige una opcion: \n

1. Crear documento
2. Abrir documento
3. Cerrar editor

=======================
`;

mainScreen();
/**
 * Comandos principales
 * Renderiza la pantalla principal y valida la respuesta inicial del usuario
 */
function mainScreen() {
    process.stdout.write('\x1Bc'); // Limpia pantalla (con bash no funciona)

    interface.question(screen, res => {
        switch (res) {
            case "1":
                createFile();
                break;

            case "2":
                openFileInterface();
                break;

            case "3":
                interface.close();
                break;

            default:
                mainScreen();
        }
    })
}

/**
 * Crea una instancia de la class Document, suministra como argumento la ruta generada con la class Directory
 */
function createFile() {
    let file = new Document(dir.getPath());

    renderInterface(file);
    readCommands(file);
}

/**
 * 
 * @param {*} file : instacia de la class Document 
 */
function renderInterface(file) {

    // Valida e imprime si el nombre existe o no
    (file.getName() === '') ? console.log('| untitled |') : console.log(`| ${file.getName()} |`);;

    // Imprime las instrucciones del usuario
    console.log(tools);
    // Imprime el contenido ingresado por el usuario
    console.log(file.getContent());
}

/**
 * Comando auxiliares
 * Obtiene las instrucciones a ejecutar de acuerdo a la respuesta del usuario
 * @param {*} file : instancia de la class Document
 */
function readCommands(file) {
    // Crea evento para que se lea input de la consola
    interface.on('line', input => {
        switch (input) {
            case ':sa':
                saveAs(file);
                break;

            case ':s':
                save(file);
                break;

            case ':q':
                interface.removeAllListeners('line');
                mainScreen();
                break;

            default:
                file.append(input.trim());
        }
    })
}

/**
 * funcion para comando :sa
 * valida la respuesta del usuario (existe o no)
 * almacena la informacion de acuerdo a la eleccion del usuario (save, saveAs)
 * saveAs, reescribe el documento
 * @param {*} file ; instancia de la class Document
 */
function saveAs(file) {
    interface.question(Messages.requestFileName, name => {
        if (file.exists(name)) {
            console.log(Messages.fileExists);
            interface.question(Messages.replaceFile, confirm => {
                if (confirm == 'y') {
                    file.saveAs(name);
                    renderInterface(file, Messages.fileSaved + '\n');
                } else {
                    renderInterface(file, Messages.fileNotSaved + '\n');
                }
            })
        } else {
            console.log('el archivo no existe');
            file.saveAs(name)
            renderInterface(file, Messages.fileSaved + '\n');
        }
    })
}

/**
 * funcion para comando :s
 * valida si el documento existe, en caso que no, lo crea
 * 
 * @param {*} file : instancia de la class Document
 */
function save(file) {
    if (file.hasName()) {
        file.save();
        renderInterface(file, Messages.fileSaved + '\n');
    } else {
        file.saveAs(file);
    }
}

/**
 * Imprime el documento en la consola
 */
function openFileInterface() {
    let file = new Document(dir.getPath());
    dir.getFilesInDir();

    interface.question(Messages.requestFileName, name => {
        if (file.exists(name)) {
            openFile(file, name);
        } else {
            console.log(Messages.fileNotFound);

            setTimeout(() => {
                interface.removeAllListeners('line');
                mainScreen();
            }, 2000)
        }
    })
}

/**
 * 
 * @param {*} file : instancia de la class Document
 * @param {*} name : nombre del documento
 */
function openFile(file, name) {
    file.open(name);
    renderInterface(file);
    readCommands(file);
}