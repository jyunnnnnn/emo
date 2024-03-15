package com.example.demo.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ApiKeyService {

    @Value("${google.maps.api.key}")
    private String apiKey;
    public String getApiKey() {
        return apiKey;
    }
}
