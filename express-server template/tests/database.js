const database = require('../database');

database.initalize('chickenn time');//initalize database
database.get_user_data_by_uuid(1720721750676);//test get user data
database.create_user({ uname: "testduplicate", password: "0000" });//test create user duplication
database.get_user_data_by_username("testduplicate");//test get user data by username
