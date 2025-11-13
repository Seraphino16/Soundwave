import { Controller, Get, Query, Param } from '@nestjs/common';
import { EventsService } from './events.service';
import { GetEventsDto } from './dto/get-events.dto';
import { GetEventDetailsDto } from './dto/get-event-details.dto';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Get()
    async getEvents(@Query() query: GetEventsDto) {
        return this.eventsService.getEvents(query);
    }

    @Get(':id')
    async getEventDetails(@Param() params: GetEventDetailsDto) {
        return this.eventsService.getEventDetails(params.id);
    }
}
