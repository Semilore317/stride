package com.abraham_bankole.stridedotcom.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Invalid Login Credentials")
    private String email;
    @NotBlank(message = "Invalid Login Credentials")
    private String password;
}
