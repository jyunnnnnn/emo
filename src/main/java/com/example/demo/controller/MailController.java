package com.example.demo.controller;

import com.example.demo.service.MailService;
import com.fasterxml.jackson.databind.util.JSONPObject;
import org.bson.json.JsonObject;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.json.JSONObject;

import java.util.Collections;

@RestController
@RequestMapping("/api")
public class MailController {
    private final MailService mailService;

    @Autowired
    public MailController(MailService mailService) {
        this.mailService = mailService;
    }

    //寄送驗證碼至使用者信箱
    @PostMapping("/sendVerifyingCode")
    public ResponseEntity<?> sendVerifyingCode(@RequestParam("userMail") String userMail) {// /api/sendVerifyingCode?userMail=test@gmail.com
        try {
            this.mailService.sendMail(userMail);
        } catch (Exception err) {
            System.err.println(err + "\n" + "寄送" + userMail + " 驗證碼過程出現錯誤");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return ResponseEntity.ok("Send verifying code to " + userMail + " success");
    }

    //驗證驗證碼是否正確
    @GetMapping("/matchVerifyingCode")
    public ResponseEntity<?> matchVerifyingCode(@RequestParam("userMail") String userMail, @RequestParam("userInput") String userInput) {
        // /api/sendVerifyingCode?userMail=test@gmail.com&userInput=123456

        int result = this.mailService.validCodeVerify(userMail, userInput);

        if (result == MailService.MAIL_VALIDCODE_CORRECT) return ResponseEntity.ok("Ok");
        return ResponseEntity.badRequest().body(Collections.singletonMap("message", "驗證碼匹配錯誤"));
    }


    //檢查是否可以再寄送驗證碼
    @GetMapping("/sendAgain")
    public ResponseEntity<?> sendAgain(@RequestParam("userMail") String userMail) {

        int result = this.mailService.SendRequest(userMail);
        if (result == MailService.OK) return ResponseEntity.ok("OK");
        return ResponseEntity.badRequest().body(Collections.singletonMap("message", "不可再次發送驗證碼"));
    }
}
