package com.devteria.identityservice.mapper;


import com.devteria.identityservice.dto.request.DropoffLocationCreationRequest;
import com.devteria.identityservice.dto.request.DropoffLocationUpdateRequest;
import com.devteria.identityservice.dto.response.DropoffLocationResponse;
import com.devteria.identityservice.entity.DropoffLocation;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DropoffLocationMapper {
    DropoffLocation toDropoffLocation(DropoffLocationCreationRequest request);
    DropoffLocationResponse toDropoffLocationResponse(DropoffLocation dropoffLocation);

    void updateDropoffLocation(@MappingTarget DropoffLocation dropoffLocation, DropoffLocationUpdateRequest request);

}
