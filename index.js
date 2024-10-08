import { Server } from "socket.io";
import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
// import { configDotenv } from "dotenv";
// configDotenv();

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = process.env.port || 3000;

const rooms = [];
var users = {};

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use("/assets", express.static(join(__dirname, "assets")));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

app.get("/roomDetails", (req, res) => {
  const { type, room, user } = req.query;

  if (type == "Enter") {
    if (rooms.includes(room)) {
      let userFound = users[room].includes(user);
      if (userFound)
        return res
          .status(400)
          .send({ success: false, msg: "Username already exists" });
      users = users = { ...users, [room]: [...users[room], user] };
      return res.status(200).send({ success: true, users });
    } else
      return res
        .status(404)
        .send({ success: false, msg: "Room Not available" });
  } else {
    if (!rooms.includes(room)) {
      rooms.push(room);
      users[room] = [];
      users = users = { ...users, [room]: [...users[room], user] };
      return res.status(200).send({ success: true, users });
    } else
      return res
        .status(400)
        .send({ success: false, msg: "Room already exists" });
  }
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("chat", (msg, roomNo, user) => {
    console.log(msg, roomNo, user);
    socket.broadcast.emit("chat", msg, roomNo, user);
  });

  socket.on("entered", (username, room) => {
    console.log(username, room);
    socket.broadcast.emit("entered", username, room);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

console.log(import.meta.url);
server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
console.log(process.env.FT);
