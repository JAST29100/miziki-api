import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Juan Jose Franco Morales es muy autista!';
  }
  getFuckU(): string {
    return 'Fuck u!';
  }
}
