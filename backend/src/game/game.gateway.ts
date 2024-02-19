import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    allowedHeaders: ['Authorization'],
    credentials: true,
  },
})
export class GameGateway {
  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    console.log('join room', room);
    client.join(room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    console.log('leave room', room);
    client.leave(room);
  }

  @SubscribeMessage('msgToRoom')
  handleMessageToRoom(
    client: Socket,
    { room, message }: { room: string; message: string },
  ) {
    console.log('msg to room', room, message);
    this.server.to(room).emit('msgFromRoom', message);
  }
}
