import dotenv from "dotenv";
import { createServer } from 'http';
import { Server, Socket } from "socket.io";
import express from "express";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData, Player, CountRoom } from "./types";

// #region config
dotenv.config();
const port: number = 8080;
const app = express();
const httpServer = createServer(app);
let countAllRoom: CountRoom[] = [];
// #endregion config

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
  cors: {
    origin: "http://localhost:3000"
  }
});

io.on("connection", (socket) => {

  socket.on("createGame", (callBack) => {
    const roomId: string = socket.id;
    joinRoom(socket, roomId, 1);
    const player1: Player = {
      name: "Player 1",
      roomId: roomId,
      role: "creator"
    }
    callBack(player1);
    socket.emit("initGame", false);
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

    socket.emit("initGame", true);
  })

  socket.on("updateBoard", (roomId, updatedPoint) => {
    socket
      .broadcast
      .in(roomId)
      .emit("updateOpponentBoard", updatedPoint);
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

function countPlayerInRoom(
  roomId: string, 
  countToSet: number
  ): CountRoom {
  const existingRoom: CountRoom | undefined = countAllRoom.find(x => x.roomId == roomId);
  const indexExistingRoom: number = countAllRoom.findIndex(x => x.roomId == roomId)
  let room: CountRoom = {
    roomId,
    clientCount: countToSet
  };
  
  if(!!existingRoom)
    countAllRoom[indexExistingRoom] = room;
  else
    countAllRoom.push(room);

  return room;
}

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});