package com.abraham_bankole.stridedotcom.controller;

import com.abraham_bankole.stridedotcom.request.LoginRequest;
import com.abraham_bankole.stridedotcom.security.jwt.JwtUtils;
import com.abraham_bankole.stridedotcom.security.user.ShopUserDetailsService;
import com.abraham_bankole.stridedotcom.utils.CookieUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
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
    private final JwtUtils jwtUtils;
    private final CookieUtils cookieUtils;
    private final ShopUserDetailsService shopUserDetailsService;
    private final AuthenticationManager authenticationManager;
    @Value("${auth.token.refresh-expiration-in-millis}")
    private Long refreshTokenExpirationTime;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest request, HttpServletResponse response){
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        String accessToken = jwtUtils.generateAccessTokenForUser(authentication);
        String refreshToken = jwtUtils.generateRefreshToken(request.getEmail());
        cookieUtils.addRefreshTokenCookie(response, refreshToken, refreshTokenExpirationTime);

        Map<String, String> token = new HashMap<>();
        token.put("accessToken", accessToken);
        return ResponseEntity.ok(token);
    }


    /* DEBUGGING STUFF */
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshAccessToken(HttpServletRequest request){
        cookieUtils.logCookies(request);
        String refreshToken = cookieUtils.getRefreshTokenFromCookies(request);
        if(refreshToken != null){
            boolean isValid = jwtUtils.validateToken(refreshToken);
            if(isValid){
                String usernameFromToken = jwtUtils.getUserNameFromToken(refreshToken);
                UserDetails userDetails = shopUserDetailsService.loadUserByUsername(usernameFromToken);
                String newAccessToken = jwtUtils.generateAccessTokenForUser(
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities())
                );
                if (newAccessToken != null) {
                    Map<String, String> token = new HashMap<>();
                    token.put("accessToken", newAccessToken);
                    return ResponseEntity.ok(token);
                }else{
                    return ResponseEntity.status(401).body("Error generating new access token"); // or error 500 but this seems more appropriate
                }
            }
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid Or Expired Access Token");
    }
}
