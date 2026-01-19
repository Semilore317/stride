package com.abraham_bankole.stridedotcom.dtos;

import com.abraham_bankole.stridedotcom.model.Cart;
import com.abraham_bankole.stridedotcom.model.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;

    private Cart cart;
    private List<OrderDto> orders;


    private List<AddressDto> addressList;
}
