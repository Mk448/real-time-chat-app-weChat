const express = require('express');
require('dotenv').config()
const app = express();
const dbConfig = require("./config/dbConfig");
const bodyParser = require('body-parser');
const cors = require('cors')

app.use(bodyParser.json({ limit: "32mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "32mb", extended: true }));
app.use(cors());


const port = process.env.PORT || 5000;

const usersRoute = require("./routes/usersRoutes");
const chatsRoute = require("./routes/chatsRoutes");
const messagesRoute = require("./routes/messageRoute");
app.use(express.json({
    limit: "50mb",
}) );

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    },
});

// check the connection of socket from client.
let onlineUsers = [];
io.on("connection", (socket) => {
    // sockets events will be here
    socket.on("join-room", (userId) => {
        socket.join(userId);
    });

    // send message to clients (who are in the members array)
    socket.once("send-message", (message) => {
        io.to(message.members[0]).to(message.members[1]).emit("receive-message", message);
    })

    // clear unread messages.
    socket.on("clear-unread-messages", (data) => {
        io.to(data.members[0])
           .to(data.members[1])
           .emit("unread-messages-cleared", data);

    });

    // typing event.
    socket.on("typing", (data) => {
        io.to(data.members[0])
          .to(data.members[1])
          .emit("started-typing", data);
    });

    // online users
    socket.on("came-online", (userId) => {
        if(!onlineUsers.includes(userId)){
            onlineUsers.push(userId);
        }
        io.emit("online-users", onlineUsers);
    })

    socket.on("went-offline", (userId) => {
        onlineUsers = onlineUsers.filter((user) => user != userId);
        io.emit("online-users-updated", onlineUsers);
    });

}); 

// check the connection of socket from client
io.on("connection", (socket) => {
    // socket operations
    console.log("conected with socketid", socket.id);
});

app.use("/api/users", usersRoute);
app.use("/api/chats", chatsRoute);
app.use("/api/messages", messagesRoute);

server.listen(port, () => console.log(`Server running at port ${port}`));