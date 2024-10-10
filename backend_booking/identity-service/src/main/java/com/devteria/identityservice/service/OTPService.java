package com.devteria.identityservice.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OTPService {

    private final JavaMailSender mailSender;

    // Dùng để lưu trữ OTP tương ứng với email
    private Map<String, String> otpStorage = new HashMap<>();

    public OTPService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Phương thức để tạo mã OTP ngẫu nhiên
    public String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // Tạo OTP gồm 6 chữ số
        return String.valueOf(otp);
    }

    // Gửi mã OTP qua email và lưu OTP vào otpStorage
    public void sendOTPEmail(String toEmail) {
        String otp = generateOTP(); // Tạo mã OTP
        String subject = "Your OTP Code";
        String message = "Your OTP code is: " + otp; // Nội dung email chứa mã OTP

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(toEmail);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);

        // Lưu OTP vào otpStorage, mỗi email sẽ có một mã OTP duy nhất
        otpStorage.put(toEmail, otp);

        mailSender.send(mailMessage); // Gửi email chứa mã OTP

        System.out.println("OTP đã được gửi tới " + toEmail);
    }

    // Xác thực OTP
    public boolean verifyOTP(String email, String otp) {
        // Lấy OTP đã lưu cho email
        String storedOtp = otpStorage.get(email);

        // Kiểm tra OTP nhập vào có khớp với OTP đã lưu hay không
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStorage.remove(email); // Xóa OTP sau khi xác thực thành công
            return true;
        }
        return false;
    }
}
