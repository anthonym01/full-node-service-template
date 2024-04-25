const fs = require('fs');
const path = require('path');

const loggerite = {
    get_paths: function () {//Paths for logs are generated 
        try {
            const timex = new Date();
            const file_path = path.join(__dirname, `../logs/${timex.getMonth()}-${timex.getFullYear()}/${timex.getMonth()}-${timex.getDate()}.log`);// '/logs/mm-yyyy/mm-dd.log'

            return { file_path, timex }
        } catch (error) {
            console.error(error);
            return { file_path: path.join(__dirname, `../logs/default.log`), timex: 0 }
        }
    },
    checkfs: function () {
        // Check and make folders for logs
        console.log('checking log path');
        const log_properties = this.get_paths();
        try {
            if (!fs.existsSync(log_properties.file_path)) {
                if (!fs.existsSync(path.dirname(log_properties.file_path))) {
                    console.log('Create: ', path.dirname(log_properties.file_path));
                    fs.mkdirSync(path.dirname(log_properties.file_path), { recursive: true });
                }
                console.log('Create: ', log_properties.file_path);
                fs.writeFileSync(log_properties.file_path, 'Start log\n', { encoding: 'utf8' });
            }
        } catch (error) {
            console.error(error);
        }
        return -1;
    },
    info: async function (datum) {//log happenings
        console.log(datum);
        const log_properties = this.get_paths();
        writelog(datum);
        function writelog(datum) {
            try {
                fs.appendFileSync(log_properties.file_path, `${log_properties.timex} : ${datum}\n`, { encoding: 'utf8' });
            } catch (error) {

                console.error("Logger Error", error);
                loggerite.checkfs();
                writelog(datum);
            }
        }
    },
    error: async function (datum) {//log bad happenings
        console.error(datum);
        const log_properties = this.get_paths();
        writelog(datum);
        function writelog(datum) {
            try {
                fs.appendFileSync(log_properties.file_path, `\n****************************************\nError:\n${log_properties.timex} :\n${datum}\n******************************************\n\n`, { encoding: 'utf8' });
            } catch (error) {

                console.error("Logger Error", error);
                loggerite.checkfs();
                writelog(datum);
            }
        }
    }
}

module.exports = loggerite;