package com.abraham_bankole.stridedotcom.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse {
    // attributes
    private String message;
    private Object data;
}
