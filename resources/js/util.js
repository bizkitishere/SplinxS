var audioPlayer;
var sounds;
var isTypingTimeout = null;
var typingTimeout = 2000;
var chatIsMinimised;


function initSplinxS(){
	
	
	audioPlayer = $("#audioPlayer").get(0);
	
	sounds = {
			call_ring : "resources/sounds/call/den_den_mushi_1.mp3",
			call_answer : "resources/sounds/call/den_den_mushi_gotcha_1.mp3",
			call_dial : "",
			message_arrival: "resources/sounds/message/arrival.mp3"
		};
	
	smallChatColors = {
		no_message : "#2585C4",
		new_message : "#28B294"
	}
	
	navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
	
}		

function sendCustomMessage(message){
	message.userid = connection.userid;
    message.extra = connection.extra;
	connection.sendCustomMessage(message);
}		

function sendMessageToPeer(message, name){
				connection.send(message);
				appendMyMessageToChat(message);
			}
function appendMyMessageToChat(message){
			
			var m =			
			'<li class="right clearfix">'
			+	'<span class="chat-img pull-right">'
			+		'<img src="resources/images/me.png" alt="My Avatar" class="img-circle">'
			+	'</span>'
			+	'<div class="chat-body clearfix">'
			+		'<div class="header">'
			+			'<small class=" text-muted"><span class="glyphicon glyphicon-time"></span>' + getCurrentTime() + '</small>'
			+			'<strong class="pull-right primary-font">' + 'me' + '</strong>'
			+		'</div>'
			+		'<p>' + message + '</p>'
			+	'</div>'
			+'</li>'
			appendMessageToChat(m);
		}
		
		function appendPeerMessageToChat(message, username){
			
			var m = 
			'<li class="left clearfix">'
			+	'<span class="chat-img pull-left">'
			+		'<img src="resources/images/peer.png" alt="Peer Avatar" class="img-circle">'
			+	'</span>'
			+	'<div class="chat-body clearfix">'
			+		'<div class="header">'
			+			'<strong class="primary-font">' + username + '</strong> <small class="pull-right text-muted">'
			+				'<span class="glyphicon glyphicon-time"></span>' + getCurrentTime() + '</small>'
			+		'</div>'
			+		'<p>' + message + '</p>'
			+	'</div>'
			+'</li>'
			appendMessageToChat(m);
		}
		
		function appendMessageToChat(message){
			var chat = $("#chat");
			chat.append(message);
			scrollToBottomOfChat(chat);
		}
		
		function scrollToBottomOfChat(chat){
			//only scroll chat if it is not minimised
			if(!chatIsMinimised){
				chat.parent().animate({scrollTop: chat.height()});
			//change minimised chat image to indicate new message
			}else{
				var smallChat = $("#smallChat");
				setSmallChatNewMessageColor(smallChat);
			}
		}
		
		function getCurrentTime(){
			var currentTime = new Date();
			var hours = currentTime.getHours();
			var minutes = currentTime.getMinutes();
			var seconds = currentTime.getSeconds();
			
			hours = hours < 10 ? "0" + hours : hours;
			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;

			var currentTime = hours + ":" + minutes + ":" + seconds;
		
			return currentTime;
		}
		
		function showChat(){
			$("#chatBox").show();
		}
		
		function hideChat(){
			$("#chatBox").hide();
		}
		
		function showSmallChat(){
			$("#smallChat").show();
		}
		
		function hideSmallChat(){
			$("#smallChat").hide();
		}
		
		function changeToSmallChat(){
			$("#chatBox").fadeOut();
			$("#smallChat").fadeIn();
			chatIsMinimised = true;
		}
		
		function changeToChat(){
			$("#chatBox").fadeIn();
			var smallChat = $("#smallChat").fadeOut();
			chatIsMinimised = false;
			setSmallChatNoMessageColor(smallChat);
		}
		
		function setSmallChatNewMessageColor(chat){
			chat.css("background-color", smallChatColors.new_message);
		}
		
		function setSmallChatNoMessageColor(chat){
			chat.css("background-color", smallChatColors.no_message);
		}
		
		
//play a sound
	function playSound(sound){
		console.log('play sound: ' + sound);
		
		switch(sound){
			case sounds.call_answer:
				audioPlayer.src = sounds.call_answer;
				break;
			case sounds.call_ring:
				audioPlayer.src = sounds.call_ring;
				break;
			case sounds.message_arrival:
				audioPlayer.src = sounds.message_arrival;
				break;
			default:
				audioPlayer.src = "";
				break;
		
		}

		if(audioPlayer.src != "") {
			console.log('playing sound');
			audioPlayer.play();
		}
	}
	
	//stopps the current sound
	function stopSound(){
		audioPlayer.pause();
	}
	
function vibrate(){
	if (navigator.vibrate) {
		console.log('vibrating');
		// vibration API supported
		navigator.vibrate([150, 100, 100, 100, 150]); //vibration intervall, pause
	}
}

function sendUsername(name){
	if(name){
		connection.send({
			username: name
		});
	}
}


function meIsTyping(){
			console.log('me is typing');
			//will send the typing message only if it is already expired => saves data
			if(isTypingTimeout == null){
				connection.send({
					typing: true
				});
			}
			clearTimeout(isTypingTimeout);
			isTypingTimeout = setTimeout(meStoppedTyping, typingTimeout); 
		}
		
		function meStoppedTyping(){
			console.log('me stopped typing');
			isTypingTimeout = null;
			connection.send({
				stoppedTyping: true
			});
		}
		
		function peerIsTyping(span, name){
			console.log(name + " is typing");
			span.text(name + " is typing...");
		}
		
		function peerStoppedTyping(span){
			console.log("stopped typing");
			span.text("");
		}