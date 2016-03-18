/**
 * ui.js
 * contains functions dealing with ui elements
 * used by guides and tourists
 */

//variables
var chatBox;
var chat;
var smallChat;
var chatIsMinimised;
var isTypingSpan;
var smallChatColors = {
    no_message: "#2585C4",
    new_message: "#28B294"
};

/**
 * initialises ui variables
 * !needs to be called in document.ready()!
 */
function initUI(){
    chat = $("#chat");
    smallChat = $("#smallChat");
    chatBox = $("#chatBox");
    isTypingSpan = $("#spn_isTyping");
}
/**
 * shows the chat box
 */
function showChat() {
    chatBox.show();
}
/**
 * hides the chat box
 */
function hideChat() {
    chatBox.hide();
}
/**
 * shows the small chat
 */
function showSmallChat() {
    smallChat.show();
}
/**
 * hides the small chat
 */
function hideSmallChat() {
    smallChat.hide();
}
/**
 * Creates a new chat list item and
 * Appends a message sent by me to the chat
 * @param {String} message message to append to chat
 */
function appendMyMessageToChat(message) {

    var m =
            '<li class="right clearfix">'
            + '<span class="chat-img pull-right">'
            + '<img src="resources/images/me.png" alt="My Avatar" class="img-circle">'
            + '</span>'
            + '<div class="chat-body clearfix">'
            + '<div class="header">'
            + '<small class=" text-muted"><span class="glyphicon glyphicon-time"></span>' + getCurrentTime() + '</small>'
            + '<strong class="pull-right primary-font">' + 'me' + '</strong>'
            + '</div>'
            + '<p>' + message + '</p>'
            + '</div>'
            + '</li>'
        ;
    appendMessageToChat(m);
}

/**
 * Creates a new chat list item and
 * appends a message received by the peer to the chat
 * @param {String} message message to append to chat
 * @param {String} peername name of peer who sent the message
 */
function appendPeerMessageToChat(message, peername) {

    var m =
            '<li class="left clearfix">'
            + '<span class="chat-img pull-left">'
            + '<img src="resources/images/peer.png" alt="Peer Avatar" class="img-circle">'
            + '</span>'
            + '<div class="chat-body clearfix">'
            + '<div class="header">'
            + '<strong class="primary-font">' + peername + '</strong> <small class="pull-right text-muted">'
            + '<span class="glyphicon glyphicon-time"></span>' + getCurrentTime() + '</small>'
            + '</div>'
            + '<p>' + message + '</p>'
            + '</div>'
            + '</li>'
        ;
    appendMessageToChat(m);
}
/**
 * Appends a message to the chat
 * @param {String} message html element that will be appended to che chat
 */
function appendMessageToChat(message) {
    chat.append(message);
    scrollToBottomOfChat(chat);
}
/**
 * scrolls to the bottom of the chat if it is not minimised
 */
function scrollToBottomOfChat() {
    //only scroll chat if it is not minimised
    if (!chatIsMinimised) {
        chat.parent().animate({scrollTop: chat.height()});
        //change minimised chat image to indicate new message
    } else {
        setSmallChatNewMessageColor(smallChat);
    }
}
/**
 * hides the "normal" chat and displays the small chat
 */
function changeToSmallChat() {
    chatBox.fadeOut();
    smallChat.fadeIn();
    chatIsMinimised = true;
}
/**
 * hides the small chat and displays the "normal" chaat
 */
function changeToChat() {
    chatBox.fadeIn();
    smallChat.fadeOut();
    chatIsMinimised = false;
    setSmallChatNoMessageColor(smallChat);
}
/**
 * sets the color of the small chat to "new_message"
 */
function setSmallChatNewMessageColor() {
    smallChat.css("background-color", smallChatColors.new_message);
}
/**
 * sets the color of the small chat to "no_message"
 */
function setSmallChatNoMessageColor() {
    smallChat.css("background-color", smallChatColors.no_message);
}
/**
 * adds the name of the peer who is typing + " is typing..." to the chat
 * @param {String} peername name of peer who is typing
 */
function peerIsTyping(peername) {
    console.log(peername + " is typing");
    isTypingSpan.text(peername + " is typing...");
}
/**
 * removes the "[peername] is typing..." from the chat
 */
function peerStoppedTyping() {
    console.log("stopped typing");
    isTypingSpan.text("");
}