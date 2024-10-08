package com.devteria.identityservice.dto.request;

import java.time.LocalDate;

public class TripFilterRequest {
    private String departureLocation;
    private String arrivalLocation;
    private LocalDate departureDate;  // Sử dụng LocalDate để chỉ lọc theo ngày

    public String getDepartureLocation() {
        return departureLocation;
    }

    public void setDepartureLocation(String departureLocation) {
        this.departureLocation = departureLocation;
    }

    public String getArrivalLocation() {
        return arrivalLocation;
    }

    public void setArrivalLocation(String arrivalLocation) {
        this.arrivalLocation = arrivalLocation;
    }

    public LocalDate getDepartureDate() {
        return departureDate;
    }

    public void setDepartureDate(LocalDate departureDate) {
        this.departureDate = departureDate;
    }
}
