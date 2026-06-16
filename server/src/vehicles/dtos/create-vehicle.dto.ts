import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @ApiProperty({ description: 'Display name for the vehicle', example: 'Berlin Express' })
  name: string;

  @IsString()
  @ApiProperty({ description: 'Unique licence plate number', example: 'B-EX-001' })
  licensePlate: string;
}
