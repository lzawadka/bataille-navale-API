import { emit } from "process";
import { Server, Socket } from "socket.io";
import { IGameService } from "../domain/interface/IGameService";
import { Game } from "../domain/models/game";
import { IPlayer } from "../domain/models/player";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "../domain/models/socket";

export class SocketService {
    
    readonly m_socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
    readonly m_gameService: IGameService;

    constructor(
        p_socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
        p_gameService: IGameService
    ) {
        this.m_socket = p_socket;
        this.m_gameService = p_gameService
    }

    public createGame(
			countAllGames: Game[]
		): void {
			this.m_socket.on("createGame", (gameId, callBack) => {
				console.log(gameId, "gameId");
				this.m_gameService.joinRoom(this.m_socket, gameId, 1, countAllGames);
				const player1: IPlayer = {
					name: "Player 1",
					role: "creator",
					isReady: false
				}
				if(callBack)
					callBack(player1);
				this.m_socket.in(gameId).emit("startGame", false);
			})
    }

		public joinGame(
			countAllGames: Game[],
			io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
		): void {
			this.m_socket.on("joinGame", (gameId, callBack) => {
			const foundRoom: Game | undefined = this.m_gameService.getGameById(gameId, countAllGames);
	
			if (!foundRoom) {
					this.m_socket.in(gameId).emit("errorMessage", `Room ${gameId} was not found`);
					throw Error(`Room ${gameId} was not found`);
			}
	
			const isFullRoom: boolean = foundRoom.clientCount > 2;
			const isRoomReadyToStart: boolean = foundRoom.clientCount == 2;
	
			if (isFullRoom) {
					this.m_socket.in(gameId).emit("errorMessage", `Room ${gameId} is full`);
					throw Error(`Room ${gameId} is full`);
			}
	
			if (!isRoomReadyToStart) {
					this.m_gameService.joinRoom(this.m_socket, gameId, 2, countAllGames);
					const player2: IPlayer = {
					name: "Player 2",
					role: "opponent",
					isReady: false
					}
					callBack(player2)
			}
	
			io.in(gameId).emit("startGame", isRoomReadyToStart);
			})
		}

		public updateBoard(): void {
			this.m_socket.on("updateBoard", (gameId, board, player) => {
				this.m_socket
						.broadcast
						.in(gameId)
						.emit("updateOpponentBoard", board, player);
			})
		}

		public endGame(): void {
			this.m_socket.on("endGame", (roomId, player) => {
				this.m_socket
						.in(roomId)
						.emit("endGame", player)
			})
		}

		public isReadyToPlay(
			playerReadyInRoom: Game[],
			io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
		): void {
			this.m_socket.on("isPlayerReadyToPlay", (gameId, playerName, isReady) => {
				const foundGame: Game | undefined = this.m_gameService.getGameById(gameId, playerReadyInRoom);

				if(!foundGame)
				{
					this.m_socket.in(gameId).emit("errorMessage", `Room ${gameId} is full`);
					throw Error(`Room ${gameId} does not exist`);
				}

				if(foundGame.playerReady === 0)
				{
					this.m_gameService.playerInGame(gameId, 2, playerReadyInRoom, 1);
					this.m_socket.emit("isPlayerReadyToPlayToClient", isReady);
				}

				if(foundGame.playerReady === 1)
				{
					this.m_gameService.playerInGame(gameId, 2, playerReadyInRoom, 2);
					this.m_socket.in(gameId).emit("isGameReadyToStart", isReady);
				}
			})
		}
}