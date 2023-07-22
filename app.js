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
---------------------------------`;

const screen = `
=======================
    Editor de texto \n
=======================

    Elige una opcion: \n

1. Crear documento
2. Abrir documento
3. Cerrar editor
>
`;

mainScreen();
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

function createFile() {

}

function openFileInterface() {

}