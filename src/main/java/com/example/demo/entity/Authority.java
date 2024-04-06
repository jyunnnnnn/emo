package com.example.demo.entity;

import org.springframework.security.core.GrantedAuthority;

public enum Authority implements GrantedAuthority {
    ADMIN, NORMAL;


    @Override
    public String getAuthority() {
        return name();
    }
}
