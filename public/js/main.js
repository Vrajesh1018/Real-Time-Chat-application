
// This is for client side communication


const chatForm = document.getElementById("chat-form");

const chatMsgs = document.querySelector(".chat-messages");


// Get Username and room from URL
const {username , room} = Qs.parse(location.search,{ignoreQueryPrefix : true});
// We can acess the method because we include cdn of QS at chat.html file

console.log(username , room);



const socket = io();



//When User join a room we emit an event from userEnd and that's why we write below method
socket.emit("joinRoom",{username,room});
// This we will listen at server side and manipulate for separate Rooms 



// Get room and users details 
socket.on("roomUsers",({room , users}) => {

    console.log(room , users);

    outputRoomName(room);
    outputusers(users);

});







//Message from server
socket.on("message",(msg)=>{

    //console.log(msg);

    // Function which takes param and using dom manipulation it will display all the other users.
    outputMessage(msg);


    //To automatically scroll down when new msgs are arrived
    
    chatMsgs.scrollTop = chatMsgs.scrollHeight;  // The value of scroll top will become equal to it's height that's why whenever msg arrived it will automatically scroll down 

});

// When user press send button the form has been submitted hence we add eventListener here
chatForm.addEventListener("submit",(e)=>{


    // If we not prevent then every time form is submiting and the page is reloaded !!
    e.preventDefault(); // Not submitting the form when clicked on send button

    // In form we have input id msg and we want to get it's value so that's why !! e.target.elements.msg.value 
    const msg = e.target.elements.msg.value;
    console.log(msg);

    // Emit message to the server
    socket.emit("chatMsg",msg);


    // After sending msg to clear our input
    e.target.elements.msg.value="";
    e.target.elements.msg.focus();  // to focus after sending msg   

});



function outputMessage(message){

    const div = document.createElement("div");
    div.classList.add("message");

    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;

    document.querySelector(".chat-messages").appendChild(div);

}



// Add room name to DOM
function outputRoomName(room){
    document.getElementById("room-name").innerText = room;

}

// add Users to room
function outputusers(users){

    document.getElementById("users").innerHTML = 
    `${users.map(user =>`<li>${user.username}</li>`).join("")}`; 

}