package com.abraham_bankole.stridedotcom.service.address;

import com.abraham_bankole.stridedotcom.dtos.AddressDto;
import com.abraham_bankole.stridedotcom.model.Address;
import com.abraham_bankole.stridedotcom.repository.AddressRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService implements IAddressService {

    private final AddressRepository addressRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<Address> createAddress(List<Address> addressList) {
        return addressRepository.saveAll(addressList);
    }

    @Override
    public List<Address> getUserAddress(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    @Override
    public Address getAddressById(Long addressId) {
        return addressRepository.findById(addressId)
                .orElseThrow(() -> new EntityNotFoundException("Address Not Found"));
    }

    @Override
    public void deleteAddress(Long addressId) {
        addressRepository.findById(addressId).ifPresentOrElse(
                addressRepository::delete,
                () -> {
                    throw new EntityNotFoundException("Address Not Found");
                });
    }

    @Override
    public Address updateUserAddress(Long id, Address address) {
        return addressRepository.findById(id).map(existingAddress -> {
            existingAddress.setCountry(address.getCountry());
            existingAddress.setState(address.getState());
            existingAddress.setCity(address.getCity());
            existingAddress.setAddressType(address.getAddressType());

            return addressRepository.save(existingAddress);
        }).orElseThrow(
                () -> new EntityNotFoundException("Address Not Found!"));
    }

    // TODO: Replace with MapStruct mappers project-wide
    @Override
    public AddressDto convertToDto(Address address) {
        return modelMapper.map(address, AddressDto.class);
    }

    @Override
    public List<AddressDto> convertToDto(List<Address> addressList) {
        return addressList.stream()
                .map(this::convertToDto)
                .toList();
    }
}
