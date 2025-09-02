package com.abraham_bankole.stridedotcom.security.jwt;


import com.abraham_bankole.stridedotcom.security.user.ShopUserDetails;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.Key;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtils{
    @Value("${auth.token.jwt-secret}")
    private String jwtSecret;

    @Value("${auth.token.access-expiration-in-millis}")
    private String expirationTime;    // for some reason, i used String and not Long

    @Value("${auth.token.refresh-expiration-in-millis}")
    private String refreshExpirationTime; // for some reason, i used String and not Long

    @PostConstruct
    public void loadJwtSecretFromFile() {
        if (jwtSecret != null && jwtSecret.startsWith("@file:")) {
            String filePath = jwtSecret.substring(6); // remove "@file:"
            try {
                jwtSecret = Files.readString(Path.of(filePath)).trim();
                System.out.println("✅ JWT Secret loaded from file: " + filePath);
            } catch (IOException e) {
                throw new RuntimeException("Could not read JWT secret from file: " + filePath, e);
            }
        } else {
            System.out.println("✅ JWT Secret loaded directly from properties");
        }

        // Optional sanity check: ensure it's base64-decodable and long enough
        byte[] decoded = Decoders.BASE64.decode(jwtSecret);
        if (decoded.length < 32) {
            throw new IllegalArgumentException("JWT secret is too short. Must be at least 256 bits (32 bytes).");
        }
    }


    public String generateAccessTokenForUser(Authentication authentication) {
        ShopUserDetails userPrincipal = (ShopUserDetails) authentication.getPrincipal();

        List<String> roles = userPrincipal.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority).toList();

        return Jwts.builder()
                .setSubject(userPrincipal.getEmail())
                .claim("id", userPrincipal.getId())
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(calculateExpirationDate(expirationTime))
                .signWith(key(), SignatureAlgorithm.HS256).compact();
    }

    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(calculateExpirationDate(refreshExpirationTime))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key key() {
        //return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
        //return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

//    @PostConstruct
//    public void debugSecret() {
//        System.out.println("Loaded JWT Secret: '" + jwtSecret + "'");
//    }



    private Date calculateExpirationDate(String expirationTimeString) {
        long expirationTime = Long.parseLong(expirationTimeString); // Convert String to long
        return new Date(System.currentTimeMillis() + expirationTime);
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            throw new JwtException(e.getMessage());
        }
    }
}
