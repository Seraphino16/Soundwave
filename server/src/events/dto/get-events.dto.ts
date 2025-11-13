import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetEventsDto {
    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    lat?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    lng?: number;

    @IsOptional()
    @IsString()
    artist?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number;
}
