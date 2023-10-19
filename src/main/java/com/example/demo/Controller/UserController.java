package com.example.demo.Controller;

import com.example.demo.service.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    private UserService userService;
    @PostMapping("/register")
    //code here
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody User request) {
        String account = request.getAccount();
        String password = request.getPassword();
        String confirmPassword = request.getConfirmPassword();
        // 帐号只能包含英文字母和数字
        if (!account.matches("^[A-Za-z0-9]+$")) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "帳號必須由英文字母和數字組成"));
            //return ResponseEntity.badRequest().body("帳號必須由英文字母和數字組成。");
        }
        // 在数据库中检查帐号是否已存在
        if (userService.isAccountExists(account)) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "帳號已存在"));
        }

        // 检查密码和确认密码是否相同
        if (!password.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "密碼和確認密碼不匹配"));
        }
        // 创建用户并保存到数据库
        userService.createUser(account, password);

        return ResponseEntity.ok(Collections.singletonMap("message", "註冊成功!"));
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User request) {
        String account = request.getAccount();
        String password = request.getPassword();

        if (userService.isValidUser(account, password)) {

            Map<String, String> response = new HashMap<>();
            response.put("message", "註冊成功!");
            response.put("location", "test.html");
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "登入失敗，帳號或密碼錯誤"));
        }
    }
}
