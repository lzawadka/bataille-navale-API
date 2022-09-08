import dotenv from "dotenv";
import { createServer } from 'http';
import { Server, Socket } from "socket.io";
import express from "express";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData, Player, CountRoom } from "./types";
import { callbackify } from "util";

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

  socket.on("createGame", (gameId, callBack) => {
    joinRoom(socket, gameId, 1);
    const player1: Player = {
      name: "Player 1",
      role: "creator"
    }
    callBack(player1);
    socket.in(gameId).emit("startGame", false);
  })

  socket.on("joinGame", (roomId, callBack) => {
    const isFullRoom: boolean = !!countAllRoom.find(x => x.roomId == roomId && x.clientCount > 2);
    const isRoomReadyToStart: boolean = !!countAllRoom.find(x => x.roomId == roomId && x.clientCount == 2);

    if (!countAllRoom.find(x => x.roomId == roomId)) {
      socket.in(roomId).emit("errorMessage", `Room ${roomId} was not found`);
      throw Error(`Room ${roomId} was not found`);
    }

    if (isFullRoom) {
      socket.in(roomId).emit("errorMessage", `Room ${roomId} is full`);
      throw Error(`Room ${roomId} is full`);
    }

    if (!isRoomReadyToStart) {
      joinRoom(socket, roomId, 2);
      const player2: Player = {
        name: "Player 2",
        role: "opponent",
      }
      callBack(player2)
    }

    io.in(roomId).emit("startGame", isRoomReadyToStart);
  })

  socket.on("updateBoard", (roomId, updatedPoint) => {
    socket
      .broadcast
      .in(roomId)
      .emit("updateOpponentBoard", updatedPoint);
  })

  // socket.on("endGame", (player) => {
  //   socket
  //     .in(player)
  //     .emit("endGame", player)
  // })
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

  if (!!existingRoom)
    countAllRoom[indexExistingRoom] = room;
  else
    countAllRoom.push(room);

  return room;
}

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});