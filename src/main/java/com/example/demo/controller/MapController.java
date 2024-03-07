package com.example.demo.controller;

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
        model.addAttribute("apiKey", googleMapsApiKey);
        model.addAttribute("username", auth.getName());
        model.addAttribute("authority", auth.getAuthorities());
        if (auth.isAuthenticated()) {
            model.addAttribute("errorMessage", "");
        }
        //System.out.println("API Key: " + googleMapsApiKey);
        return "map";
    }
}