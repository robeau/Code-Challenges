var socket = io.connect();

function addMessage(msg, nickName) {        //adds message
	$("#chatEntries").append('<div class="message"><p>' + nickName + ': ' + msg + '</p></div>');
};

function sendMessage() {
	if ($('#messageInput').val() != "") {
		socket.emit('message', $('#messageInput').val());
		addMessage($('#messageInput').val(), "Me", new Date().toISOString(), true);
		$('#messageInput').val('');
		socket.emit('stopTyping');      //turns off the typing indicator on send
	}
    
};

function setName() {
	if ($('#nameField').val() != '') {
		socket.emit('setName', $('#nameField').val())
		$('#chatControls').show();
		$('#nameField').hide();
		$('#setNick').hide();
		$('#messageInput').focus();
	}
    $('#entered').append('<p>Now chatting as ' + $('#nameField').val() + '.</p>')
};

function isTyping() {
	socket.emit('typing');
};

function setIndicator(){
    $('#typingIndicator').css("visibility", "visible");
}

function unsetIndicator(){
    $('#typingIndicator').css("visibility", "hidden");
}

socket.on('message', function(data) {
	addMessage(data['message'], data['nickName']);
});

socket.on('typing', function(data) {
	setIndicator();
});

socket.on('stopTyping', function(data) {
	unsetIndicator();
});

$(function() {
	$('#chatControls').hide();
	$('#setNick').click(function() {
		setName();
	});
	$('#submit').click(function() {
		sendMessage();
	});
});