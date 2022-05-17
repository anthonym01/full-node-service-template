
front.send("hello from front");

front.on("hello from back", function(msg){
	console.log(msg);
	$('#msg').html(msg);
});

front.on('fake console',function(msg){
	console.log('From the back: \n',msg)
})