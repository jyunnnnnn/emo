package com.example.demo.controller;

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
    @PutMapping("/updateRecord")
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
    public ResponseEntity<?> getSpecificUserRecord(@RequestParam("userId") String userId) {// /api/getSpecificUserRecord?userId=test
        System.out.println("userId:" + userId);
        try {
            //username = new AESEncryption().encrypt(username);//將帳號加密成user_id
            List<EcoRecord> records = this.ecoRecordService.getSpecificUserRecords(userId);
            return ResponseEntity.ok(records);
        } catch (Exception err) {
            System.err.println(err + " 抓取特定使用者紀錄過程出現錯誤");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }


    }

    //抓取所有紀錄
    @GetMapping("/getAllRecords")
    public ResponseEntity<?> getAllRecords() {
        try {
            List<EcoRecord> records = this.ecoRecordService.getAllRecords();
            return ResponseEntity.ok(records);
        } catch (Exception err) {
            System.err.println(err + " 抓取所有紀錄過程出現錯誤");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    //刪除特定一個紀錄
    @DeleteMapping("/deleteOneRecord")
    public ResponseEntity<?> deleteOneRecord(@RequestParam("recordId") String recordId) {
        try {
            this.ecoRecordService.deleteOneRecord(recordId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception err) {
            System.err.println("刪除" + recordId + "紀錄過程出現問題");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }

    //刪除多筆紀錄
    @DeleteMapping("/deleteMulRecord")
    public ResponseEntity<?> deleteMulRecord(@RequestBody List<String> recordIdList) {
        try {

            for (int i = 0; i < recordIdList.size(); i++) {
                this.ecoRecordService.deleteOneRecord(recordIdList.get(i));
            }
            /*json傳遞格式 recordId陣列
                [
                    "1701610871653",
                    "1701610876065"
                ]
            */

            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception err) {
            System.err.println("刪除多筆紀錄過程出現問題");
            err.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }


    //刪除特定使用者紀錄
    @DeleteMapping("/deleteSpecificUserRecord")
    public ResponseEntity<?> deleteSpecificUserRecord(@RequestParam("userId") String userId) {
        try {
            this.ecoRecordService.deleteSpecificUserRecord(userId);
            return ResponseEntity.ok("Ok");
        } catch (Exception err) {
            System.err.println(err + "刪除特定使用者紀錄過程出現錯誤");
            return ResponseEntity.ok("Fail");
        }
    }

    //刪除資料庫內所有紀錄(自己人使用)
    @DeleteMapping("/deleteAllRecords")
    public ResponseEntity<?> deleteAllRecord() {
        try {
            this.ecoRecordService.deleteAllRecord();
            return ResponseEntity.ok("Ok");
        } catch (Exception err) {
            System.err.println(err + "刪除所有紀錄過程出現錯誤");
            return ResponseEntity.ok("Fail");
        }
    }
}
