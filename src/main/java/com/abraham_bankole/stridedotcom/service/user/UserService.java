package com.abraham_bankole.stridedotcom.service.user;

import com.abraham_bankole.stridedotcom.dtos.OrderDto;
import com.abraham_bankole.stridedotcom.dtos.OrderItemDto;
import com.abraham_bankole.stridedotcom.dtos.UserDto;
import com.abraham_bankole.stridedotcom.model.User;
import com.abraham_bankole.stridedotcom.repository.CartRepository;
import com.abraham_bankole.stridedotcom.repository.OrderRepository;
import com.abraham_bankole.stridedotcom.repository.UserRepository;
import com.abraham_bankole.stridedotcom.request.CreateUserRequest;
import com.abraham_bankole.stridedotcom.request.UserUpdateRequest;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements iUserService {
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User createUser(CreateUserRequest request) {
        return Optional.of(request)
                .filter(user -> !userRepository.existsByEmail(request.getEmail()))
                .map(req -> {
                    User user = new User();
                    user.setFirstName(request.getFirstName());
                    user.setLastName(request.getLastName());
                    user.setEmail(request.getEmail());
                    user.setPassword(passwordEncoder.encode(request.getPassword()));
                    return userRepository.save(user);
                }).orElseThrow(() -> new EntityExistsException("Oops! " + request.getEmail() + " already exists!"));
    }

    @Override
    public User updateUser(UserUpdateRequest request, Long id) {
        return userRepository.findById(id).map(existingUser -> {
            existingUser.setFirstName(request.getFirstName());
            existingUser.setLastName(request.getLastName());
            return userRepository.save(existingUser);
        }).orElseThrow(() -> new EntityNotFoundException("User not found!"));
    }

    @Override
    public User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User Not Found!"));
    }

    @Override
    public void deleteUser(Long userId) {
        userRepository.findById(userId)
                .ifPresentOrElse(userRepository::delete, () -> {
                    throw new EntityNotFoundException("User Not Found!");
                });
    }

//    @Override
//    public UserDto convertUserToDto(User user) {
//        UserDto dto = modelMapper.map(user, UserDto.class);
//        dto.setCart(cartRepository.findByUser_Id(user.getId())); // <-- fixed here
//        List<OrderDto> orderDtos = orderRepository.findByUser_Id(user.getId()).stream()
//                .map(order -> {
//                    OrderDto orderDto = modelMapper.map(order, OrderDto.class);
//                    List<OrderItemDto> itemDtos = order.getOrderItems().stream()
//                            .map(item -> {
//                                OrderItemDto itemDto = new OrderItemDto();
//                                itemDto.setProductId(item.getId());
//                                itemDto.setQuantity(item.getQuantity());
//                                itemDto.setPrice(item.getPrice());
//                                itemDto.setProductId(item.getProduct().getId()); // or null
//                                return itemDto;
//                            }).toList();
//                    orderDto.setOrderItems(itemDtos);
//                    return orderDto;
//                }).toList();
//
//        dto.setOrders(orderDtos);
//
//        return dto;
//    }

    @Override
    public UserDto convertUserToDto(User user) {
        UserDto dto = modelMapper.map(user, UserDto.class);

        // Set cart (assumes method exists and returns CartDto or Cart)
        dto.setCart(cartRepository.findByUser_Id(user.getId()));

        // Convert and set orders
        List<OrderDto> orderDtos = orderRepository.findByUser_Id(user.getId()).stream()
                .map(order -> {
                    OrderDto orderDto = modelMapper.map(order, OrderDto.class);

                    List<OrderItemDto> itemDtos = order.getOrderItems().stream()
                            .map(item -> {
                                OrderItemDto itemDto = new OrderItemDto();
                                itemDto.setQuantity(item.getQuantity());
                                itemDto.setPrice(item.getPrice());
                                itemDto.setProductId(item.getProduct().getId()); // Corrected
                                return itemDto;
                            }).toList();

                    orderDto.setOrderItems(itemDtos); // Ensure this exists in OrderDto
                    return orderDto;
                }).toList();

        dto.setOrders(orderDtos); // Ensure this exists in UserDto

        return dto;
    }

}
