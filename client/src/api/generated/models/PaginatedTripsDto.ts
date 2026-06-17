/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TripResponseDto } from './TripResponseDto';
export type PaginatedTripsDto = {
    data: Array<TripResponseDto>;
    totalTrips: number;
    page: number;
    limit: number;
};

