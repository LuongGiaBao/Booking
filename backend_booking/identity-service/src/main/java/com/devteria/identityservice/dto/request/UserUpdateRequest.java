package com.devteria.identityservice.dto.request;

import java.time.LocalDate;
import java.util.List;

import com.devteria.identityservice.validator.DobConstraint;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {

    String firstName;
    String lastName;
    String email;
    String phoneNumber;
    @DobConstraint(min = 12, message = "INVALID_DOB")
    LocalDate dob;

    List<String> roles;
}
