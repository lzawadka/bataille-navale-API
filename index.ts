import dotenv from "dotenv";
import { createServer } from 'http';
import { Server, Socket } from "socket.io";
import express, { Response } from "express";
import { Board, ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData, Player, CountRoom } from "./types";
import { StringifyOptions } from "querystring";
import { callbackify } from "util";

dotenv.config();

const port: number = 8080;
const app = express();
const httpServer = createServer(app);
let countAllRoom: CountRoom[] = [];

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

  socket.on("createGame", (callBack) => {
    const roomId: string = socket.id;
    joinRoom(socket, roomId, 1);
    const player1: Player = {
      name: "Player 1",
      roomId: roomId,
      role: "creator"
    }
    callBack(player1)
  })

  socket.on("joinGame", (roomId, callBack) => {
    const isRoomFull: boolean = !!countAllRoom.find(x => x.roomId == roomId && x.clientCount == 2);

    if(!countAllRoom.find(x => x.roomId == roomId))
      socket.emit("errorMessage", `Room ${roomId} whas not found`);

    if(isRoomFull)
      socket.emit("errorMessage", `Room ${roomId} is full`)

    joinRoom(socket, roomId, 2);
    const player2: Player = {
      name: "Player 2",
      roomId: roomId,
      role: "opponent",
    }
    callBack(player2)
  })

  socket.on("updateBoard", (roomId, board) => {
    socket
      .broadcast
      .in(roomId)
      .emit("updateOpponentBoard", board);
  })

  socket.on("endGame", (player) => {
    socket
      .in(player.roomId)
      .emit("endGame", player)
  })
});

function joinRoom(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, 
  roomId: string, 
  count: number
  ): void {
  socket.join(roomId);
  countPlayerInRoom(roomId, count);
}

function countPlayerInRoom(roomId: string, countToSet: number): CountRoom {
  let room: CountRoom = {
    roomId,
    clientCount: countToSet
  }
  countAllRoom.push(room);
  return room;
}

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});