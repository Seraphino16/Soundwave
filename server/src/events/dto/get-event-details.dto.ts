import { IsString } from 'class-validator';

export class GetEventDetailsDto {
    @IsString()
    id: string;
}
