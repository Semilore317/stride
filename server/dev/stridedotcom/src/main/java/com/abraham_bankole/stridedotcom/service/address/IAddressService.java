package com.abraham_bankole.stridedotcom.service.address;

import com.abraham_bankole.stridedotcom.dtos.AddressDto;
import com.abraham_bankole.stridedotcom.model.Address;

import java.util.List;

public interface IAddressService {
    List<Address> createAddress(List<Address> addressList);

    List<Address> getUserAddress(Long userId);

    Address getAddressById(Long addressId);

    void deleteAddress(Long addressId);

    Address updateUserAddress(Long id, Address address);

    // TODO: Replace with MapStruct mappers project-wide
    AddressDto convertToDto(Address address);

    List<AddressDto> convertToDto(List<Address> addressList);
}
