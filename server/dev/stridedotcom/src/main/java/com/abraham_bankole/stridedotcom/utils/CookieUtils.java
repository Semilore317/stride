package com.abraham_bankole.stridedotcom.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class CookieUtils {

    private static final Logger log = LoggerFactory.getLogger(CookieUtils.class);
    private static final String REFRESH_TOKEN_COOKIE = "refresh_token";

    @Value("${app.useSecureCookie:false}")
    private boolean useSecureCookie;

    public void addRefreshTokenCookie(HttpServletResponse response, String refreshToken, long maxAge) {
        if (response == null) {
            throw new IllegalArgumentException("HttpServletResponse cannot be null");
        }
        Cookie refreshTokenCookie = new Cookie(REFRESH_TOKEN_COOKIE, refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge((int) (maxAge / 1000));
        refreshTokenCookie.setSecure(useSecureCookie);
        String sameSite = useSecureCookie ? "None" : "Lax";
        setResponseHeader(response, refreshTokenCookie, sameSite);
    }

    private void setResponseHeader(HttpServletResponse response, Cookie refreshTokenCookie, String sameSite) {
        String cookieHeader = refreshTokenCookie.getName() + "=" + refreshTokenCookie.getValue()
                + "; HttpOnly; Path=" + refreshTokenCookie.getPath()
                + "; Max-Age=" + refreshTokenCookie.getMaxAge()
                + (useSecureCookie ? "; Secure" : "")
                + "; SameSite=" + sameSite;
        response.setHeader("Set-Cookie", cookieHeader);
    }

    public String getRefreshTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (REFRESH_TOKEN_COOKIE.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        log.debug("No {} cookie found in request.", REFRESH_TOKEN_COOKIE);
        return null;
    }
}