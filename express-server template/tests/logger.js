const logs = require('../modules/logger');
logs.info("Logger module test",6969,8086);
console.log("Logger module test",6969,8086);
logs.info(7,3)
console.log(7,3)
logs.info(7,3,4,5,67,5,43,2)
console.log(7,3,4,5,67,5,43,2)
logs.info({ uname: "testduplicate", password: "0000" })
console.log({ uname: "testduplicate", password: "0000" })
