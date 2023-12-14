package com.example.demo.controller;

import com.example.demo.service.EncryptService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class EncryptController {
    private final EncryptService encryptService;
    @Autowired
    public EncryptController(EncryptService encryptService){
        this.encryptService=encryptService;
    }


    @GetMapping("/getEncryptKey")
    public ResponseEntity<Map<String, String>> getEncryptKey() throws Exception {
        try{
            String key=encryptService.getKey();
            String iv =encryptService.getIv();
            Map<String,String> map=new HashMap<>();
            map.put("key",key);
            map.put("iv",iv);
            return  ResponseEntity.ok(map);
        }catch (Exception err){
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "獲取金鑰失敗"));
        }

    }
}
