// json database
const logs = require('./logger');
const fs = require('fs');
const path = require('path');

const database = {
    get_paths: function () {
        const root = path.join(__dirname, '../database/');//root path
        const users = path.join(root, 'users.json');//users record
        const users_data = path.join(root, 'userdata/');//user data directory

        return { root, users, users_data };
    },
    initalize: function () {
        /*
            Checks for paths '/database/', '/database/users.json'
        */
        const database_paths = this.get_paths();
        logs.info('Initalize database');
        logs.info(database_paths);
        try {
            if (!fs.existsSync(path.join(__dirname, './database/'))) {
                logs.error("Database does not exist");
                fs.mkdirSync(path.join(__dirname, './database/'));
            }

            if (!fs.existsSync(path.join(__dirname, './database/users.json'))) {
                logs.info('Creating test users records');
                fs.writeFileSync(path.join(__dirname, './database/users.json'),
                    JSON.stringify({
                        db_version: 0,
                        users: [//test users
                            { uname: "Anthonym", password: "0000" },
                            { uname: "test", password: "0000" }
                        ]
                    })
                );
            }

            if (!fs.existsSync(path.join(__dirname, './database/userdata/'))) {
                logs.info('Creating user data directory' + path.join(__dirname, './database/userdata/'));
                fs.mkdirSync(path.join(__dirname, './database/userdata/'));
            }
            logs.info("Database check succeded");
        } catch (error) {
            // shouldnt get any errors here unless something is realy wrong
            console.log('Startup error, check if node runtime has write permission in ', __dirname);
            console.warn(error);
        }
    },
    cleanup: async function () {
        /*
            Remove/bad/old/un-needed records
        */
        logs.info('Clean up database placeholder')
    },
    Create_user: async function (userdetails) {
        /* 
            Create a new user
            Expects format:
            userdetails = {
                uname:"",
                password:"",
                data:{}//initial data for user
            }
        */

        console.log('Add new user entry to database :', userdetails);

        //! Need to forbid unwritable characters or convert username with another primary key
        try {

            //check if this user already exists
            let userdata = JSON.parse(fs.readFile(path.join(__dirname, '/database/users.json'), { encoding: 'utf-8' }));
            //!! Improve matching later
            let user_is_found = false;
            for (let iterate in userdata.users) {
                if (userdata.users[iterate].uname == userdetails["uname"]) {
                    user_is_found = true;
                    console.log('Found user at: ', iterate);
                    break;
                }
            }

            if (user_is_found) {
                return false;//user will not be overwritten
            } else {
                //update users record
                userdata.users.push({
                    uname: userdetails.uname,
                    password: userdetails.password,
                });

                userdata.db_version = Number(userdata.db_version) + 1;
                fs.writeFileSync(path.join(__dirname, '/database/users.json'), JSON.stringify(userdata), { encoding: 'utf-8' });

                //create this specific users file
                fs.writeFileSync(path.join(__dirname, './database/userdata/' + userdetails["uname"] + '.json'), JSON.stringify({
                    version: 0,
                    lastupdate: new Date().getTime(),
                    data: userdetails.data || {},//initial data if any
                }));
                return true;//user should now be in database

            }



        } catch (error) {
            console.log('error ', error)
            return false;//handle later
        }


    },
    does_user_exist: async function (username) {
        /*
            check if ${username} user already existsv in '/database/users.json' and check user data file
        */
        console.log('Check database for user: ', username);

        let userdata = JSON.parse(fs.readFile(path.join(__dirname, '/database/users.json'), { encoding: 'utf-8' }));


        for (let iterate in userdata.users) {
            if (userdata.users[iterate].uname == username) {
                console.log('Found user at: ', iterate);
                return true;
            }
        }
        return false;
    }
};

module.exports = database;