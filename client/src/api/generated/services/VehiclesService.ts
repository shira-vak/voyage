/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateVehicleDto } from '../models/CreateVehicleDto';
import type { VehicleResponseDto } from '../models/VehicleResponseDto';
import type { VehicleSummaryDto } from '../models/VehicleSummaryDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VehiclesService {
    /**
     * Create a new vehicle
     * @param requestBody
     * @returns VehicleResponseDto
     * @throws ApiError
     */
    public static vehiclesControllerCreateVehicle(
        requestBody: CreateVehicleDto,
    ): CancelablePromise<VehicleResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vehicles',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List all vehicles
     * @returns VehicleResponseDto
     * @throws ApiError
     */
    public static vehiclesControllerListVehicles(): CancelablePromise<Array<VehicleResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vehicles',
        });
    }
    /**
     * Get a vehicle by license plate
     * @param licensePlate Vehicle license plate
     * @returns VehicleResponseDto
     * @throws ApiError
     */
    public static vehiclesControllerGetVehicleByLicensePlate(
        licensePlate: string,
    ): CancelablePromise<VehicleResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vehicles/{licensePlate}',
            path: {
                'licensePlate': licensePlate,
            },
        });
    }
    /**
     * Get aggregated trip summary for a vehicle
     * @param licensePlate Vehicle license plate
     * @returns VehicleSummaryDto
     * @throws ApiError
     */
    public static vehiclesControllerGetVehicleSummary(
        licensePlate: string,
    ): CancelablePromise<VehicleSummaryDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/vehicles/{licensePlate}/summary',
            path: {
                'licensePlate': licensePlate,
            },
        });
    }
}
