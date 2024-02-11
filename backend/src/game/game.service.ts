import { Injectable, Inject, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { GameState } from './domain/gameState.entity';
import { RoundState } from './domain/roundState.entity';


@Injectable()
export class GameService {

    
    constructor(
        @Inject(CACHE_MANAGER) private cacheService: Cache,
      ) {}

    async getGameState(lobbyCode: string): Promise<GameState | null> {
        const prefix = 'GAME_STATE'; //TODO: Enum
        try {
            const gameState = await this.cacheService.get<string>(lobbyCode);
            if (gameState !== null) {
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
        console.log(`Setting game state for lobby ${lobbyCode} to`, JSON.stringify(gameState));

        await this.cacheService.set(`${prefix}:${lobbyCode}`, JSON.stringify(gameState));

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