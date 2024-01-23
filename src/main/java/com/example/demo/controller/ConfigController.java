package com.example.demo.controller;

import com.example.demo.service.ConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.FileNotFoundException;

//獲取、更新設定檔內容controller
@RestController
@RequestMapping("/api")
public class ConfigController {
    private final ConfigService configService;

    @Autowired
    public ConfigController(ConfigService configService) {
        this.configService = configService;
    }

    //回傳所有紀錄類別詳細資訊
    @GetMapping("/GetAllRecordJson")
    public ResponseEntity<?> GetAllRecordJson() throws FileNotFoundException {
        return ResponseEntity.ok(this.configService.getAllRecordJson());
    }

    //測試用
    @GetMapping("/test")
    public ResponseEntity<?> test() throws FileNotFoundException {
        return ResponseEntity.ok(this.configService.test());
    }

}
