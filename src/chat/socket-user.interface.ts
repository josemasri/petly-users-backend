import { User } from 'src/auth/user.entity';

export interface SocketUser {
  socketId: string;
  user: User;
}
