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

    @PostMapping("/register")
    //code here

    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody User request) {
        System.out.println("test");
        String account = request.getAccount();
        String password = request.getPassword();
        String confirmPassword = request.getConfirmPassword();
        if (!account.matches("^[A-Za-z0-9]+$")) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "帳號必須由英文字母和數字組成"));
            //return ResponseEntity.badRequest().body("帳號必須由英文字母和數字組成。");
        }
        if (userService.isAccountExists(account) == UserService.USER_FOUND) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "帳號已存在"));
        }
        if (!password.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "密碼和確認密碼不匹配"));
        }

        userService.createUser(account, password);

        return ResponseEntity.ok(Collections.singletonMap("message", "註冊成功!"));
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User request) {
        String account = request.getAccount();
        String password = request.getPassword();

        try {
            if (userService.isValidUser(account, password)) {

                Map<String, String> response = new HashMap<>();
                response.put("message", "登入成功!");
                response.put("location", "main.html");
                return ResponseEntity.ok(response);
            } else {
                throw new Exception(":(");
            }
        }catch (Exception e){
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "登入失敗，帳號或密碼錯誤"));
        }
    }
}
