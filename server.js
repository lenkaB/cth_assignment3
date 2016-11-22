// importing all the required libraries
var express = require('express');		
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);	
var chance = require('chance').Chance(); 


// 3 patterns to look for: questions about (1)luck (2)love (3)money
var pattern_1 = ["Will I have good luck?","Will I be lucky?","Will I have good fortune?"];
var pattern_2 = ["Am i going to find love?","Is love waiting for me?","Will I meet my future love soon?"];
var pattern_3 = ["Will I be rich?","Is money waiting for me?","Am I going to be wealthy?"];


// the same function did in class used to match patterns in questions asked with the 3 types of questions
function matches(msg, array_of_patterns) {
  var msg_lower = msg.toLowerCase();
  for(var i = 0; i < array_of_patterns.length; i++) {
    var pattern_lower = array_of_patterns[i].toLowerCase();
    if(msg_lower.search(pattern_lower) > -1) {
      return true;
    }
  }
  return false;
}

// the same function did in class used to pick a random element in an array of choices
function choice(array) {
  var index = chance.natural({'min': 0, 'max': array.length - 1}); 
  return array[index];
}


// the same function did in class used to maybe pick an element from an array and maybe return an empty string
function maybe(array) {
  if( chance.bool() ) {
    return choice(array);
  } else {
    return '';
  }
}

//response for questions about luck
function pattern_1_answer() {
  return maybe(['Well... ', 'Hmmm... ']) + 'I ' + choice(['can see', 'foresee','see']) + ' ' 
    + choice(['so much','no good','only the best']) + ' ' + choice(['fortune','luck','opportunities']) + ' for you...';
}

//response for questions about love
function pattern_2_answer() {
    return maybe(['That is a tough one!','Hahaha','Ooooh']) +' it is '+ choice(['obvious','clear','easy to see']) +' that you have ' 
        + choice(['a lot of','no','a great']) + ' ' +choice(['love','romance','amour'])+ ' ' +
        choice(['coming your way!','in the future','just around the corner']);
}

//response for questions about wealth
function pattern_3_answer() {
    return maybe(['Typical human!','Well, well, well...','Ooooh...']) + ' You will ' + choice(['never','definitely','soon']) +' '+
    choice(['become','be','feel']) + ' very ' + choice(['rich','walthy','poor']);
}

//if the question has no matches
function default_answer() {
    return choice(['I am an Oracle, not a God!','Ask me something I can see in the crystal ball','I cannot understand your question']);
}

//function that recognizes which group of questions does the user's question belong to, and returns a response for it
function answer(msg) {

  if(matches(msg, pattern_1)) { 
      return pattern_1_answer();
  } 
  else if(matches(msg, pattern_2)) {
      return pattern_2_answer();
  }
  else if(matches(msg, pattern_3)) {
      return pattern_3_answer();
    } 
    else {
        return default_answer();
    }
}

/* ----------------------------------
	Server and Socket Configuration - I haven't changed this bit at all
--------------------------------------*/

// tell express to server our index.html file
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// configure socket.io
// (1) when there is a connection 
io.on('connection', function(socket) {

  console.log('got a connection');
  //io.emit('message from robot', 'Hi! my name is Reihtuag!'); // greetings

  // (2) configure the connected socket to receive custom messages ('message from human')
  // and call the function answer to produce a response
  socket.on('message from human', function(msg) {

  	console.log('got a human message: ' + msg);

  	io.emit('message from robot', answer(msg));      /// <--- call of the function answer defined above 

  });

  socket.on('disconnet', function() {

  	console.log('got a disconnection');
  	
  });

});

/* -------------------
	Start the server
----------------------*/

// listen to connection on port 8088 --> http://localhost:8088
server.listen(8088, function () {
	console.log('listening on port: ' + 8088);
});
 
