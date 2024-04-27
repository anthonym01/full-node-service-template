const fs = require('fs');
const path = require('path');

const loggerite = {
    initalize: function () { this.checkfs() },
    get_paths: function () {//Paths for logs are generated based on time
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
                fs.writeFileSync(log_properties.file_path, `Start log - ${log_properties.timex}\n\n`, { encoding: 'utf8' });
            }
        } catch (error) {
            console.error(error);
        }
        return -1;
    },
    info: async function (datum1, datum2, datum3, datum4, datum5, datum6) {//log happenings
        const log_properties = this.get_paths();//get log paths

        try {
            if (typeof datum6 !== 'undefined') {//if six data are passed
                console.log(datum1, datum2, datum3, datum4, datum5, datum6);
                if (typeof datum1 === 'object') datum1 = `\n${JSON.stringify(datum1, null, 2)}`;
                if (typeof datum2 === 'object') datum2 = `\n${JSON.stringify(datum2, null, 2)}`;
                if (typeof datum3 === 'object') datum3 = `\n${JSON.stringify(datum3, null, 2)}`;
                if (typeof datum4 === 'object') datum4 = `\n${JSON.stringify(datum4, null, 2)}`;
                if (typeof datum5 === 'object') datum5 = `\n${JSON.stringify(datum5, null, 2)}`;
                if (typeof datum6 === 'object') datum6 = `\n${JSON.stringify(datum6, null, 2)}`;
                writelog(`${datum1} ${datum2} ${datum3} ${datum4} ${datum5} ${datum6}`);
                return 6;
            }
            if (typeof datum5 !== 'undefined') {//if five data are passed
                console.log(datum1, datum2, datum3, datum4, datum5);
                if (typeof datum1 === 'object') datum1 = `\n${JSON.stringify(datum1, null, 2)}`;
                if (typeof datum2 === 'object') datum2 = `\n${JSON.stringify(datum2, null, 2)}`;
                if (typeof datum3 === 'object') datum3 = `\n${JSON.stringify(datum3, null, 2)}`;
                if (typeof datum4 === 'object') datum4 = `\n${JSON.stringify(datum4, null, 2)}`;
                if (typeof datum5 === 'object') datum5 = `\n${JSON.stringify(datum5, null, 2)}`;
                writelog(`${datum1} ${datum2} ${datum3} ${datum4} ${datum5}`);
                return 5;
            }
            if (typeof datum4 !== 'undefined') {//if four data are passed
                console.log(datum1, datum2, datum3, datum4);
                if (typeof datum1 === 'object') datum1 = `\n${JSON.stringify(datum1, null, 2)}`;
                if (typeof datum2 === 'object') datum2 = `\n${JSON.stringify(datum2, null, 2)}`;
                if (typeof datum3 === 'object') datum3 = `\n${JSON.stringify(datum3, null, 2)}`;
                if (typeof datum4 === 'object') datum4 = `\n${JSON.stringify(datum4, null, 2)}`;
                writelog(`${datum1} ${datum2} ${datum3} ${datum4}`);
                return 4;
            }
            if (typeof datum3 !== 'undefined') {//if three data are passed
                console.log(datum1, datum2, datum3);
                if (typeof datum1 === 'object') datum1 = `\n${JSON.stringify(datum1, null, 2)}`;
                if (typeof datum2 === 'object') datum2 = `\n${JSON.stringify(datum2, null, 2)}`;
                if (typeof datum3 === 'object') datum3 = `\n${JSON.stringify(datum3, null, 2)}`;
                writelog(`${datum1} ${datum2} ${datum3}`);
                return 3;
            }
            if (typeof datum2 !== 'undefined') {//if two data are passed
                console.log(datum1, datum2);
                if (typeof datum1 === 'object') datum1 = `\n${JSON.stringify(datum1, null, 2)}`;
                if (typeof datum2 === 'object') datum2 = `\n${JSON.stringify(datum2, null, 2)}`;
                writelog(`${datum1} ${datum2}`);
                return 2;
            }
            if (typeof datum1 !== 'undefined') {//if one data is passed
                console.log(datum1);
                if (typeof datum1 === 'object') datum1 = `\n${JSON.stringify(datum1, null, 2)}`;
                writelog(datum1);
                return 1;
            }
        } catch (error) {
            console.error("Logger Error: ", error);
            loggerite.checkfs();
        }

        function writelog(datum) {
            try {
                fs.appendFileSync(log_properties.file_path, `${log_properties.timex} : ${datum}\n------------------------------------------------------------\n`, { encoding: 'utf8' });
            } catch (error) {
                throw error;
            }
        }
    },
    error: async function (datum1, datum2, datum3, datum4, datum5, datum6) {//log bad happenings
        const log_properties = this.get_paths();
        try {
            if (typeof datum6 !== 'undefined') {
                console.error(datum1, datum2, datum3, datum4, datum5, datum6);
                if (typeof datum1 === 'object') datum1 = `\n${JSON.stringify(datum1, null, 2)}`;
                if (typeof datum2 === 'object') datum2 = `\n${JSON.stringify(datum2, null, 2)}`;
                if (typeof datum3 === 'object') datum3 = `\n${JSON.stringify(datum3, null, 2)}`;
                if (typeof datum4 === 'object') datum4 = `\n${JSON.stringify(datum4, null, 2)}`;
                if (typeof datum5 === 'object') datum5 = `\n${JSON.stringify(datum5, null, 2)}`;
                if (typeof datum6 === 'object') datum6 = `\n${JSON.stringify(datum6, null, 2)}`;
                writelog(`${datum1} ${datum2} ${datum3} ${datum4} ${datum5} ${datum6}`);
                return 6;
            }
            if (typeof datum5 !== 'undefined') {
                console.error(datum1, datum2, datum3, datum4, datum5);
                if (typeof datum1 === 'object') datum1 = `\n${JSON.stringify(datum1, null, 2)}`;
                if (typeof datum2 === 'object') datum2 = `\n${JSON.stringify(datum2, null, 2)}`;
                if (typeof datum3 === 'object') datum3 = `\n${JSON.stringify(datum3, null, 2)}`;
                if (typeof datum4 === 'object') datum4 = `\n${JSON.stringify(datum4, null, 2)}`;
                if (typeof datum5 === 'object') datum5 = `\n${JSON.stringify(datum5, null, 2)}`;
                writelog(`${datum1} ${datum2} ${datum3} ${datum4} ${datum5}`);
                return 5;
            }
            if (typeof datum4 !== 'undefined') {
                console.error(datum1, datum2, datum3, datum4);
                if (typeof datum1 === 'object') datum1 = `\n${JSON.stringify(datum1, null, 2)}`;
                if (typeof datum2 === 'object') datum2 = `\n${JSON.stringify(datum2, null, 2)}`;
                if (typeof datum3 === 'object') datum3 = `\n${JSON.stringify(datum3, null, 2)}`;
                if (typeof datum4 === 'object') datum4 = `\n${JSON.stringify(datum4, null, 2)}`;
                writelog(`${datum1} ${datum2} ${datum3} ${datum4}`);
                return 4;
            }
            if (typeof datum3 !== 'undefined') {
                console.error(datum1, datum2, datum3);
                if (typeof datum1 === 'object') datum1 = `\n${JSON.stringify(datum1, null, 2)}`;
                if (typeof datum2 === 'object') datum2 = `\n${JSON.stringify(datum2, null, 2)}`;
                if (typeof datum3 === 'object') datum3 = `\n${JSON.stringify(datum3, null, 2)}`;
                writelog(`${datum1} ${datum2} ${datum3}`);
                return 3;
            }
            if (typeof datum2 !== 'undefined') {
                console.error(datum1, datum2);
                if (typeof datum1 === 'object') datum1 = `\n${JSON.stringify(datum1, null, 2)}`;
                if (typeof datum2 === 'object') datum2 = `\n${JSON.stringify(datum2, null, 2)}`;
                writelog(`${datum1} ${datum2}`);
                return 2;
            }
            if (typeof datum1 !== 'undefined') {
                console.error(datum1);
                if (typeof datum1 === 'object') datum1 = `\n${JSON.stringify(datum1, null, 2)}`;
                writelog(datum1);
                return 1;
            }
        } catch (error) {
            console.error("Logger Error", error);
        }

        function writelog(datum) {//write to log file
            try {
                fs.appendFileSync(log_properties.file_path, `\n****************************************\nError:\n${log_properties.timex} :\n${datum}\n******************************************\n\n`, { encoding: 'utf8' });
            } catch (error) {
                console.error("Logger Error", error);
                loggerite.checkfs();
            }
        }
    },

}

module.exports = loggerite;