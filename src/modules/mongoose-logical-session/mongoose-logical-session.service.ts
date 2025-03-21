import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  LogicalSession,
  LogicalSessionDocument,
} from 'src/schemas/MongooseLogicalSession';

@Injectable()
export class MongooseLogicalSessionService {
  constructor(
    @InjectModel(LogicalSession.name)
    private logicalSessionModel: Model<LogicalSessionDocument>,
  ) {}

  async createLogicalSession(timeout: number): Promise<LogicalSessionDocument> {
    const session = new this.logicalSessionModel({
      status: 'pending',
      timeout,
    });
    return session.save();
  }

  async updateLogicalSessionStatus(
    logicalSessionId: string,
    status: 'committed' | 'rolled_back',
  ): Promise<LogicalSessionDocument | null> {
    return this.logicalSessionModel
      .findByIdAndUpdate(logicalSessionId, { status }, { new: true })
      .exec();
  }
}
