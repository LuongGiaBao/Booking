package com.devteria.identityservice.mapper;


import com.devteria.identityservice.dto.request.PickupLocationCreationRequest;
import com.devteria.identityservice.dto.request.PickupLocationUpdateRequest;
import com.devteria.identityservice.dto.response.PickupLocationResponse;
import com.devteria.identityservice.entity.PickupLocation;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PickupLocationMapper {
    PickupLocation toPickupLocation(PickupLocationCreationRequest request);
    PickupLocationResponse toPickupLocationResponse(PickupLocation pickupLocation);
    void updatePickupLocation(@MappingTarget PickupLocation pickupLocation, PickupLocationUpdateRequest request);
}
