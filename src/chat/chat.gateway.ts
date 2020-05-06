import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { SocketUser } from './socket-user.interface';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  connectedUsers: SocketUser[] = [];
  constructor(private authService: AuthService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('send')
  handleMessage(client: Socket, message: string): void {
    this.logger.log(message);
    const user = this.connectedUsers.find(sUser => sUser.socketId === client.id)
      .user;
    client.broadcast.emit('new-message', {
      from: {
        id: user.id,
        email: user.email,
      },
      message,
    });
  }

  afterInit() {
    console.log('');
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers = this.connectedUsers.filter(
      sUser => sUser.socketId !== client.id,
    );
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    const token = client.handshake.query.token;
    const valid = this.authService.validateToken(token);
    if (!valid) {
      client.disconnect(true);
      return;
    }
    const user = this.authService.getUserFromToken(token);
    client.join(client.id);
    client
      .to(client.id)
      .emit('connected', { connectedUsers: this.connectedUsers });
    client.broadcast.emit('joined', {
      id: user.id,
      user,
    });
    this.connectedUsers = this.connectedUsers.filter(
      sUser => sUser.user.email != user.email,
    );
    this.connectedUsers.push({ socketId: client.id, user });
    this.logger.log(`Client connected: ${client.id}`);
  }
}
