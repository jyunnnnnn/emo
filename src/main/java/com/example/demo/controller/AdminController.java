package com.example.demo.controller;

import com.example.demo.entity.MyUserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.security.core.Authentication;

@Controller
public class AdminController {

    private Authentication auth;

    @GetMapping("/admin")
    public String adminPage() {
        auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(auth.getAuthorities() + ": " + auth.getName());

        return "admin";
    }
}
