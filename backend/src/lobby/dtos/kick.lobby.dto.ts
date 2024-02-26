import { IsOptional, IsString } from 'class-validator';

export class JoinLobbyDto {
  @IsString()
  playerId: string;

  @IsOptional()
  @IsString()
  userName: string;
}
