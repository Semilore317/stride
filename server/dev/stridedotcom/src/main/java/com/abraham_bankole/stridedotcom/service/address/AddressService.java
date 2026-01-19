package com.abraham_bankole.stridedotcom.service.address;

import com.abraham_bankole.stridedotcom.model.Address;
import com.abraham_bankole.stridedotcom.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService implements IAddressService {
    private AddressRepository addressRepository;
    @Override
    public List<Address> createAddress(List<Address> addressList) {
        return List.of();
    }

    @Override
    public List<Address> getUserAddress(Long userId) {
        return List.of();
    }

    @Override
    public Address getAddressById(Long addressId) {
        return null;
    }

    @Override
    public void deleteAddress(Long addressId) {

    }

    @Override
    public Address updateUserAddress(Long id, Address address) {
        return null;
    }
}
