import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./types";
const { createServer } = require("http");
const express = require("express");

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {});

// Server to client
io.on("connection", (socket) => {
  console.log(socket.id);
  
  // works when broadcasting to a room
  //io.to("room1").emit("basicEmit", 1, "2", Buffer.from([3]));
});

// Client to server
io.on("connection", (socket) => {
  socket.on("hello", () => {
    console.log("hey")
  });
});

httpServer.listen(3000);