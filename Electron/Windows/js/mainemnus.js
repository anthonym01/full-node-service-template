

//text box menus
async function create_text_menus() {
    const text_box_menu = new Menu.buildFromTemplate([//Text box menu (for convinience)
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
        { role: 'seperator' },
        { role: 'undo' },
        { role: 'redo' },
    ]);
    //add events to text boxes
    textbox.addEventListener('contextmenu', (event) => popupmenu, false)

    //Popup the menu in this window
    function popupmenu(event) {
        event.preventDefault()
        event.stopPropagation()
        text_box_menu.popup({ window: require('electron').remote.getCurrentWindow() })
    }
}

//Body menu
async function create_body_menu() {
    const menu_body = new Menu.buildFromTemplate([//Main body menu
        { label: 'Force refresh UI', click() { maininitalizer() } },
        { role: 'reload' },
        { type: 'separator' },
        { label: 'Contact developer', click() { shell.openExternal(my_website) } },
        { role: 'toggledevtools' }
    ]);

    Menu.setApplicationMenu(menu_body)

    window.addEventListener('contextmenu', (e) => {//Body menu attached to window
        e.preventDefault();
        menu_body.popup({ window: remote.getCurrentWindow() })//popup menu
    }, false);
}

module.exports = {
    create_body_menu,
    create_text_menus,
}