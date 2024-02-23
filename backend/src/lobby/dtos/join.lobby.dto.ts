import { IsOptional, IsString } from 'class-validator';

export class JoinLobbyDto {
  @IsString()
  lobbyCode: string;

  @IsOptional()
  @IsString()
  userName: string;
}
