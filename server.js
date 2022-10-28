
const express = require("express");
const path = require('path');
const http = require("http");

const socketio = require("socket.io");

//Code which is written in utils 
const formatMessage = require("./utils/messages");
//formatMessage Function takes username and text as a param and return JSON object which return username , text and time using moment library



const { userJoin, getCurrentUser ,userLeave , getRoomUsers } = require("./utils/users");
// users.js contains an user array which  contain details of user like username , id and room name and it has two method userJoin and getCurrentUser(id);





const botName = "Chat-cord Bot";



/*

Server.io create a connection with stay open throghout the communication
in case of AJAX request 
fetch , ajax ====> server wiil respond and connection closed 
want to make 10 request then every time it will make fetch request and this how socket.io is different

we are setting up something called websocket
now connection stay open so we can communicate and after communication it will closed .



*/



const app = express();
const server = http.createServer(app);

const io = socketio(server);
//Set static folder
app.use(express.static(path.join(__dirname, 'public')));



/* About on method of socket.io

// In your code example, io is a Socket.IO server instance attached to an instance of http.Server listening for incoming events.

// The socket argument of the connection event listener callback function is an object that represents an incoming socket connection from a client.

*/


io.on("connection", (socket) => {

   // console.log(socket);
   //console.log("Hello !!!");






   // From client side we get username and roomname throgh and object and we manipulate for separate room of different channel
   socket.on("joinRoom", ({ username, room }) => {

      console.log(username, room);



      // When new User join the room we want that user stored an users Array that it there in users.js 
      const user = userJoin(socket.id, username, room);


      // https://socket.io/docs/v3/rooms/ 
      // This method will create rooms on server side of  based on room query which is there in user JSON object for more detail visit above link of socket docs.
      socket.join(user.room);







      // This method will emit the message from server side and at client side means in main.js we use to socket.on() method and a callback function which has param containing this msg on client side .

      socket.emit("message", formatMessage(botName, "Welcome to chat-cord"));   //Single client
      // The above method will emit when a single user connecting 


      //Broadcast when a user connects 
      socket.broadcast.to(user.room).emit("message", formatMessage(botName, ` ${user.username} has joined the chat`));  // all client accept that connecting
      //The above method will emit everybody accept the user that connecting we need to notify the user that he/she connecting



      //send users and room info to the client side and we listen at client side       
      io.to(user.room).emit("roomUsers",{
         room : user.room,
         users : getRoomUsers(user.room)
      });
      // At time of disconnect we want same thing to be happend 






   });






   //Listen for chat msg
   socket.on("chatMsg", (msg) => {

      const userc = getCurrentUser(socket.id);
      console.log("I am from chatMsg method " + userc.username);
      console.log("I am from chatMsg method " + userc.room);
      io.to(userc.room).emit("message", formatMessage(userc.username, msg));  //This will emit  msg to all the users in chat (means it will listen by socket.on("msg",(msg)=>{})) which is there on client side means at main.js


      console.log(msg);
   });




   // io.emit(); // All the client in general

   // This runs when client disconnects
   socket.on("disconnect", () => {
      
      const userd = userLeave(socket.id);

      // console.log("I am from Disconnect !!");
      // console.log(userd.username);
      // as user name is become conflicting that's why for disconnect we here user userd

      // If user exists
      if(userd){
         io.to(userd.room).emit("message", formatMessage(botName, ` ${userd.username} has left the chat `));  // we want to inform all the client !!


         // as user leave the room we want to update the current users list of that room
         io.to(userd.room).emit("roomUsers",{
            room : userd.room,
            users : getRoomUsers(userd.room)
         });

      }
   });


});



// server-side
// io.on("connection", (socket) => {
//     socket.emit("hello", "world"); // This will emit an event means it's telling that when ever we listen of hello at that time the callback function param  contains that details here we have world !

//   });

//   // client-side
//   socket.on("hello", (arg) => {
//     console.log(arg); // world
//   });





server.listen(3000, () => { console.log("Server started on PORT 3000"); })