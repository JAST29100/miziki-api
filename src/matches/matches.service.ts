import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { UserService } from '../users/users.service.js';
import type { User } from '../users/users.service.js';
import { LikeRecord, MatchRecord, RejectionRecord } from './match.schema.js';
import type { LikeDocument, MatchDocument, RejectionDocument } from './match.schema.js';

export interface Match { id: string; usuariosMatch: string[]; }
export interface ServerResponse { data: Array<User | Match>; message: string; status: number; }

@Injectable()
export class MatchService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(LikeRecord.name) private readonly likeModel: Model<LikeDocument>,
    @InjectModel(RejectionRecord.name) private readonly rejectionModel: Model<RejectionDocument>,
    @InjectModel(MatchRecord.name) private readonly matchModel: Model<MatchDocument>,
  ) {}
  private format(match: MatchDocument): Match { return { id: match._id.toString(), usuariosMatch: [...match.usuariosMatch] }; }
  private async exists(id: string): Promise<boolean> { return (await this.userService.getUser(id)).status === 200; }

  async discoverMatches(myId: string): Promise<ServerResponse> {
    const users = (await this.userService.getUsers()).data.filter(user => user.id !== myId);
    return { data: users, status: users.length ? 200 : 404, message: users.length ? 'Usuarios encontrados' : 'Usuarios no encontrados' };
  }
  async likeUsuario(myId: string, otherId: string): Promise<ServerResponse> {
    if (myId === otherId) return { data: [], status: 400, message: 'No se puede dar like a si mismo' };
    if (!(await this.exists(myId)) || !(await this.exists(otherId))) return { data: [], status: 404, message: 'Usuario no encontrado' };
    if (await this.likeModel.exists({ de: myId, para: otherId })) return { data: [], status: 409, message: 'Ya le diste like a este usuario' };
    await this.likeModel.create({ de: myId, para: otherId });
    if (await this.likeModel.exists({ de: otherId, para: myId })) {
      const match = await this.matchModel.create({ usuariosMatch: [myId, otherId] });
      return { data: [this.format(match)], status: 201, message: 'Like registrado. Es un match' };
    }
    return { data: [], status: 201, message: 'Like registrado' };
  }
  async rechazoUsuario(myId: string, otherId: string): Promise<ServerResponse> {
    if (!(await this.exists(myId)) || !(await this.exists(otherId))) return { data: [], status: 404, message: 'Usuario no encontrado' };
    await this.rejectionModel.updateOne({ de: myId, para: otherId }, { $setOnInsert: { de: myId, para: otherId } }, { upsert: true });
    return { data: [], status: 204, message: 'Usuario rechazado' };
  }
  async getMatches(myId: string): Promise<ServerResponse> {
    const matches = (await this.matchModel.find({ usuariosMatch: myId })).map(match => this.format(match));
    return { data: matches, status: 200, message: matches.length ? 'Matches encontrados!' : 'Matches no encontrados' };
  }
  async deleteMatch(myId: string, matchId: string): Promise<ServerResponse> {
    const match = /^[a-f\d]{24}$/i.test(matchId) ? await this.matchModel.findById(matchId) : null;
    if (!match) return { data: [], status: 404, message: 'Match no encontrado' };
    if (!match.usuariosMatch.includes(myId)) return { data: [], status: 403, message: 'No tienes permiso para eliminar este match' };
    await match.deleteOne();
    return { data: [this.format(match)], status: 204, message: 'Match eliminado!' };
  }
}
