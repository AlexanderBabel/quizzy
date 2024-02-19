import { Player } from './player.type';

export type Lobby = {
  lobbyCode: string;
  quizId: string;
  players: Player[];
};
