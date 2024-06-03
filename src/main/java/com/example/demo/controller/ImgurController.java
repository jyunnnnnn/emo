package com.example.demo.controller;
import com.example.demo.service.ImgurService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/imgur")
public class ImgurController {
    private final ImgurService imgurService;

    public ImgurController(ImgurService imgurService) {
        this.imgurService = imgurService;
    }

    @PostMapping("/upload")
    public String uploadImage(@RequestParam("image") MultipartFile image) {
        try {
            byte[] imageData = image.getBytes();
            return imgurService.uploadImage(imageData);
        } catch (IOException e) {
            e.printStackTrace();
            return "Failed to upload image: " + e.getMessage();
        }
    }
}
