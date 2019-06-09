var ip = "192.168.1.3";
var server_id;
var call;
var options = {
    'host': ip,
    'port': 9000,
};
var peer = new Peer();
peer.on('open', function (id) {
    console.log('My peer ID is: ' + id);
});
function send_phone_number() {
    var phone_number = document.getElementById("phone_number").value;
    console.log(phone_number);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(JSON.parse(this.responseText));
            response = JSON.parse(this.responseText);
            if (response.status == 'success') {
                document.getElementById("end_button").style.display = "inline";
                document.getElementById("call_button").style.display = "none";
            }
            else
                console.log(response);
        }
    };
    xhttp.open("GET", "signal?action=call&phone_number=" + phone_number, true);
    xhttp.send();
}
function onReceiveStream(remoteStream) {
    var audio = document.getElementById('player');
    audio.srcObject = remoteStream;
    audio.play();
}
function get_server_id() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            server_id = JSON.parse(response).server_id;
        }
    };
    xhttp.open("GET", "signal?action=server_id", true);
    xhttp.send();
}
function initiate_voice() {
    //var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    navigator.getUserMedia({ video: false, audio: true }, function (stream) {
        call = peer.call(server_id, stream);
        call.on('stream', onReceiveStream);
    }, function (err) {
        console.log('Failed to get local stream', err);
    });
}
function call() {
    get_server_id();
    console.log(server_id);
    initiate_voice();
    send_phone_number();
}
function hangup() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(JSON.parse(this.responseText));
            response = JSON.parse(this.responseText);
            if (response.status == 'success') {
                document.getElementById("end_button").style.display = "none";
                document.getElementById("call_button").style.display = "inline";
                document.location.reload()
            }
            else
                console.log(response);
        }
    };
    xhttp.open("GET", "signal?action=end", true);
    xhttp.send();
}

