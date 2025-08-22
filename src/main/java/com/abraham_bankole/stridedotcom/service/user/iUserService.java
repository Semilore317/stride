package com.abraham_bankole.stridedotcom.service.user;

import com.abraham_bankole.stridedotcom.model.User;
import com.abraham_bankole.stridedotcom.request.CreateUserRequest;
import com.abraham_bankole.stridedotcom.request.UserUpdateRequest;

public interface iUserService {
    User createUser(CreateUserRequest request);
    User updateUser(UserUpdateRequest request, Long userId);
    User findUserById(Long userId);
    void deleteUser(Long userId);
}
