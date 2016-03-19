/**
 * connection.js
 * contains function related with the connection between guide and tourist
 * used by guides and tourists
 */

//variables
var connectionState = {
    DataChannel: {},
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
DetectRTC.load(function () {
    if (DetectRTC.isSctpDataChannelsSupported) {
        connectionState.DataChannel = connectionStates.DataChannel.SCTP;
    } else {
        connectionState.DataChannel = connectionStates.DataChannel.Websocket;
    }
    if (!DetectRTC.browser.isChrome && !DetectRTC.browser.isFirefox && !DetectRTC.browser.isOpera) {
        console.log('webrtc is not supported...');
        connectionState.DataChannel = connectionStates.DataChannel.Websocket;
        connectionState.Media = connectionStates.Media.None;
    }else if(DetectRTC.browser.isChrome || DetectRTC.browser.isFirefox || DetectRTC.browser.isOpera){
        if(DetectRTC.hasMicrophone && DetectRTC.hasWebcam){
            connectionState.Media = connectionStates.Media.AudioVideo;
        }else{
            if(DetectRTC.hasMicrophone){
                connectionState.Media = connectionStates.Media.Audio;
            }else if(DetectRTC.hasWebcam){
                connectionState.Media = connectionStates.Media.Video;
            }
        }
    }
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
function sendMessageSCTP(message) {
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
 * sends a message to the peer that this connection should only use websockets
 * by using websocket
 */
function sendUseWebsocketConnection() {
    console.log('sending only websocket supported');
    sendMessageWebsocket({
        connection: connectionStates.DataChannel.Websocket
    });
}
/**
 * sends my username to the peer by using websocket
 * @param {String} name my username
 */
function sendUsername(name) {
    if (name) {
        sendMessageWebsocket({
            username: name
        }, false);
    }
}
/**
 * when a message arrived from SCTP or Websocket this function has to be called
 * plays a sound, appends the message to the chat, vibrates
 * @param {String} message message sent by the peer
 */
function messageArrived(message) {
    console.log('messageArrived: ' + message);
    //play message sound
    playSound(sounds.message_arrival);
    appendPeerMessageToChat(message, peername);
    vibrate();
}
/**
 * checks if only websocket is supported
 * @returns {Boolean} true if connection supports only websocket
 */
function supportsOnlyWebsocket(){
    return connectionState.DataChannel == connectionStates.DataChannel.Websocket;
}
/**
 * checks if media is supported
 * @returns {Boolean} true if no media is supported
 */
function noMediaSupported(){
    return connectionState.Media == connectionStates.Media.None;
}
/**
 * checks if only audio is supported
 * @returns {Boolean} true if no media is supported
 */
function supportsAudioOnly(){
    return connectionState.Media == connectionStates.Media.Audio;
}
/**
 * checks if only video is supported
 * @returns {Boolean} true if no media is supported
 */
function supportsVideoOnly(){
    return connectionState.Media == connectionStates.Media.Video;
}
/**
 * checks if audio and video is supported
 * @returns {Boolean} true if no media is supported
 */
function supportsAudioVideo(){
    return connectionState.Media == connectionStates.Media.AudioVideo;
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
function stopStreams() {
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