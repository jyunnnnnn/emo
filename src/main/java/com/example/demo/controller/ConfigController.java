package com.example.demo.controller;

import com.example.demo.entity.updateRecordRequest;
import com.example.demo.service.ConfigService;
import com.example.demo.service.RecordWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;
import java.util.Collections;
import java.util.Map;

//獲取、更新設定檔內容controller
@RestController
@RequestMapping("/config")
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


    @PutMapping("/updateRecord")
    public ResponseEntity<?> updateRecord(@RequestBody Map<String, updateRecordRequest> item) {
        String className = (String) item.keySet().toArray()[0];
        this.configService.updateRecordClass(className, item.get(className));
        return ResponseEntity.ok(Collections.singletonMap("message", "Update　Success"));
    }

    //測試用
    @GetMapping("/test")
    public ResponseEntity<?> test() throws FileNotFoundException {
        return ResponseEntity.ok(this.configService.test());
    }


}
