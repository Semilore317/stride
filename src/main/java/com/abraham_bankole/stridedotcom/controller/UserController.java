package com.abraham_bankole.stridedotcom.controller;

import com.abraham_bankole.stridedotcom.model.User;
import com.abraham_bankole.stridedotcom.request.CreateUserRequest;
import com.abraham_bankole.stridedotcom.request.UserUpdateRequest;
import com.abraham_bankole.stridedotcom.response.ApiResponse;
import com.abraham_bankole.stridedotcom.service.user.iUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/users")
public class UserController {
    private final iUserService userService;

    @GetMapping("/users/{userId}/user")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable Long userId) {
        User user = userService.findUserById(userId);
        return ResponseEntity.ok(new ApiResponse("Found!", user));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> createUser(@RequestBody CreateUserRequest request) {
        User user = userService.createUser(request);
        return ResponseEntity.ok(new ApiResponse("Successfully Created User!", user));
    }

    @PutMapping("/{userId}/update")
    public ResponseEntity<ApiResponse> updateUser(@RequestBody UserUpdateRequest request, @PathVariable Long userId) {
        User user = userService.updateUser(request, userId);
        return ResponseEntity.ok(new ApiResponse("Successfully Updated User!", user));
    }

    @DeleteMapping("/{userId}/delete")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok(new ApiResponse("Successfully Deleted User!", null));
    }
}