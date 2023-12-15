package com.example.demo.controller;

import com.example.demo.service.User;
import com.example.demo.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Collections;
import java.util.Date;
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
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody User request) throws Exception {


        int result = userService.createUser(request);

        if (result == UserService.OK) {
            return ResponseEntity.ok(Collections.singletonMap("message", "帳號註冊成功"));
        }


        return ResponseEntity.badRequest().body(Collections.singletonMap("message", "帳號已存在"));
    }

    //登入
    @GetMapping("/login")
    public ResponseEntity<?> loginUser(@RequestParam("username") String username, @RequestParam("password") String password) throws JsonProcessingException {
        int result = this.userService.login(username, password);
        User userData = this.userService.findUserDataFromUsername(username);
        ObjectMapper objectMapper = new ObjectMapper();
        String userDataJson = objectMapper.writeValueAsString(userData);
        if (result == UserService.OK) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "登入成功!");
            response.put("location", "/map");
            response.put("user", userDataJson);
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body(Collections.singletonMap("message", "登入失敗"));
    }

    //修改密碼
    @PutMapping("/update")
    public ResponseEntity<?> updatePassword(@RequestParam("userMail") String email, @RequestParam("password") String password) {
        int result = this.userService.updatePassword(email, password);

        if (result == UserService.OK)
            return ResponseEntity.ok(Collections.singletonMap("message", "修改密碼成功"));

        return ResponseEntity.badRequest().body(Collections.singletonMap("message", "修改密碼失敗"));
    }

    //用帳號修改密碼
    @PutMapping("/updateByUsername")
    public ResponseEntity<?> updateByUsername(@RequestParam("username") String username, @RequestParam("password") String newPassword) {
        int result = this.userService.updatePasswordByUsername(username, newPassword);
        if (result == UserService.OK) {
            return ResponseEntity.ok(Collections.singletonMap("message", "修改密碼成功"));
        }
        return ResponseEntity.badRequest().body(Collections.singletonMap("message", "修改密碼失敗"));

    }

    //帳號是否存在
    @GetMapping("/accountExist")
    public ResponseEntity<?> accountExist(@RequestParam("userMail") String email) {
        int result = this.userService.isAccountExists(email);
        //使用者是否存在
        if (result == UserService.USER_FOUND) {
            return ResponseEntity.ok(Collections.singletonMap("message", "使用者已存在"));
        }
        return ResponseEntity.ok(Collections.singletonMap("message", "使用者不存在"));
    }

    //刪除帳號
    @DeleteMapping("/deleteUserAccount")
    public ResponseEntity<?> deleteUserAccount(@RequestParam("userId") String userId) {
        try {
            this.userService.deleteAccountByUserId(userId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception err) {
            System.err.println("刪除" + userId + "帳號過程出現問題");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }

    //使用帳號檢查該使用者是否存在 並回傳該使用者資料
    @GetMapping("/checkAccountExistByUsername")
    public ResponseEntity<?> chekcAccountExistByUsername(@RequestParam("username") String username) {
        User result = this.userService.fetchOneUserByUsername(username);


        if (result == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "使用者不存在"));
        }
        return ResponseEntity.ok(result);
    }


    //用電子郵件檢查是否存在使用者
    @GetMapping("/checkSpecificAccountByEmail")
    public ResponseEntity<?> fetchSpecificAccountByEmail(@RequestParam("userMail") String email) {

        User result = this.userService.findSpecificAccountByEmail(email);

        if (result == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "使用者不存在"));
        }
        return ResponseEntity.ok("使用者存在");
    }

    //檢查該帳號是否可以修改密碼
    @GetMapping("/passwordChangable")
    public ResponseEntity<?> passwordChangable(@RequestParam("username") String username) {
        int result = this.userService.checkPasswordChangable(username);
        System.out.println(result);
        if (result == UserService.OK) {
            return ResponseEntity.ok(Collections.singletonMap("message", username + "可以修改密碼"));
        }
        return ResponseEntity.badRequest().body(Collections.singletonMap("message", username + "不可修改密碼"));
    }

    //使得某帳號可以修改密碼
    @PostMapping("/allowChangePassword")
    public ResponseEntity<?> allowChangePassword(@RequestParam("username") String username) {
        int result = this.userService.allowChangePassword(username);
        if (result == UserService.OK)
            return ResponseEntity.ok(Collections.singletonMap("message", username + "已可以修改密碼"));
        return ResponseEntity.badRequest().body(Collections.singletonMap("message", username + "賦予密碼修改權限失敗"));
    }

    //修改暱稱
    @PutMapping("/updateNickname")
    public ResponseEntity<?> updateNickname(@RequestParam("username") String username, @RequestParam("nickname") String newNickname) {
        System.out.println("Received request with username: " + username + " and nickname: " + newNickname);
        int result = this.userService.updateNicknameByUsername(username, newNickname);
        if (result == UserService.OK)
            return ResponseEntity.ok(Collections.singletonMap("message", "修改暱稱成功"));
        return ResponseEntity.badRequest().body(Collections.singletonMap("message", "修改暱稱失敗"));
    }

    //Google登入
    @PostMapping("/googleLogin")
    public ResponseEntity<?> googleLogin(@RequestBody String googleInfo) throws Exception {
        //抓取該google帳戶userId
        User result = this.userService.googleLogin(googleInfo);


        //google登入失敗
        if (result==null)
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "使用google帳號登入失敗"));


        //轉換json字串
        ObjectMapper objectMapper = new ObjectMapper();
        String userDataJson = objectMapper.writeValueAsString(result);


        //登入成功
        Map<String, String> response = new HashMap<>();
        response.put("message", "登入成功!");
        response.put("location", "/map");
        response.put("user", userDataJson);
        return ResponseEntity.ok(response);
    }
}
