package com.example.demo.controller;

import com.example.demo.entity.SvgItem;
import com.example.demo.service.SvgConfigService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;
import java.util.Collections;
import java.util.Map;

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

    @PutMapping("/updateSvg")
    public ResponseEntity<?> updateSvg(@RequestBody Map<String, Map<String, Map<String, String>>> request) throws FileNotFoundException {

        String className = null;
        for (String name : request.get("svgImages").keySet())
            className = name;
        System.out.println(className);
        SvgconfigService.updateSvg(className, request.get("svgImages").get(className));
        return ResponseEntity.ok(Collections.singletonMap("message", "update success"));
    }

    @PutMapping("/adminUpdateSvg")
    public ResponseEntity<?> adminUpdateSvg(@RequestBody Map<String, Map<String, String>> req) throws FileNotFoundException {
        String className = (String) req.keySet().toArray()[0];

        this.SvgconfigService.adminPageUpdateClassSvg(className, req.get(className));

        return null;
    }
}
