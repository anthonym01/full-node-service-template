
window.addEventListener('load', async function () {//Starting point
    try {
        await config.load()
    } catch (err) {
        console.warn('Something bad happened: ', err)
    } finally {
        /*
            startup things
        */

        document.getElementById('testpost_btn').addEventListener('click', function () {//Test post button
            console.log("testpost");
            post({ payload: document.getElementById('postablegarbage').value }, '/post/test');
        });

    }
});

async function request(what) {// fetch example
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

async function post(what, where) { // fetch with post example
    try {
        const response = await fetch(where, {
            method: "POST",
            body: JSON.stringify(what),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        });
        if (!response.ok) { throw new Error('Network failiure'); }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
        return false;
    }
}

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
    delete: function () {//wipe storage
        localStorage.clear("express_cfg");//yeet the storage key
        console.log('config deleted: ');
        console.table(config.data);
        config.data = {};
    },

}
