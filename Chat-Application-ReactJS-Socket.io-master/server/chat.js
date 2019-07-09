module.exports = function (io, _) {
  let usersHistory = [];
  let freeId = [];
  let online = [];
  io.on('connection', (socket) => {
    let id = !freeId[0]?_.uniqueId('user_'):freeId[0];
    freeId.shift();
    socket.emit("assigning-userid-and-history", {userId:id, history:usersHistory, onlineUsers:online});
    console.log(`New connection detected id assigned: ${id}`);
    socket.on("new-message", (msg) => {
      //_.merge(msg, {userId:id});
      usersHistory.push(msg);
      console.log(`New Message: ${msg.message} from: ${msg.userName}`);
      io.emit("receive-message", msg);
    });
    let userCapture="";
    socket.on("new-user", (userName) => {
      userCapture=userName;
      online.push(userName);
      console.log(`${userName} Joined!`);
      io.emit("list-online", online);
      io.emit("user-joined", userName);
    });
    socket.on("disconnect", () => {
      console.log("One connection was closed!");
      console.log(`${userCapture} Left!`);
      freeId.push(id);
      freeId.sort();
      _.remove(online, (n) => {return n==userCapture;});
      io.emit("user-left", userCapture);
      io.emit("list-online", online);
      console.log(`Free user ids: ${freeId}`);
    });
  });
};