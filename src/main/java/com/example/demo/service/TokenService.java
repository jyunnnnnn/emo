package com.example.demo.service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class TokenService {

    private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS512); // 簽名密鑰
    private final long expirationTime = 86400000; // 令牌過期時間 單位毫秒 此為一天

    public String generateToken(String username) {
        try {
            return Jwts.builder()
                    .setSubject(username)
                    .claim("username",username)
                    .signWith(secretKey)
                    .compact();
        }catch (Exception e){
            e.printStackTrace();
            throw e;
        }

    }

    public Claims decodeToken(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
    }
}
