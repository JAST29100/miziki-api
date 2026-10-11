import type { User } from '../users.service.js';

export class UserDTO {
  id?: string;
  username: string;
  email: string;
  creadoEn: string;
  seguidores: Array<string>;
  seguidos: Array<string>;
}
