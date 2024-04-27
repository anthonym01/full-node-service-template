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
        logs.info('Initalize database: ', database_paths);

        try {
            if (!fs.existsSync(database_paths.root)) {//check if database exists
                logs.error("Database does not exist");
                fs.mkdirSync(database_paths.root);
            }

            if (!fs.existsSync(database_paths.users)) {//check if users record exists
                logs.info('Creating test users records');
                fs.writeFileSync(database_paths.users,
                    JSON.stringify({
                        db_version: 0,
                        users: [//some test users
                            { uname: "Anthonym", password: "0000" },
                            { uname: "test", password: "0000" }
                        ]
                    })
                );
            }

            if (!fs.existsSync(database_paths.users_data)) {//check if user data directory exists
                logs.info('Creating user data directory', database_paths.users_data);
                fs.mkdirSync(database_paths.users_data);
            }
            logs.info("Database check succeded");
        } catch (error) {
            // shouldnt get any errors here unless something is realy wrong
            console.log('Startup error, check if node runtime has write permission in ', __dirname);
            logs.error("Database Error: ", error);
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
        const database_paths = this.get_paths();
        logs.info('Add new user entry to database :', userdetails);

        //! Need to forbid unwritable characters or convert username with another primary key
        try {

            //check if this user already exists
            let userdata = JSON.parse(fs.readFile(database_paths.users, { encoding: 'utf-8' }));

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
                fs.writeFileSync(database_paths.users, JSON.stringify(userdata), { encoding: 'utf-8' });
                //create this specific users file
                fs.writeFileSync(path.join(database_paths.users_data, userdetails["uname"], '.json'), JSON.stringify({
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
        const database_paths = this.get_paths();
        /*
            check if ${username} user already existsv in '/database/users.json' and check user data file
        */
        console.log('Check database for user: ', username);

        let userdata = JSON.parse(fs.readFile(database_paths.users, { encoding: 'utf-8' }));


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