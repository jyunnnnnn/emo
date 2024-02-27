package com.example.demo.controller;
import com.example.demo.service.ConfigService;
import com.example.demo.service.SvgConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.FileNotFoundException;

@RestController
@RequestMapping("/api")
public class SvgConfigController {
    private final SvgConfigService SvgconfigService;

    @Autowired
    public SvgConfigController(SvgConfigService svgconfigService) {
        this.SvgconfigService = svgconfigService;
    }

    //回傳所有紀錄類別詳細資訊
    @GetMapping("/GetAllSvgJson")
    public ResponseEntity<?> GetAllSvgJson() throws FileNotFoundException {
        return ResponseEntity.ok(this.SvgconfigService.getAllSvgJson());
    }

}
