const path = require("path");
const http = require("http");

const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");

app.use(express.static(publicPath));

app.get("", (req, res) => {
    res.render(`${publicPath}/index.html`);
});

let count = 0;

io.on("connection", (socket) => {
    console.log("New WS connection");

    socket.emit("message", "Welcome!");
    socket.broadcast.emit("message", "A new user has joined!");

    socket.on("submitMessage", (message) => {
        io.emit("submitMessage", message);
    });

    socket.on("sendLocation", ({ latitude, longitude }) => {
        io.emit(
            "message",
            `User location is: https://google.com/maps?q=${latitude},${longitude}`
        );
    });

    socket.on("disconnect", () => {
        io.emit("message", "A user has left!");
    });
});

server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
