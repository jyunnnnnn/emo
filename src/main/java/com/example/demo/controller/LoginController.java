package com.example.demo.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;

@Controller
public class LoginController {
    private Authentication auth;

    @GetMapping("/login")
    public String showLogin(HttpServletRequest request, Model model) {
        auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(auth.getPrincipal());
        //檢查是否已登入
        if (!auth.getPrincipal().equals("anonymousUser")) {
            return "map";
        }
        return "login";
    }

}
