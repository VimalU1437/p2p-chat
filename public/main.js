const socket = io();
const msg = document.querySelector(".msg");
const btn = document.getElementById("connect")
const send = document.querySelector(".send");
const txt = document.querySelector(".txt");
const videoElm = document.querySelector(".stream");
const myvid = document.querySelector(".myvid")

// console.log(socket);

const iceConfiguration = { }
iceConfiguration.iceServers = [{
                urls: 'stun:stun1.l.google.com:19302'
            }];

 let lc = new RTCPeerConnection(iceConfiguration);
 let answer;

lc.onicecandidate = e =>{
    console.log("new ice candidate");
    // console.log(lc.localDescription);
    socket.emit("offer",lc.localDescription);
}



const sendChannel = lc.createDataChannel("sendChannel");
     sendChannel.onmessage =e =>  {
        const p = document.createElement("p");
        p.textContent = "Peer A : "+ e.data;
        msg.appendChild(p);
     }
       sendChannel.onopen = e => {
        alert("open for chat");
        send.disabled = false;
    };
         sendChannel.onclose =e => {
            alert("chat closed!!!!!!")
            send.disabled = true
         };


send.onclick = e=>{
    sendChannel.send(txt.value);
    const p = document.createElement("p");
    p.textContent = "Peer B : "+ txt.value;
    msg.appendChild(p);

    txt.value = "";
}
btn.onclick = ()=>{
    navigator.mediaDevices.getUserMedia({
        video:true
    }).then(stream=>{
        console.log(stream.getVideoTracks());
        // myvid.srcObject = stream;
        lc.addTrack(stream.getVideoTracks()[0],stream);
        lc.createOffer().then(o=>lc.setLocalDescription(new RTCSessionDescription(o)));
    })
    lc.ontrack = e => {
        console.log("on track");
        console.log(e);
        videoElm.srcObject = e.streams[0];
    }
}


socket.on("answer",answer=>{
    // console.log(answer);
    lc.setRemoteDescription(new RTCSessionDescription(answer)).then(()=>{
        
        console.log("done");
        
    }
        );
})








