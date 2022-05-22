const back = require('androidjs').back;

back.on("hello from front", function(){
	back.send("hello from back", "Hello from Android JS");
});

function consolelog(msg){// Send error messages to the web view for debugging purposes
	back.send("fake console",msg);
}

consolelog('Back ready to roll')
