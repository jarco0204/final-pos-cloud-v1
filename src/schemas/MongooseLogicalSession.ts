import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LogicalSessionDocument = LogicalSession & Document;

@Schema({ timestamps: true })
export class LogicalSession {
  @Prop({ required: true })
  status: 'pending' | 'committed' | 'rolled_back';

  @Prop({ required: true })
  timeout: number; // in seconds or as a Date field for expiry
}

export const LogicalSessionSchema =
  SchemaFactory.createForClass(LogicalSession);
