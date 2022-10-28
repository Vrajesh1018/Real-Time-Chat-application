
const users = [];


//join Users To chat
function userJoin(id, username, room) {

    const user = { id, username, room };


    users.push(user);  // Every Time new user there it will store the details in This Users Array

    //console.log(users);

    return user;  // new User Joined this method will return that one.

}


// Get Current user From an users Array based on id
function getCurrentUser(id) {

    // It will check into the user array and match our param id with each user id and return the current user from that users Array
    // console.log(users.find(user =>  user.id === id )
    // );
    return users.find(user => user.id == id);

}


//User leaves the chat
function userLeave(id){
    const index = users.findIndex(user => user.id === id);

    console.log("From User.js index is : "+index);
    console.log(users);
    if(index !== -1){
        // at index removes 1 element 
        // Doubt ? why always 0th index return ? 
        return users.splice(index,1)[0]; //  removes element from an array and returning the 0th index means of that removable array's 0th index 
    }


}


// Function for getRoom users 
function getRoomUsers(room){
    return  users.filter(user => user.room === room);

}




module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};


