/**
 * tourist.connection.js
 * contains function related with the connection on the tourist side
 * used by tourists
 */

//variables
username = "tourist";

connection.session = {
    data: true
            //, audio: true
            //, video: true
};

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: false,
    OfferToReceiveVideo: false
};

connection.onopen = function (event) {
    console.log('connection opened');

    if (connection.alreadyOpened)
        return;
    connection.alreadyOpened = true;

};

connection.onmessage = function (message) {
    if (!message.data) {
        console.log('tourist empty sctp message');
        return;
    }
    onMessage(message.data);
};

/**
 * fires when the signalling websocket was connected successfully
 * this socket will be used as a fall back if SCTP is not available
 * @param {Websocket} socket Websocket used for signalling and sending other messages
 */
connection.connectSocket(function (socket) {
    console.log('tourist websoket connected');
    websocket = socket;
    
    //send message to peer if I do not support sctp
    /*
    if(supportsOnlyWebsocket()){
        sendUseWebsocketConnection();
    }
    console.log('tourist: will send username');
    sendUsername(username);
    */
    
    // listen custom messages from server
    socket.on(connection.socketCustomEvent, function (message) {
        if (!message.customMessage) {
            console.log('tourist empty websocket message');
            return;
        }
        //message that peer only supports websockets
        //=> I will only websockets too
        if(message.customMessage.connection){
            console.log('tourist: peer only supports websockets, will do the same');
            connectionState.DataChannel = connectionStates.DataChannel.Websocket;
            return;
        }
        onMessage(message.customMessage);
    });
});
/**
 * checks what kind of message arrived acts accordingly
 * @param {String} message message sent by peer
 */
function onMessage(message) {
    if (message.typing) {
        console.log('guide peer typing');
        peerIsTyping(peername);
        return;
    }
    if (message.stoppedTyping) {
        console.log('guide peer stopped typing');
        peerStoppedTyping();
        return;
    }
    if (message.username) {
        console.log('tourist peername: ' + message.username);
        
        //send message to peer if I do not support sctp
        /*
        if(supportsOnlyWebsocket()){
            sendUseWebsocketConnection();
        }
        */
        
        peername = message.username;
        //tourist does not receive the username for some reason...
        /*
        if(!peername){
            sendUsername(username);
        }
        */
        
        if(!supportsOnlyWebsocket()){
            console.log('joining channel: ' + channel);
            connection.join(channel);
        }
        showGUI();
        return;
    }

    messageArrived(message);
}

function initConnectionWithGuide() {
    if (supportsOnlyWebsocket()) {
        sendUseWebsocketConnection();
    }
    sendUsername(username);
    
}