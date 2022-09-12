import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from '../domain/models/socket';
import { Socket } from 'socket.io';
import { Game } from '../domain/models/game';
import { IGameService } from '../domain/interface/IGameService'

export class GameService implements IGameService {

  public getGameById(
    gameId: string,
    countAllGames: Game[]
  ): Game | undefined {
    return countAllGames.find(x => x.gameId == gameId);
  }

  public joinRoom(
    socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
    gameId: string,
    count: number,
    countAllGames: Game[]
  ): void {
    socket.join(gameId);
    this.playerInGame(gameId, count, countAllGames);
  }

  public playerInGame(
    gameId: string,
    countToSet: number,
    countAllGames: Game[],
    playerReady: number = 0
  ): Game {
    const foundRoom: Game | undefined = this.getGameById(gameId, countAllGames);
    const indexExistingRoom: number = countAllGames.findIndex(x => x.gameId == gameId)
    const room: Game = {
      gameId,
      clientCount: countToSet,
      playerReady
    };

    if (!!foundRoom)
      countAllGames[indexExistingRoom] = room;
    else
      countAllGames.push(room);

    return room;
  }
}
