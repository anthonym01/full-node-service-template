const { Menu, shell } = require('electron');

const my_website = 'https://anthonym01.github.io/Portfolio/?contact=me';//My website

const menu_body = new Menu.buildFromTemplate([//Main body menu
    //{ label: 'Force refresh UI', click() { maininitalizer() } },
    { role: 'reload' },
    { type: 'separator' },
    { label: 'Contact developer', click() { shell.openExternal(my_website) } },
    { role: 'toggledevtools' }
]);

const text_box_menu = new Menu.buildFromTemplate([//Text box menu (for convinience)
    { role: 'cut' },
    { role: 'copy' },
    { role: 'paste' },
    { role: 'selectAll' },
    { role: 'seperator' },
    { role: 'undo' },
    { role: 'redo' },
]);

function popupmain() {
    menu_body.popup()
}

module.exports = {
    text_box_menu,
    menu_body,
    popupmain,
}