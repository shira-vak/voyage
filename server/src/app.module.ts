import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { TripsModule } from './trips/trips.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, VehiclesModule, TripsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
