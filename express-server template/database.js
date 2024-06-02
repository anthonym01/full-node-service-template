// json database
const logs = require('./logger');
const fs = require('fs');
const path = require('path');

const root_db_directory = path.join(__dirname, '/database/');//root path
const user_records_path = path.join(root_db_directory, 'users.json');//users record
const db_data_path = path.join(root_db_directory, 'userdata/');//data directory

const database = {
    initalize: function () {
        logs.info('Initalize database: ', root_db_directory);

        try {
            //check if database exists
            if (!fs.existsSync(root_db_directory)) {
                logs.error("Database does not exist");
                fs.mkdirSync(root_db_directory);
            }

            //check if user data directory exists
            if (!fs.existsSync(db_data_path)) {
                logs.info('Creating user data directory', db_data_path);
                fs.mkdirSync(db_data_path);
            }

            //check if users record exists
            if (!fs.existsSync(user_records_path)) {
                logs.info('Creating test users record :', user_records_path);
                //create users record
                fs.writeFileSync(user_records_path, JSON.stringify({ db_version: 0, users: [] }), { encoding: 'utf-8' });
                //create test users
                database.Create_user({ uname: "test", password: "0000" });
                database.Create_user({ uname: "Anthonym", password: "0000" });
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
    Create_user: async function (new_user_details) {

        // Expects format:
        /* 
            new_user_details = {
                uuid:00000000000000000000000000000000,//will be generated if not provided
                uname:"",//mandatory
                password:"",//mandatory
                data:{}//initial data for user
            }
        */
        logs.info('Add new user entry to database :', new_user_details);

        try {
            //check if this user already exists
            let user_record_file_data = JSON.parse(fs.readFileSync(user_records_path, { encoding: 'utf-8' }));

            if (fs.existsSync(path.join(db_data_path, String(new_user_details.uuid) + '.json'))) {
                logs.info('User data already exists at: ', new_user_details.uuid);
                return false;//user will not be overwritten
            }

            //!! Improve matching later
            for (let iterate in user_record_file_data.users) {
                if (user_record_file_data.users[iterate].uname == new_user_details["uname"]) {
                    logs.info('User already exists at: ', user_record_file_data.users[iterate].uuid);
                    return false;//user will not be overwritten
                }
            }

            //update users records list with new user
            let new_uuid = new_user_details.uuid || Date.now();
            user_record_file_data.users.push({
                uuid: new_uuid,
                uname: new_user_details.uname,
                password: new_user_details.password,
            });

            user_record_file_data.db_version = Number(user_record_file_data.db_version) + 1;

            fs.writeFileSync(user_records_path, JSON.stringify(user_record_file_data), { encoding: 'utf-8' });

            //create this specific users file
            fs.writeFileSync(path.join(db_data_path, String(new_uuid) + '.json'), JSON.stringify({
                version: 0,
                lastupdate: new Date().getTime(),
                data: new_user_details.data || { test: "no data passed to user" },
            }));
            return true;//user should now be in database

        } catch (error) {
            console.log('error ', error)
            return false;//handle later
        }
    },
    get_user_data_by_uuid: async function (uuid) {
        try {
            logs.info('Get user data for: ', uuid);

            let user_data = JSON.parse(fs.readFileSync(path.join(db_data_path, String(uuid) + '.json'), { encoding: 'utf-8' }));//get users record
            logs.info('User data: ', user_data);
            return user_data;
        } catch (error) {
            logs.error('Error in get_user_data: ', error);
            return false
        }
    },
    get_user_data_by_username: async function (username) {
        try {
            logs.info('Get user data for: ', username);
            const users_file_data = JSON.parse(fs.readFileSync(user_records_path, { encoding: 'utf-8' }));//get users record

            for (let iterate in users_file_data.users) {//check if user exists
                if (users_file_data.users[iterate].uname == username) {
                    logs.info('Username coresponds to: ', users_file_data.users[iterate].uuid);
                    return await this.get_user_data_by_uuid(users_file_data.users[iterate].uuid);
                }
            }
        } catch (error) {
            logs.error('Error in get_user_data: ', error);
            return false
        }
    },
    update_user_data: async function (username, new_data) {
        try {
            const database_paths = database.get_paths();
            logs.info('Update user data for: ', username, ' at ', database_paths.users_data_records);

            let user_data = JSON.parse(fs.readFileSync(path.join(database_paths.users_data_records, username, '.json'), { encoding: 'utf-8' }));//get users record
            user_data.data = new_data;
            user_data.version = Number(user_data.version) + 1;
            user_data.lastupdate = new Date().getTime();
            fs.writeFileSync(path.join(database_paths.users_data_records, username, '.json'), JSON.stringify(user_data), { encoding: 'utf-8' });
            logs.info('User data updated: ', user_data);
            return true;
        } catch (error) {
            logs.error('Error in update_user_data: ', error);
            return false
        }
    },
    delete_user: async function (username) {
        try {
            const database_paths = database.get_paths();
            logs.info('Delete user: ', username, ' at ', database_paths.users_data_records);

            let user_data = JSON.parse(fs.readFileSync(path.join(database_paths.users_data_records, username, '.json'), { encoding: 'utf-8' }));//get users record
            fs.unlinkSync(path.join(database_paths.users_data_records, username, '.json'));//delete user data record
            logs.info('User data deleted: ', user_data);

            let users_file_data = JSON.parse(fs.readFileSync(database_paths.users_file, { encoding: 'utf-8' }));//get users record
            for (let iterate in users_file_data.users) {//check if user exists
                if (users_file_data.users[iterate].uname == username) {
                    users_file_data.users.splice(iterate, 1);//remove user from users record
                    users_file_data.db_version = Number(users_file_data.db_version) + 1;
                    fs.writeFileSync(database_paths.users_file, JSON.stringify(users_file_data), { encoding: 'utf-8' });//update users record
                    logs.info('User removed from users record: ', users_file_data);
                    return true;
                }
            }
            logs.error('Could not find user in users record');
            return false;
        } catch (error) {
            logs.error('Error in delete_user: ', error);
            return false
        }
    },
    change_password: async function (username, new_password) {
        try {
            const database_paths = database.get_paths();
            logs.info('Change password for: ', username, ' at ', database_paths.users_file);

            let users_file_data = JSON.parse(fs.readFileSync(database_paths.users_file, { encoding: 'utf-8' }));//get users record
            for (let iterate in users_file_data.users) {//check if user exists
                if (users_file_data.users[iterate].uname == username) {
                    users_file_data.users[iterate].password = new_password;
                    users_file_data.db_version = Number(users_file_data.db_version) + 1;
                    fs.writeFileSync(database_paths.users_file, JSON.stringify(users_file_data), { encoding: 'utf-8' });//update users record
                    logs.info('Password changed for user: ', username);
                    return true;
                }
            }
            logs.error('Could not find user in users record');
            return false;
        } catch (error) {
            logs.error('Error in change_password: ', error);
            return false
        }
    }
};

module.exports = database;