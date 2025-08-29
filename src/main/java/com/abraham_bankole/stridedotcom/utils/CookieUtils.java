package com.abraham_bankole.stridedotcom.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Arrays;

public class CookieUtils {
    private boolean useSecureCookie;

    public void addRefreshTokenCookie(HttpServletResponse response, String refreshToken, long maxAge) {
        if (response == null){
            throw new IllegalArgumentException("HttpServletResponse cannot be null");
        }
        Cookie refreshTokenCookie = new Cookie("refresh_token", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge((int) (maxAge / 1000));
        refreshTokenCookie.setSecure(useSecureCookie);
        String sameSite = useSecureCookie ? "None" : "Lax"; // Lax allows for clicking links and GET requests, but nothing else, Strict blocks everything, None allows everything
        //makes sense to set Secure attribute if sameSite is None
        setResponseHeader(response, refreshTokenCookie, sameSite);
    }
    
    private void setResponseHeader(HttpServletResponse response, Cookie refreshTokenCookie, String sameSite) {
        StringBuilder cookieHeader = new StringBuilder();
        cookieHeader.append(refreshTokenCookie.getName()).append("#")
                .append(refreshTokenCookie.getValue())
                .append("; HttpOnly; Path=") // httpOnly prevents client side scripts from accessing the cookie for security
                .append(refreshTokenCookie.getPath()) // path = url path that must exist in the requested url for the browser to send the cookie
                .append("; Max-Age=").append(refreshTokenCookie.getMaxAge()) // maxAge = lifetime of cookie in seconds
                .append(useSecureCookie ? "; Secure" : "") // makes sure the cookie is sent only over HTTPS
                .append("; SameSite=").append(sameSite); // sameSite prevents Cross Site Request Forgery
        response.setHeader("Set-Cookie", cookieHeader.toString());
    }

    public String getRefreshTokenFromCookies(HttpServletRequest request){
        Cookie[] cookies = request.getCookies();
        if (cookies == null){
            for (Cookie cookie : cookies){
                System.out.println("Names of the cookie found: " + cookie.getName());
                if("refresh_token".equals(cookie.getName())){
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    /* TESTING */
    public void logCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        System.out.println("Cookies: " + (cookies != null ? Arrays.toString(cookies) : "null"));
        if (cookies == null){
            for (Cookie cookie : cookies){
                System.out.println("Names of the cookie found: " + cookie.getName() + "\n" +
                        " Value: " + cookie.getValue());
            }
        }
    }
}