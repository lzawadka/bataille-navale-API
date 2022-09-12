import dotenv from "dotenv";
import { createServer } from 'http';
import { Server } from "socket.io";
import express from "express";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./domain/models/socket";
import { Game } from "./domain/models/game";
import { IPlayer } from "./domain/models/player";
import { SocketService } from "./services/SocketService";
import { GameService } from "./services/GameService";

// #region config
dotenv.config();
const port: string = process.env.SERVER_PORT_LOCAL || '8080';
const app = express();
const httpServer = createServer(app);
const playerInRoom: Game[] = [];
// #endregion config

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL
  }
});

io.on("connection", (socket) => {

  const socketService = new SocketService(socket, new GameService());

  socketService.createGame(playerInRoom);

  socketService.joinGame(playerInRoom, io);

  socketService.updateBoard();

  socketService.endGame();

  socketService.readyToPlay(playerInRoom, io)

});

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});