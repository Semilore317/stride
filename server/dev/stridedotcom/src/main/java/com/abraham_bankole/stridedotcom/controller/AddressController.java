package com.abraham_bankole.stridedotcom.controller;

import com.abraham_bankole.stridedotcom.dtos.AddressDto;
import com.abraham_bankole.stridedotcom.model.Address;
import com.abraham_bankole.stridedotcom.response.ApiResponse;
import com.abraham_bankole.stridedotcom.service.address.IAddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/address")
@RequiredArgsConstructor
public class AddressController {
    private final IAddressService addressService;

    @PostMapping("/new")
    public ResponseEntity<ApiResponse> createAddresses(@RequestBody List<Address> addresses) {
        List<Address> addressList = addressService.createAddress(addresses);
        List<AddressDto> addressDto = addressService.convertToDto(addressList);

        return ResponseEntity.ok(new ApiResponse("Success!", addressDto));
    }

    @GetMapping("/{userId}/address")
    public ResponseEntity<ApiResponse> getUserAddress(@PathVariable Long userId) {
        List<Address> addressList = addressService.getUserAddress(userId);
        List<AddressDto> addressDto = addressService.convertToDto(addressList);
        return ResponseEntity.ok(new ApiResponse("Found user address", addressDto));
    }

    @GetMapping("/{id}/address")
    public ResponseEntity<ApiResponse> getAddressById(@PathVariable Long id) {
        Address address = addressService.getAddressById(id);
        AddressDto addressDto = addressService.convertToDto(address);
        return ResponseEntity.ok(new ApiResponse("Success!", addressDto));
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<ApiResponse> updateAddress(@PathVariable Long id, @RequestBody Address address) {
        Address updatedAddress = addressService.updateUserAddress(id, address);
        AddressDto addressDto = addressService.convertToDto(updatedAddress);
        return ResponseEntity.ok(new ApiResponse("Success!", addressDto));
    }

    @PutMapping("/{id}/delete")
    public ResponseEntity<ApiResponse> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.ok(new ApiResponse("Address deleted", null));
    }
}
