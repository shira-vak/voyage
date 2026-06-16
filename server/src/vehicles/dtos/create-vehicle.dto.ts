import { ApiProperty } from '@nestjs/swagger';
import { VehicleType } from '@prisma/client';
import { IsIn, IsString } from 'class-validator';
import { vehicleTypeOptions } from '../consts';

export class CreateVehicleDto {
  @IsString()
  @ApiProperty({ description: 'Display name for the vehicle', example: 'Berlin Express' })
  name: string;

  @IsString()
  @ApiProperty({ description: 'Unique licence plate number', example: 'B-EX-001' })
  licensePlate: string;

  @IsIn(vehicleTypeOptions)
  @ApiProperty({ enum: VehicleType, description: 'Vehicle type' })
  type: VehicleType;
}
