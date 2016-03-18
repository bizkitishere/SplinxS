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

    sendUsername(username);
    
    showChat();
    
    //peername = event.extra.username;
    
    /*
    if (connection.peers.getLength() > 0) {
        peer = connection.peers.selectFirst().peer;
    }

    peer.onaddstream = function (event) {
        console.log('peer added stream');

        debugger;
    }
    */
};


connection.onmessage = function (message) {
    console.log('message arrived');
    
    if(!message.data){
        console.log('no data in message');
        return;
    }
    
    if (message.data.typing) {
        console.log('peer is typing');
        peerIsTyping(peername);
        return;
    }
    if (message.data.stoppedTyping) {
        console.log('peer stopped typing');
        peerStoppedTyping();
        return;
    }
    if (message.data.username) {
        peername = message.data.username;
        return;
    }
    
    console.log('message: ' + message.data);
    messageArrived(message.data);
};

/**
 * fires when the signalling websocket was connected successfully
 * this socket will be used as a fall back if SCTP is not available
 * @param {Websocket} socket Websocket used for signalling and sending other messages
 */
connection.connectSocket(function (socket) {
    console.log('guide websoket connected');
    websocket = socket;
    
    sendUsername(username);
    
    // listen custom messages from server
    socket.on(connection.socketCustomEvent, function (message) {
        //console.log('message arrived: ' + message.customMessage);

        if(!message.customMessage){
            console.log('guide no custom message');
            return;
        }
        
        if (message.customMessage.typing) {
            console.log('guide peer typing');
            peerIsTyping(peername);
            return;
        }
        if (message.customMessage.stoppedTyping) {
            console.log('guide peer stopped typing');
            peerStoppedTyping();
            return;
        }
        if (message.customMessage.username) {
            console.log('guide username: ' + message.customMessage.username);
            peername = message.customMessage.username;
            //tourist does not receive the username for some reason...
            sendUsername(username);
            return;
        }
        
        messageArrived(message.customMessage);
    });
});