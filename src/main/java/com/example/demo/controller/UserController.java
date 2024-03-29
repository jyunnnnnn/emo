package com.example.demo.controller;

import com.example.demo.config.SecurityConfig;
import com.example.demo.entity.UserInfo;
import com.example.demo.entity.UserPhoto;
import com.example.demo.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.bson.types.Binary;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY;

@RestController
@RequestMapping("/user")
public class UserController {


    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManagerBean;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    public UserController() {
    }

    //註冊新帳號
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody UserInfo request) throws Exception {


        int result = userService.createUser(request);

        if (result == UserService.OK) {
            return ResponseEntity.ok(Collections.singletonMap("message", "帳號註冊成功"));
        }

        System.out.println("error");
        return ResponseEntity.badRequest().body(Collections.singletonMap("message", "帳號已存在"));
    }

    //登入後初始化map頁面使用者資訊
    @GetMapping("/init")
    public ResponseEntity<?> loginUser(@RequestParam("username") String username) throws JsonProcessingException {
        UserInfo userInfoData = this.userService.findUserDataFromUsername(username);
        userInfoData.setPassword("不給你看");
        System.out.println(userInfoData);
        ObjectMapper objectMapper = new ObjectMapper();
        String userDataJson = objectMapper.writeValueAsString(userInfoData);
        Map<String, String> response = new HashMap<>();
        response.put("user", userDataJson);
        return ResponseEntity.ok(response);
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
        UserInfo result = this.userService.fetchOneUserByUsername(username);


        if (result == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "使用者不存在"));
        }
        return ResponseEntity.ok(result);
    }


    //用電子郵件檢查是否存在使用者
    @GetMapping("/checkSpecificAccountByEmail")
    public ResponseEntity<?> fetchSpecificAccountByEmail(@RequestParam("userMail") String email) {

        UserInfo result = this.userService.findSpecificAccountByEmail(email);

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
    public ResponseEntity<?> googleLogin(@RequestBody String googleInfo, HttpServletRequest req) throws Exception {
        //抓取該google帳戶userId
        UserInfo result = this.userService.googleLogin(googleInfo);


        //轉換json字串
        ObjectMapper objectMapper = new ObjectMapper();
        String userDataJson = objectMapper.writeValueAsString(result);

        System.out.println(userDataJson);

        UsernamePasswordAuthenticationToken authReq = new UsernamePasswordAuthenticationToken(result.getUsername(),"dummy");

        Authentication auth = authenticationManagerBean.authenticate(authReq);
        SecurityContext securityContext = SecurityContextHolder.getContext();
        securityContext.setAuthentication(auth);
        HttpSession session = req.getSession(true);
        session.setAttribute(SPRING_SECURITY_CONTEXT_KEY, securityContext);


        //登入成功
        Map<String, String> response = new HashMap<>();
        response.put("message", "登入成功!");
        response.put("location", "map");
        response.put("username", result.getUsername());
        return ResponseEntity.ok(response);
    }
    @PutMapping("/updatePhoto")
    public ResponseEntity<?> updatePhotoData(@RequestParam("username") String username, @RequestParam("photo") MultipartFile photo) throws IOException {

        BufferedImage photoByte=convertMultipartFileToImage(photo);
        System.out.println(photo);
        int result = this.userService.updatePhoto(username, photoByte);

        if (result == UserService.OK)
            return ResponseEntity.ok(Collections.singletonMap("message", "修改頭像成功"));

        return ResponseEntity.badRequest().body(Collections.singletonMap("message", "修改頭像失敗"));
    }
    public BufferedImage convertMultipartFileToImage(MultipartFile file) throws IOException {
        // 从 MultipartFile 对象中获取字节数组
        byte[] bytes = file.getBytes();
        // 创建 ByteArrayInputStream 以读取字节数组
        ByteArrayInputStream bis = new ByteArrayInputStream(bytes);
        // 读取字节数组并创建 BufferedImage 对象
        BufferedImage image = ImageIO.read(bis);
        // 关闭 ByteArrayInputStream
        bis.close();
        // 返回 BufferedImage 对象
        return image;
    }

}
