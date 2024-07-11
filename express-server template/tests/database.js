const database = require('../database');

database.initalize();//initalize database
database.get_user_data_by_uuid(1717209024517);//test get user data
database.create_user({ uname: "testduplicate", password: "0000" });//test create user duplication
database.get_user_data_by_username("testduplicate");//test get user data by username
