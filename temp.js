const room = "1234";
const user = 34;
var users = {"1234":[2,3]}
users = {...users,[room]:[...users[room],56]}
console.log(users)