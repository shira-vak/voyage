/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTripDto } from '../models/CreateTripDto';
import type { PaginatedTripsDto } from '../models/PaginatedTripsDto';
import type { TripResponseDto } from '../models/TripResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TripsService {
    /**
     * Record a new trip for a vehicle
     * @param licensePlate Vehicle license plate
     * @param requestBody
     * @returns TripResponseDto
     * @throws ApiError
     */
    public static tripsControllerCreateTrip(
        licensePlate: string,
        requestBody: CreateTripDto,
    ): CancelablePromise<TripResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vehicles/{licensePlate}/trip',
            path: {
                'licensePlate': licensePlate,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List trips with optional filters and pagination
     * @param licensePlate Filter by vehicle license plate
     * @param startDate Return trips starting on or after this date (ISO 8601)
     * @param endDate Return trips starting on or before this date (ISO 8601)
     * @param page Page number (default: 1)
     * @param limit Items per page, max 100 (default: 20)
     * @returns PaginatedTripsDto
     * @throws ApiError
     */
    public static tripsControllerListTrips(
        licensePlate?: string,
        startDate?: string,
        endDate?: string,
        page?: number,
        limit?: number,
    ): CancelablePromise<PaginatedTripsDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/trips',
            query: {
                'licensePlate': licensePlate,
                'startDate': startDate,
                'endDate': endDate,
                'page': page,
                'limit': limit,
            },
        });
    }
}
