package com.abraham_bankole.stridedotcom;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "password123";

        // Generate a new hash
        String hash = encoder.encode(password);
        System.out.println("Generated hash for 'password123':");
        System.out.println(hash);

        // Test the provided hash
        String providedHash = "$2a$10$EixZaYVJ5xVN/HjdLPCnWO3V8iKDHQXJCB.P.CZRk6M5xLZ6Y8zJK";
        boolean matches = encoder.matches(password, providedHash);
        System.out.println("\nProvided hash matches 'password123': " + matches);
    }
}
