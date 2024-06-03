package com.example.demo.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
@Service
public class ImgurService {

    private final String IMGUR_API_URL = "https://api.imgur.com/3/image";
    private final String CLIENT_ID = "f8ebf6d26f593f5";

    private final RestTemplate restTemplate;
    @Autowired
    public ImgurService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String uploadImage(byte[] imageData) {
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.AUTHORIZATION, "Client-ID " + CLIENT_ID);

        HttpEntity<byte[]> requestEntity = new HttpEntity<>(imageData, headers);

        ResponseEntity<String> responseEntity = restTemplate.exchange(IMGUR_API_URL, HttpMethod.POST, requestEntity, String.class);

        return responseEntity.getBody();
    }
}