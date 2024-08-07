package com.example.demo.controller;

import com.example.demo.entity.UserAchievementEntity;
import com.example.demo.entity.UserInfo;
import com.example.demo.repository.UserRecordCounterRepository;
import com.example.demo.service.RankService;
import com.example.demo.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY;

@RestController
@RequestMapping("/user")
public class UserController {


    @Autowired
    private UserService userService;

    @Autowired
    private RankService rankService;

    @Autowired
    private UserRecordCounterRepository userRecordCounterRepository;

    @Autowired
    private AuthenticationManager authenticationManagerBean;

    @Autowired
    public UserController(UserService userService, UserRecordCounterRepository userRecordCounterRepository, RankService rankService) {
        this.userService = userService;
        this.userRecordCounterRepository = userRecordCounterRepository;
    }

    public UserController() {
    }


    //Thread Pool
    private ExecutorService executorService = Executors.newCachedThreadPool();

    //非同步執行緒更新排行榜物件
    public void initRankObjThread() {
        executorService.submit(new Runnable() {
            @Override
            public void run() {
                //登入之後，系統需要更新使用者排行榜物件
                rankService.updateRankObject();
//                System.out.println("更新成功");
            }
        });
    }

    //新的使用者須創立一個成就紀錄物件到資料庫內

    private void createNewUserAchievementCollection(String userId) {
        if (this.userRecordCounterRepository.findByUserId(userId) == null) {
            UserAchievementEntity userAchievementEntity = new UserAchievementEntity();
            userAchievementEntity.setUserId(userId);
            userAchievementEntity.setAchieveTime(new HashMap<>());
            userAchievementEntity.setClassRecordCounter(new HashMap<>());
            userAchievementEntity.setClassRecordCarbonCounter(new HashMap<>());
            this.userRecordCounterRepository.save(userAchievementEntity);
        }

    }

    //註冊新帳號
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody UserInfo request) throws Exception {


        int result = userService.createUser(request);

        if (result == UserService.OK) {
            //創建新的使用者成就物件
            createNewUserAchievementCollection(request.getUserId());
            //有新的使用者註冊，須更新排行的物件
            return ResponseEntity.ok(Collections.singletonMap("message", "帳號註冊成功"));
        }

        System.out.println("error");
        return ResponseEntity.badRequest().body(Collections.singletonMap("message", "帳號已存在"));
    }

    //登入後初始化map頁面使用者資訊
    @GetMapping("/init")
    public ResponseEntity<?> loginUser(@RequestParam("username") String username) throws JsonProcessingException {

        //非同步執行排行榜物件更新
        this.initRankObjThread();


        //抓取使用者資料
        UserInfo userInfoData = this.userService.findUserDataFromUsername(username);
        userInfoData.setPassword("");

//        System.out.println(userInfoData);

        //將使用者物件轉乘Json檔回傳
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

        //創建使用者成就資料庫
        this.createNewUserAchievementCollection(result.getUserId());

        //轉換json字串
        ObjectMapper objectMapper = new ObjectMapper();
        String userDataJson = objectMapper.writeValueAsString(result);


        UsernamePasswordAuthenticationToken authReq = new UsernamePasswordAuthenticationToken(result.getUsername(), "dummy");

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
        //登入之後，系統需要更新使用者排行榜物件
        rankService.updateRankObject();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/updatePhoto")
    public ResponseEntity<?> updatePhotoData(@RequestParam("username") String username, @RequestParam("photo") String photo) throws IOException {
        int result = this.userService.updatePhoto(username, photo);

        if (result == UserService.OK)
            return ResponseEntity.ok(Collections.singletonMap("message", "修改頭像成功"));

        return ResponseEntity.badRequest().body(Collections.singletonMap("message", "修改頭像失敗"));
    }


}
