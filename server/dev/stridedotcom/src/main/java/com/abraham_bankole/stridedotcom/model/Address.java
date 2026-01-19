package com.abraham_bankole.stridedotcom.model;

import com.abraham_bankole.stridedotcom.enums.AddressType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String country;
    private String state;
    private String city;
    private String street;

    @Enumerated(EnumType.STRING)
    private AddressType addressType;

    // user relationship with address
    @ManyToOne // single user can have multiple addresses
    @JoinColumn(name = "user_id")
    private User user;
}
