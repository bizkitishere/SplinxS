/**
 * guide.connection.js
 * contains function related with the connection on the guide side
 * used by guides
 */

//variables
username = "guide1";

connection.session = {
    data: true
            //, audio: true
};

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: false,
    OfferToReceiveVideo: false
};

connection.open(channel);


connection.onopen = function (event) {
    console.log('connection opened');

    if (connection.alreadyOpened)
        return;
    connection.alreadyOpened = true;

};


connection.onmessage = function (message) {
    console.log('message arrived');

    if (!message.data) {
        console.log('guide empty sctp message');
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
    console.log('guide websoket connected');
    websocket = socket;

    // listen custom messages from server
    socket.on(connection.socketCustomEvent, function (message) {
        if (!message.customMessage) {
            console.log('guide empty websocket message');
            return;
        }
        //message that peer only supports websockets
        //=> I will only websockets too
        if(message.customMessage.connection){
            console.log('guide: peer only supports websockets, will do the same');
            connectionState.DataChannel = connectionStates.DataChannel.Websocket;
            //inform tourist that I only support websockets
            //sendUseWebsocketConnection();
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
        console.log('guide peername: ' + message.username);
        //send message to peer if I do not support sctp
        if(supportsOnlyWebsocket()){
            sendUseWebsocketConnection();
        }
        
        peername = message.username;
        //tourist does not receive the username for some reason...
        sendUsername(username);
        showGUI();
        return;
    }

    messageArrived(message);
}