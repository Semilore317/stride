package com.abraham_bankole.stridedotcom.controller;

import com.abraham_bankole.stridedotcom.request.LoginRequest;
import com.abraham_bankole.stridedotcom.security.jwt.JwtUtils;
import com.abraham_bankole.stridedotcom.security.user.ShopUserDetailsService;
import com.abraham_bankole.stridedotcom.utils.CookieUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final JwtUtils jwtUtils;
    private final CookieUtils cookieUtils;
    private final ShopUserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;

    @Value("${auth.token.refresh-expiration-in-millis:604800000}")
    private long refreshTokenExpirationTime;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest request, HttpServletResponse response) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        String accessToken  = jwtUtils.generateAccessTokenForUser(authentication);
        String refreshToken = jwtUtils.generateRefreshToken(request.getEmail());
        cookieUtils.addRefreshTokenCookie(response, refreshToken, refreshTokenExpirationTime);
        Map<String, String> token = new HashMap<>();
        token.put("accessToken", accessToken);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshAccessToken(HttpServletRequest request) {
        String refreshToken = cookieUtils.getRefreshTokenFromCookies(request);
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No refresh token cookie found.");
        }
        if (!jwtUtils.validateToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Refresh token is expired or invalid.");
        }
        try {
            String username    = jwtUtils.getUsernameFromToken(refreshToken);
            UserDetails user   = userDetailsService.loadUserByUsername(username);
            String newAccess   = jwtUtils.generateAccessTokenForUser(
                    new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities()));
            Map<String, String> token = new HashMap<>();
            token.put("accessToken", newAccess);
            return ResponseEntity.ok(token);
        } catch (Exception e) {
            log.error("Error generating new access token: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error generating access token.");
        }
    }
}