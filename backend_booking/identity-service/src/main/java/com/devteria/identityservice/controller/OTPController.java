package com.devteria.identityservice.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.devteria.identityservice.service.OTPService;
@RestController
@RequestMapping("/api/otp")
public class OTPController {

    private final OTPService otpService;

    public OTPController(OTPService otpService) {
        this.otpService = otpService;
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendOTP(@RequestParam String email) {
        otpService.sendOTPEmail(email);
        return ResponseEntity.ok("OTP đã được gửi tới " + email);
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyOTP(@RequestParam String email, @RequestParam String otp) {
        boolean isValid = otpService.verifyOTP(email, otp);

        if (isValid) {
            return ResponseEntity.ok("OTP chính xác!");
        } else {
            return ResponseEntity.badRequest().body("OTP không chính xác hoặc đã hết hạn.");
        }
    }
}
