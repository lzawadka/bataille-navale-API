import dotenv from "dotenv";
import { createServer } from 'http';
import { Server } from "socket.io";
import express, { Response } from "express";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./types";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
  cors: {
    origin: "http://localhost:3000"
  }
});

app.get("/", (_, res: Response) => {
  res.send("Express + TypeScript Server");
});

// Server to client
io.on("connection", (socket) => {
  console.log(socket.id);
  // works when broadcasting to a room
  //io.to("room1").emit("basicEmit", 1, "2", Buffer.from([3]));
});

// // Client to server
// io.on("connection", (socket) => {
//   socket.on("hello", () => {
//     console.log("hey")
//   });
// });

httpServer.listen(8000, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});