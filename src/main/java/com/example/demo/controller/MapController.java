package com.example.demo.controller;

import com.example.demo.entity.MyUserDetails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MapController {
    private Authentication auth;
    @Value("${google.maps.api.key}")
    private String googleMapsApiKey;

    @GetMapping("/map")
    public String showMap(Model model) {
        auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(auth.getAuthorities() + ": " + auth.getName());

        model.addAttribute("apiKey", googleMapsApiKey);

        if (auth.isAuthenticated()) {
            model.addAttribute("errorMessage", "");
        } else {
            model.addAttribute("errorMessage", "登入失敗，請檢查帳號密碼");
            return "login";
        }
        //System.out.println("API Key: " + googleMapsApiKey);
        return "map";
    }
}