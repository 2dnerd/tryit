var express = require('express');
var http = require('http');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);

app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname + "/public"));

app.use(function(req,res){
	res.send(404,"no page avail biyatch")
});

app.use(function(err,req,res,next){
	res.status(err.status || 404);
	res.send(err.message);
});

var users = [
	{name:"prajwal"},
	{name:"tejas"},
	{name:"abc"}
];

function authUser(req,res,next){
	console.log("in authuser");
	var authDone = false;
	for(var index=0;index<users.length;index++){
		if(users[index].name + "OK" == req.userid){
			authDone = true;
			console.log("authenticated");
			break;
		}
	}

	if(!authDone){
		console.log("failed to authenticate");
		var err = new Error("failed to authenticate");
		err.status = 401;
		next(err);
	}

	next();
}

function loadUser(req,res,next){
	console.log("in loaduser");
	req.userid = req.userid.substring(0,3) + "     CONTENT";
	next();
}

app.param('userId',function(req,res,next,userId){
	console.log("in app.param");
	req.userid = userId + "OK";
	next();
});
 

app.get("/users/:userId",authUser,loadUser,function(req,res,next){

	res.json(req.userid);

});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});