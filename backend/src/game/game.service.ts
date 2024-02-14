import { Injectable, Inject, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { CacheService } from 'src/model/cache.service';
import { GameState } from './domain/gameState.entity';
import { RoundState } from './domain/roundState.entity';


@Injectable()
export class GameService {

    constructor(@Inject(CacheService) private cacheService: CacheService) {}

    async getGameState(lobbyCode: string): Promise<GameState | null> {
        const prefix = 'GAME_STATE'; //TODO: Enum
        console.error('try:', `${prefix}:${lobbyCode}`);

        try {
            const gameState = await this.cacheService.get(`${prefix}:${lobbyCode}`);
            if (gameState !== null) {
                console.error('gameState:', `${gameState}`);
                return JSON.parse(gameState);
            } else {
                console.error('No game found with lobbyCode:', `${prefix}:${lobbyCode}`);
                throw new NotFoundException('Game not found.');
            }        
        } catch (error) {
            console.error('Error getting game state:', error);
            throw new InternalServerErrorException('An internal server error occurred.');
        }
    }

    async setGameState(lobbyCode: string, status: string, round: number): Promise<boolean> {
        const prefix = 'GAME_STATE'; //TODO: Enum

        const gameState = new GameState(status, round);
        console.log(`Setting game state for key ${prefix}:${lobbyCode} to`, JSON.stringify(gameState));


        try {
            await this.cacheService.set(`${prefix}:${lobbyCode}`, JSON.stringify(gameState));
        } catch (error) {
            console.error('Error setting game state in cache:', error);
            // Handle the error accordingly, such as logging or rethrowing
          }
        console.log(`DONE Setting game state for lobby ${lobbyCode} to`, JSON.stringify(gameState));
        return true;
    }


    async nextRound(lobbyCode: string): Promise<void> {
        const currentGameState = this.getGameState(lobbyCode);
        const newRound = (await currentGameState).round + 1;
        const newStatus = 'started';
        this.setGameState(lobbyCode, newStatus, newRound);
    }

    async answer(lobbyCode: string,  userId: string, answerId: string): Promise<void> {//Promise<boolean> 
        //check answer
        //save it into cache
        //check if everybody answered, if yes call nextRound or finish the game if it is the last
        //return true false
    }
}