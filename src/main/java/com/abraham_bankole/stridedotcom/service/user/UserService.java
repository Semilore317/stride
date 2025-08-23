package com.abraham_bankole.stridedotcom.service.user;

import com.abraham_bankole.stridedotcom.dtos.UserDto;
import com.abraham_bankole.stridedotcom.model.User;
import com.abraham_bankole.stridedotcom.repository.UserRepository;
import com.abraham_bankole.stridedotcom.request.CreateUserRequest;
import com.abraham_bankole.stridedotcom.request.UserUpdateRequest;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements iUserService {
    private final UserRepository userRepository;

    @Override
    public User createUser(CreateUserRequest request) {
        // check if the user exists with that email, throw an exception, else continue
        return Optional.of(request)
                .filter(user -> !userRepository.existsByEmail(request.getEmail()))
                .map(req -> {
                    User user = new User();
                    user.setFirstName(request.getFirstName());
                    user.setLastName(request.getLastName());
                    user.setEmail(request.getEmail());
                    user.setPassword(request.getPassword());
                    return userRepository.save(user);
                }).orElseThrow(() -> new EntityExistsException("Oops! " + request.getEmail() + " already exists!"));
    }

    @Override
    public User updateUser(UserUpdateRequest request, Long userId) {
        return userRepository.findById(userId).map(existingUser ->{
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
                .ifPresentOrElse(userRepository :: delete, () ->{
                    throw new EntityNotFoundException("User Not Found!");
                });
    }

    public UserDto convertToDto(User user) {
        return new ModelMapper().map(user, UserDto.class);
    }
}
