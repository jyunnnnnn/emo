package com.example.demo.controller;
import com.example.demo.service.Footprint;
import com.example.demo.service.FootprintService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
@RestController
@RequestMapping("/api")
public class FootprintController {
    private final FootprintService footprintService;

    @Autowired
    public FootprintController(FootprintService footprintService) {this.footprintService = footprintService;}

    //從資料庫讀取係數傳給前端
    @GetMapping("/getFootprint")
    public ResponseEntity<?> getFootprint() {
        try {
            List<Footprint> Footprint = this.footprintService.getAllFootprint();
            return ResponseEntity.ok(Footprint);
        } catch (Exception err) {
            System.err.println(err + " 抓取所有係數過程出現錯誤");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    //新增數據
    @PostMapping("/addFootprint")
    public ResponseEntity<?> addFootprint(@RequestBody Footprint footprint) {
        try {
            this.footprintService.addFootprint(footprint);
            System.out.println(footprint);
        } catch (Exception err) {
            System.err.println(err + " 新增過程出現錯誤");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok("Footprint added successfully");
    }
    @PutMapping("/updateFootprint")
    public ResponseEntity<?> updateFootprint(@RequestParam("FPId") String FPId,@RequestParam("coefficient") double newCoefficient) {
        System.out.println("Received request with FPId: " + FPId + " and coefficient: " + newCoefficient);
        int result = this.footprintService.updateFootprintByFPId(FPId, newCoefficient);
        if (result == FootprintService.OK)
            return ResponseEntity.ok(Collections.singletonMap("message", "修改係數成功"));
        return ResponseEntity.badRequest().body(Collections.singletonMap("message", "修改係數失敗"));
    }
    @DeleteMapping("/deleteAllFootprint")
    public ResponseEntity<?> deleteAllRecord() {
        try {
            this.footprintService.deleteAllFootprint();
            return ResponseEntity.ok("Ok");
        } catch (Exception err) {
            System.err.println(err + "刪除所有紀錄過程出現錯誤");
            return ResponseEntity.ok("Fail");
        }
    }
    @DeleteMapping("/deleteOneFootprint")
    public ResponseEntity<?> deleteOneFootprint(@RequestParam("FPId") String FPId) {
        try {
            this.footprintService.deleteOneFootprint(FPId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception err) {
            System.err.println("刪除" + FPId + "紀錄過程出現問題");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }
}
