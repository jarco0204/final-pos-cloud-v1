import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Local Imports
import {
  LogicalSession,
  LogicalSessionSchema,
} from '../../schemas/MongooseLogicalSession';
import { MongooseLogicalSessionService } from './mongoose-logical-session.service';

@Module({
  imports: [
    // MongooseModule: Connect to MongoDB database for LogicalSession
    MongooseModule.forFeature([
      { name: LogicalSession.name, schema: LogicalSessionSchema },
    ]),
  ],
  providers: [MongooseLogicalSessionService],
  exports: [MongooseLogicalSessionService], // Export the service so it can be used in other modules
})
export class MongooseLogicalSessionModule {}
