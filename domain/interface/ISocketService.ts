import { Server } from "socket.io";
import { Game } from "../models/game";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "../models/socket";

export interface ISocketService {
    createGame(countAllGames: Game[]): void;

    joinGame(
        countAllGames: Game[],
        io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
    ): void;

    updateBoard(): void;

    endGame(): void

    isReadyToPlay(
        playerReadyInRoom: Game[],
        io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
    ): void
}