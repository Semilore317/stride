package com.abraham_bankole.stridedotcom.repository;

import com.abraham_bankole.stridedotcom.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    //List<User> findByUserId();
}
