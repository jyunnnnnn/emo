package com.example.demo.controller;

import com.example.demo.service.AESEncryption;
import com.example.demo.service.EcoRecord;
import com.example.demo.service.EcoRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class EcoController {
    private final EcoRecordService ecoRecordService;


    //constructor
    @Autowired
    public EcoController(EcoRecordService ecoRecordService) {
        this.ecoRecordService = ecoRecordService;
    }

    //新增紀錄

    @PostMapping("/addRecord")
    public ResponseEntity<?> addRecord(@RequestBody EcoRecord ecoRecord) {
        try {
            this.ecoRecordService.addRecord(ecoRecord);
            System.out.println(ecoRecord);
        } catch (Exception err) {
            System.err.println(err + " 使用者新增紀錄過程出現錯誤");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok("Record added successfully");
    }

    //更新紀錄
    @PostMapping("/updateRecord")
    public ResponseEntity<?> updateRecord(@RequestBody EcoRecord ecoRecord) {
        //是否正常更新
        try {
            this.ecoRecordService.updateRecord(ecoRecord);
        } catch (Exception err) {
            System.err.println(err + " 使用者更新資料過程出現錯誤");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok("Record updated successfully");
    }

    //抓取特定使用者的所有紀錄
    @GetMapping("/getSpecificUserRecord")
    public ResponseEntity<?> getSpecificUserRecord(@RequestParam("username") String username) {// /api/getSpecificUserRecord?userId=test
        try {
            username = new AESEncryption().encrypt(username);//將帳號加密成user_id
            List<EcoRecord> records = this.ecoRecordService.getSpecificUserRecords(username);
            return ResponseEntity.ok(records);
        } catch (Exception err) {
            System.err.println(err + " 抓取特定使用者紀錄過程出現錯誤");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }


    }

    //抓取所有紀錄
    @GetMapping("/getAllRecords")
    public ResponseEntity<?> getRecords() {
        try {
            List<EcoRecord> records = this.ecoRecordService.getAllRecords();
            return ResponseEntity.ok(records);
        } catch (Exception err) {
            System.err.println(err + " 抓取所有紀錄過程出現錯誤");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }


    }
}
