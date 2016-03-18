/**
 * connection.js
 * contains function related with the connection between guide and tourist
 * used by guides and tourists
 */

//variables
var connectionState = {
    DataChannel : {},
    Media: {}
};
var connectionStates = {
    DataChannel: {
        Websocket: "Websocket",
        SCTP: "SCTP" 
    },
    Media: {
        None: "None",
        Audio: "Audio",
        Video: "Video",
        AudioVideo: "AudioVideo"
    }
};
var websocket;

var username;
var peername;

/**
 * checks what Webrtc features are supported by the browser
 */
DetectRTC.load(function() {
    if(DetectRTC.isSctpDataChannelsSupported) {
        connectionState.DataChannel = connectionStates.DataChannel.SCTP;
    }else{
        connectionState.DataChannel = connectionStates.DataChannel.Websocket;
    }
    if(!DetectRTC.browser.isChrome && !DetectRTC.browser.isFirefox && !DetectRTC.browser.isOpera){
        console.log('webrtc is not supported...');
        connectionState.DataChannel = connectionStates.DataChannel.Websocket;
        connectionState.Media = connectionStates.Media.None;
        //return;
    }
    //TODO check for audio, video, etc.
});

var connection = new RTCMultiConnection();
connection.socketURL = '/';

//TODO remove once other things work
var channel = "myGuideChannel1";
//TODO remove once other things work
connection.channel = channel;

/**
 * sends a message to the peer using either SCTP or Websocket
 * if the message contains characters
 * appends it to the chat, if desired
 * @param {String} message message to send to the peer
 * @param {boolean} appendChat true if message should be appended to the chat
 */
function sendMessageToPeer(message, appendChat) {
    if ($.trim(message).length > 0) {
        if (connectionState.DataChannel == connectionStates.DataChannel.SCTP) {
            sendMessageSCTP(message);
        } else if (connectionState.DataChannel == connectionStates.DataChannel.Websocket) {
            sendMessageWebsocket(message);
        }
        if (appendChat) {
            appendMyMessageToChat(message);
        }
    }
}
/**
 * sends a message to the peer by using SCTP
 * @param {String} message message to send
 */
function sendMessageSCTP (message){
    connection.send(message);
}
/**
 * sends a message to the peer by using a websocket
 * @param {String} message message to send
 */
function sendMessageWebsocket(message) {
    websocket.emit(connection.socketCustomEvent, {
        sender: connection.userid,
        customMessage: message
    });
}

/**
 * sends my username to the peer
 * @param {String} name my username
 */
function sendUsername(name) {
    if (name) {
        sendMessageToPeer({
            username: name
        }, false);
    }
}
/**
 * when a message arrived from SCTP or Websocket this function has to be called
 * plays a sound, appends the message to the chat, vibrates
 * @param {String} message message sent by the peer
 */
function messageArrived(message){
    console.log('messageArrived: ' + message);
    //play message sound
    playSound(sounds.message_arrival);
    appendPeerMessageToChat(message, peername);
    vibrate();
}

/**
 * closes the current connection
 */
function closeConnection() {
    connection.close();
    connection.attachStreams.forEach(function (stream) {
        stream.stop();
    });
}
/**
 * closes all media streams
 * !does not affect sctp/websocket text chat!
 */
function stopStreams(){
    connection.attachStreams.forEach(function (stream) {
        stream.stop();
    });
}

//TODO delete?
function stopVideo() {
    //removes all media streams
    connection.attachStreams.forEach(function (stream) {
        stream.stop();
    });
}