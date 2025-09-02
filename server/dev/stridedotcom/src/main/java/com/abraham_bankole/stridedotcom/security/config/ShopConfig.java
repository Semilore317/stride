package com.abraham_bankole.stridedotcom.security.config;

import com.abraham_bankole.stridedotcom.security.jwt.AuthTokenFilter;
import com.abraham_bankole.stridedotcom.security.jwt.JwtEntryPoint;
import com.abraham_bankole.stridedotcom.security.user.ShopUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@Configuration //directs Spring to find Beans in this class
@EnableWebSecurity
@RequiredArgsConstructor
public class ShopConfig {
    private final ShopUserDetailsService shopUserDetailsService;
    private final JwtEntryPoint authEntryPoint;

    @Value("/api/v1")
    private static String API;

    // urls that must be accessed ONLY after auth
    private static final List<String> SECURED_URLS
            = List.of(API+"/carts/**", API+"/cartItems/**", API+"/orders/**");

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public AuthTokenFilter authTokenFilter() {
        return new AuthTokenFilter()
                ;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // simply just an encrpytion algorithm
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() { //Data Access Object
        var authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(shopUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(exception -> exception.authenticationEntryPoint(authEntryPoint))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth.requestMatchers(SECURED_URLS.toArray(String[]::new))
                        .authenticated()
                        .anyRequest().permitAll());

        http.authenticationProvider(authenticationProvider());
        // tell Spring to use my filter before its own
        http.addFilterBefore(authTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}