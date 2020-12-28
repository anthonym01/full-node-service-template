const { Browser } = Capacitor.Plugins;//plugins
const remote_host = 'http://192.168.0.13:1999';//a host

async function request(what) {//make a request to server for data

    try {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {//wait for and handle response
            if (this.readyState == 4 && this.status == 200) {
                console.log('Server replied with: ', this.responseText, ' In response: ', this.response)
                return this.responseText
            }
        };

        xhttp.open("GET", remote_host + '/' + what, true);//get request
        xhttp.send();
    } catch (err) {
        console.warn('xhttp request failed ', err);
    }

}

async function post(what, where) {//post data to server
    var xhttp = new XMLHttpRequest(remote_host)

    xhttp.onreadystatechange = function () {//wait for and handle response
        if (this.readyState == 4 && this.status == 200) {
            console.log('Server replied with: ', this.responseText, ' In response: ', this.response)
        }
    };

    xhttp.open("POST", remote_host + '/' + where, true);
    xhttp.send(JSON.stringify(what));
}

async function open_link(link) { await Browser.open({ url: link }); }
