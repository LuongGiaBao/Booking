package com.devteria.identityservice.controller;

import java.time.LocalDate;

import com.devteria.identityservice.dto.request.UserCreationRequest;
import com.devteria.identityservice.dto.response.UserResponse;
import com.devteria.identityservice.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@Slf4j
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource("/test.properties")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    private UserCreationRequest request;
    private UserResponse userResponse;
    private LocalDate dob;

    @BeforeEach
    void initData() {
        dob = LocalDate.of(1990, 1, 1); // Khởi tạo ngày sinh

        request = UserCreationRequest.builder()
                .username("john") // Đặt tên người dùng hợp lệ
                .firstName("John")
                .lastName("Doe")
                .password("12345678") // Đặt mật khẩu
                .dob(dob)
                .build();

        userResponse = UserResponse.builder()
                .id("cf0600f538b3") // ID giả lập cho phản hồi
                .username("john")
                .firstName("John")
                .lastName("Doe")
                .dob(dob)
                .build();
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"}) // Thêm xác thực cho test
    void createUser_validRequest_success() throws Exception {
        // GIVEN
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule()); // Đăng ký module cho LocalDate
        String content = objectMapper.writeValueAsString(request);

        Mockito.when(userService.createUser(ArgumentMatchers.any())).thenReturn(userResponse); // Giả lập dịch vụ

        // WHEN, THEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(content))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("code").value(1000)) // Kiểm tra mã phản hồi
                .andExpect(MockMvcResultMatchers.jsonPath("result.id").value("cf0600f538b3")); // Kiểm tra ID người dùng
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"}) // Thêm xác thực cho test
    void createUser_usernameInvalid_fail() throws Exception {
        // GIVEN
        request.setUsername("joh"); // Thiết lập tên người dùng không hợp lệ
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        String content = objectMapper.writeValueAsString(request);

        // WHEN, THEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(content))
                .andExpect(MockMvcResultMatchers.status().isBadRequest()) // Kiểm tra trạng thái Bad Request
                .andExpect(MockMvcResultMatchers.jsonPath("code").value(1003)) // Kiểm tra mã lỗi
                .andExpect(MockMvcResultMatchers.jsonPath("message").value("Username must be at least 4 characters")); // Kiểm tra thông báo lỗi
    }
}
