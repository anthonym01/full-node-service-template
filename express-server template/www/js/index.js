
window.addEventListener('load', async function () {//Starting point
    try {
        await config.load()
    } catch (err) {
        console.warn('Something bad happened: ', err)
    } finally {

    }
});

async function request(what) {//basic fetch template
    try {
        const response = await fetch(what);
        if (!response.ok) { throw new Error('Network failiure'); }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function post(what, where) {//basic post
    let xhttp = new XMLHttpRequest()
    let response_cat;
    xhttp.open("POST", where, true);
    xhttp.send(JSON.stringify(what));

    xhttp.onreadystatechange = function () {//wait for and handle response
        if (this.readyState == 4 && this.status == 200) {
            console.log('Server replied with: ', this.responseText, ' In response: ', this.response)
        }
    };
}

//Test post button
document.getElementById('testpost_btn').addEventListener('click', function () {
    console.log("testpost");
    post({ payload: document.getElementById('postablegarbage').value }, '/post/test');
});

//local storage handler
let config = {
    data: {//Loacal app data

    },
    save: async function () {//Save the config file
        console.table('Configuration is being saved', config.data)
        localStorage.setItem("express_cfg", JSON.stringify(config.data))
    },
    load: function () {//Load the config file
        console.warn('Configuration is being loaded')
        config.data = JSON.parse(localStorage.getItem("express_cfg"))
        console.log('config Loaded from application storage')
    },
    delete: function () {//Wjipe stowage
        localStorage.clear("express_cfg");//yeet the storage key
        console.log('config deleted: ');
        console.table(config.data);
        config.data = {};
    },

}
