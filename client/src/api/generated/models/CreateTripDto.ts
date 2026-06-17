/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateTripDto = {
    /**
     * Trip start time (ISO 8601)
     */
    startedAt: string;
    /**
     * Trip end time (ISO 8601)
     */
    endedAt: string;
    /**
     * Distance covered in kilometres
     */
    distanceKm: number;
    /**
     * Fuel or energy consumed (litres / kWh)
     */
    fuelConsumed: number;
};

