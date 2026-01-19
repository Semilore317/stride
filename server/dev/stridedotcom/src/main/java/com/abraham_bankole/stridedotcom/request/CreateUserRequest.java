package com.abraham_bankole.stridedotcom.request;

import com.abraham_bankole.stridedotcom.model.Address;
import lombok.Data;

import java.util.List;

@Data
public class CreateUserRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private List<Address> addressList;

}
