package com.example.demo.controller;

import com.example.demo.service.ApiKeyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiKeyController {

    private final ApiKeyService apiKeyService;

    public ApiKeyController(ApiKeyService apiKeyService) {
        this.apiKeyService = apiKeyService;
    }

    @GetMapping("/api/getApiKey")
    public ResponseEntity<String> getApiKey() {
        return ResponseEntity.ok(apiKeyService.getApiKey());
    }
}