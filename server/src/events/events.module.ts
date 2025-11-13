import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    providers: [EventsService],
    controllers: [EventsController],
    exports: [EventsService],
})
export class EventsModule {}

