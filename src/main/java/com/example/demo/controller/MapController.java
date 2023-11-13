package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MapController {

    @Value("${google.maps.api.key}")
    private String googleMapsApiKey;

    @GetMapping("/map")
    public String showMap(Model model) {
        model.addAttribute("apiKey", googleMapsApiKey);
        //System.out.println("API Key: " + googleMapsApiKey);
        return "map";
    }
}