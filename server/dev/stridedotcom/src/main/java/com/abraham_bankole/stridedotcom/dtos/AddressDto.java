package com.abraham_bankole.stridedotcom.dtos;

import lombok.Data;

@Data
public class AddressDto {
    private Long id;
    private String country;
    private String state;
    private String city;
    private String street;
}
