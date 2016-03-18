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

    sendUsername(username);
    
    showChat();
    
    /*
     if (connection.peers.getLength() > 0) {
     peer = connection.peers.selectFirst().peer;
     }
     */
};

connection.onmessage = function (message) {
    if(!message.data){
        console.log('no data in message');
        return;
    }

    if (message.data.typing) {
        peerIsTyping(peername);
        return;
    }
    if (message.data.stoppedTyping) {
        peerStoppedTyping();
        return;
    }
    if (message.data.username) {
        peername = message.data.username;
        return;
    }

    console.log('message: ' + message.data);
    debugger;
    messageArrived(message.data);
};

/**
 * fires when the signalling websocket was connected successfully
 * this socket will be used as a fall back if SCTP is not available
 * @param {Websocket} socket Websocket used for signalling and sending other messages
 */
connection.connectSocket(function (socket) {
    console.log('tourist websoket connected');
    websocket = socket;
    
    sendUsername(username);
    
    // listen custom messages from server
    socket.on(connection.socketCustomEvent, function (message) {
        //console.log('message arrived: ' + message.customMessage);

        if(!message.customMessage){
            console.log('tourist no custom message');
            return;
        }
        
        if (message.customMessage.typing) {
            console.log('tourist peer typing');
            peerIsTyping(peername);
            return;
        }
        if (message.customMessage.stoppedTyping) {
            console.log('tourist peer stopped typing');
            peerStoppedTyping();
            return;
        }
        if (message.customMessage.username) {
            console.log('tourist username: ' + message.customMessage.username);
            peername = message.customMessage.username;
            return;
        }
        
        messageArrived(message.customMessage);
    });
});