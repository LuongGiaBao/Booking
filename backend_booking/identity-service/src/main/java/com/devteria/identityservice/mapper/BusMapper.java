package com.devteria.identityservice.mapper;


import com.devteria.identityservice.dto.request.BusCreationRequest;
import com.devteria.identityservice.dto.request.BusUpdateRequest;
import com.devteria.identityservice.dto.response.BusResponse;
import com.devteria.identityservice.entity.Bus;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BusMapper {

    Bus toBus(BusCreationRequest request);
    BusResponse toBusResponse(Bus bus);

    void updateBus(@MappingTarget Bus bus, BusUpdateRequest request);

}
