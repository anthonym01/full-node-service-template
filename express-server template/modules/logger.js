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
    info: async function (datum1, datum2) {//log happenings
        const log_properties = this.get_paths();
        try {
            if (typeof datum2 !== 'undefined') {
                console.log(datum1, datum2);
                writelog2(datum1, datum2);
                return 2;
            }
            if (typeof datum1 !== 'undefined') {
                console.log(datum1);
                writelog(datum1);
                return 1;
            }

        } catch (error) {
            console.error("Logger Error", error);
            loggerite.checkfs();
        }

        function writelog(datum) {
            try {
                if (typeof datum === 'object') datum = `\n${JSON.stringify(datum, null, 2)}`;
                fs.appendFileSync(log_properties.file_path, `${log_properties.timex} : ${datum}\n------------------------------------------------------------\n`, { encoding: 'utf8' });
            } catch (error) {
                throw error;
            }
        }
    },
    error: async function (datum) {//log bad happenings
        console.error(datum);
        const log_properties = this.get_paths();
        writelog(datum);
        function writelog(datum) {
            try {
                if (typeof datum === 'object') datum = JSON.stringify(datum, null, 2);
                fs.appendFileSync(log_properties.file_path, `\n****************************************\nError:\n${log_properties.timex} :\n${datum}\n******************************************\n\n`, { encoding: 'utf8' });
            } catch (error) {

                console.error("Logger Error", error);
                loggerite.checkfs();
                writelog(datum);
            }
        }
    },

}

module.exports = loggerite;