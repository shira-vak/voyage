import { PrismaClient, VehicleType } from '@prisma/client';

const prisma = new PrismaClient();

type TripInput = {
  vehicleId: string;
  startedAt: Date;
  endedAt: Date;
  durationMinutes: number;
  distanceKm: number;
  fuelConsumed: number;
};

function buildTrip(vehicleId: string, startedAt: Date, endedAt: Date, distanceKm: number, fuelConsumed: number): TripInput {
  const durationMinutes = Math.round((endedAt.getTime() - startedAt.getTime()) / 60000);
  return { vehicleId, startedAt, endedAt, durationMinutes, distanceKm, fuelConsumed };
}

async function seed(): Promise<void> {
  console.log('Seeding database...');

  await prisma.trip.deleteMany();
  await prisma.vehicle.deleteMany();

  const [truck1, van1, car1, bus1, truck2] = await Promise.all([
    prisma.vehicle.create({ data: { name: 'Berlin Express', licensePlate: 'B-EX-001', type: VehicleType.TRUCK } }),
    prisma.vehicle.create({ data: { name: 'Hamburg Van', licensePlate: 'HH-VN-042', type: VehicleType.VAN } }),
    prisma.vehicle.create({ data: { name: 'Munich Sedan', licensePlate: 'M-SD-099', type: VehicleType.CAR } }),
    prisma.vehicle.create({ data: { name: 'Cologne Bus', licensePlate: 'K-BS-017', type: VehicleType.BUS } }),
    prisma.vehicle.create({ data: { name: 'Stuttgart Cargo', licensePlate: 'S-CG-203', type: VehicleType.TRUCK } }),
  ]);

  await prisma.trip.createMany({
    data: [
      buildTrip(truck1.id, new Date('2024-03-10T07:00:00Z'), new Date('2024-03-10T09:30:00Z'), 215.5, 28.4),
      buildTrip(truck1.id, new Date('2024-04-02T06:00:00Z'), new Date('2024-04-02T11:00:00Z'), 412.0, 54.3),
      buildTrip(truck1.id, new Date('2024-05-14T08:30:00Z'), new Date('2024-05-14T10:00:00Z'), 124.8, 16.2),
      buildTrip(van1.id, new Date('2024-03-20T09:00:00Z'), new Date('2024-03-20T10:45:00Z'), 88.0, 7.4),
      buildTrip(van1.id, new Date('2024-04-15T13:00:00Z'), new Date('2024-04-15T14:30:00Z'), 67.5, 5.6),
      buildTrip(van1.id, new Date('2024-05-28T07:30:00Z'), new Date('2024-05-28T09:00:00Z'), 95.2, 8.1),
      buildTrip(car1.id, new Date('2024-04-10T08:00:00Z'), new Date('2024-04-10T08:45:00Z'), 42.3, 3.2),
      buildTrip(car1.id, new Date('2024-05-05T17:00:00Z'), new Date('2024-05-05T17:50:00Z'), 38.7, 2.9),
      buildTrip(car1.id, new Date('2024-06-01T09:00:00Z'), new Date('2024-06-01T10:20:00Z'), 78.4, 5.8),
      buildTrip(bus1.id, new Date('2024-03-15T06:00:00Z'), new Date('2024-03-15T08:00:00Z'), 112.0, 22.5),
      buildTrip(bus1.id, new Date('2024-04-20T06:00:00Z'), new Date('2024-04-20T08:30:00Z'), 134.5, 27.0),
      buildTrip(truck2.id, new Date('2024-03-08T05:30:00Z'), new Date('2024-03-08T12:00:00Z'), 523.0, 69.8),
      buildTrip(truck2.id, new Date('2024-04-25T06:00:00Z'), new Date('2024-04-25T13:30:00Z'), 618.5, 82.4),
      buildTrip(truck2.id, new Date('2024-05-18T07:00:00Z'), new Date('2024-05-18T09:30:00Z'), 198.3, 26.1),
    ],
  });

  console.log('Seeded 5 vehicles and 14 trips.');
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
