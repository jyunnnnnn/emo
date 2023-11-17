package com.example.demo.controller;
import com.example.demo.service.Footprint;
import com.example.demo.service.FootprintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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

}
