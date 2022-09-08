import { Socket } from "socket.io";
import { Game } from "../models/game";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "../models/socket";

export interface IGameService {
    getGameById(gameId: string, countAllGames: Game[]): Game | undefined;

    joinRoom(
        socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
        gameId: string,
        count: number,
        countAllGames: Game[]
      ): void;

    playerInGame(
        gameId: string,
        countToSet: number,
        countAllGames: Game[],
        playerReady: number
    ): Game;
}