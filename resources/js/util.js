/**
 * util.js
 * contains functions useful for the application's daily business
 * used by guides and tourists
 */

//variables
var audioPlayer;
var sounds;
var isTypingTimeout = null;
var typingTimeout = 2000;


/**
 * initialises the used variables
 * !needs to be called in document.ready()!
 */
function initSplinxS() {
    audioPlayer = $("#audioPlayer").get(0);

    sounds = {
        call_ring: "resources/sounds/call/den_den_mushi_1.mp3",
        call_answer: "resources/sounds/call/den_den_mushi_gotcha_1.mp3",
        call_dial: "",
        message_arrival: "resources/sounds/message/arrival.mp3"
    };

    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

}

/*
 function sendCustomMessage(message){
 message.userid = connection.userid;
 message.extra = connection.extra;
 connection.sendCustomMessage(message);
 }
 */



/**
 * gets the current time in the format HH:MM:SS
 * @returns {String} returns the current time in the format HH:MM:SS
 */
function getCurrentTime() {
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

/**
 * plays a sound or does nothing if the specified sound does not exist
 * @param {sounds} sound sound that should be played
 */
function playSound(sound) {
    console.log('play sound: ' + sound);

    switch (sound) {
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

    if (audioPlayer.src != "") {
        console.log('playing sound');
        audioPlayer.play();
    }
}

/**
 * stops the sound that might be playing
 */
function stopSound() {
    audioPlayer.pause();
}
/**
 * causes the device to vibrate (if supported by the device)
 * uses a predefined pattern
 */
function vibrate() {
    if (navigator.vibrate) {
        console.log('vibrating');
        // vibration API supported
        navigator.vibrate([150, 100, 100, 100, 150]); // intervall, pause, intervall, pause...
    }
}



/**
 * sends a message to the peer that I am typing
 */
function meIsTyping() {
    console.log('me is typing');
    //will send the typing message only if it is already expired => saves data
    if (isTypingTimeout == null) {
        sendMessageToPeer({
            typing: true
        }, false);
    }
    clearTimeout(isTypingTimeout);
    isTypingTimeout = setTimeout(meStoppedTyping, typingTimeout);
}
/**
 * sends a message to the peer that I stopped typing
 */
function meStoppedTyping() {
    console.log('me stopped typing');
    isTypingTimeout = null;
    sendMessageToPeer({
        stoppedTyping: true
    }, false);
}

