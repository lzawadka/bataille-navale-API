import dotenv from "dotenv";
import { createServer } from 'http';
import { Server, Socket } from "socket.io";
import express, { Response } from "express";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData, Player, CountRoom } from "./types";
import { StringifyOptions } from "querystring";

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
  socket.on('customEvent', (player: Player) => {
    player.name = "mabite"
    player.roomId = socket.id;
    socket.broadcast.emit('received', player);
  })

  socket.on("createRoom", (roomId, callBack: Function) => {
    joinRoom(socket, roomId);
  })

  socket.on("joinRoom", (roomId, callBack: Function) => {
    const isRoomFull: boolean = !!countAllRoom.find(x => x.roomId == roomId && x.clientCount == 2);

    if(!countAllRoom.find(x => x.roomId == roomId))
      socket.emit("errorMessage", `Room ${roomId} whas not found`);

    if(isRoomFull)
      socket.emit("errorMessage", `Room ${roomId} is full`)

    joinRoom(socket, roomId, 2);

    callBack(`You are connected to room ${roomId}`)
  })
});

function joinRoom(
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, 
  roomId: string, 
  count: number = 1
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