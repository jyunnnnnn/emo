package com.example.demo.controller;

import com.example.demo.service.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {


    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }


    //註冊新帳號
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody User request) {


        int result = userService.createUser(request);

        if (result == UserService.OK) {
            return ResponseEntity.ok(Collections.singletonMap("message", "帳號註冊成功"));
        }


        return ResponseEntity.badRequest().body(Collections.singletonMap("message", "帳號已存在"));
    }

    //登入
    @GetMapping("/login")
    public ResponseEntity<?> loginUser(@RequestParam("username") String username, @RequestParam("password") String password) {
        int result = this.userService.login(username, password);

        if (result == UserService.OK) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "登入成功!");
            response.put("location", "/map");
            response.put("username", username);
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body(Collections.singletonMap("message", "登入失敗"));
    }

    //修改密碼
    @PutMapping("/update")
    public ResponseEntity<?> updatePassword(@RequestParam("email") String email, @RequestParam("password") String password) {
        int result = this.userService.updatePassword(email, password);

        if (result == UserService.OK)
            return ResponseEntity.ok(Collections.singletonMap("message", "修改密碼成功"));

        return ResponseEntity.badRequest().body(Collections.singletonMap("message", "修改密碼失敗"));
    }
}
