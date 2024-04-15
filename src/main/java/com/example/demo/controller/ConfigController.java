package com.example.demo.controller;

import com.example.demo.entity.DeleteRecordBaseRequest;
import com.example.demo.entity.UpdateRecordClassBaseRequest;
import com.example.demo.entity.UpdateRecordClassColorRequest;
import com.example.demo.entity.updateRecordRequest;
import com.example.demo.service.ConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;
import java.util.Collections;
import java.util.Map;

//獲取、更新設定檔內容controller
@RestController
@RequestMapping("/config")
public class ConfigController {
    private final ConfigService configService;

    @Autowired
    public ConfigController(ConfigService configService) {
        this.configService = configService;
    }

    //回傳所有紀錄類別詳細資訊
    @GetMapping("/GetAllRecordJson")
    public ResponseEntity<?> GetAllRecordJson() throws FileNotFoundException {
        return ResponseEntity.ok(this.configService.getAllRecordJson());
    }


    //更新特定類別特定content
    @PutMapping("/updateRecord")
    public ResponseEntity<?> updateRecord(@RequestBody Map<String, updateRecordRequest> item) throws FileNotFoundException {
        //獲得欲修改的類別名稱(EX:daily,transportation)
        String className = (String) item.keySet().toArray()[0];
        this.configService.updateRecordClass(className, item.get(className));
        return ResponseEntity.ok(Collections.singletonMap("message", "Update　Success"));
    }

    //更新大類別的color
    @PutMapping("/updateRecordClassColor")
    public ResponseEntity<?> updateRecordClassColor(@RequestBody Map<String, UpdateRecordClassColorRequest> req) {
        //獲得欲修改的類別名稱(EX:daily,transportation)
        String className = (String) req.keySet().toArray()[0];
        this.configService.updateRecordClassColor(className, req.get(className));
        return ResponseEntity.ok(Collections.singletonMap("message", "Update　Success"));

    }

    //更新大類別基準
    @PutMapping("/updateRecordClassBase")
    public ResponseEntity<?> updateRecordClassBase(@RequestBody Map<String, UpdateRecordClassBaseRequest> req) {
        //獲得欲修改的類別名稱(EX:daily,transportation)
        String className = (String) req.keySet().toArray()[0];
        this.configService.updateRecordClassBase(className, req.get(className));
        return ResponseEntity.ok(Collections.singletonMap("message", "Update　Success"));

    }

    //刪除特定content
    @DeleteMapping("/deleteRecordContent")
    public ResponseEntity<?> deleteRecordContent(@RequestParam("index") String index) throws FileNotFoundException {
        this.configService.deleteRecordContent(index);
        return ResponseEntity.ok(Collections.singletonMap("message", "Update　Success"));
    }

    //刪除Base
    @DeleteMapping("/deleteRecordBase")
    public ResponseEntity<?> deleteRecordContent(@RequestBody DeleteRecordBaseRequest req) {
        this.configService.deleteRecordBase(req.getClassName(), req.getTargets());
        return ResponseEntity.ok(Collections.singletonMap("message", "Update　Success"));
    }

    //測試用
    @GetMapping("/test")
    public ResponseEntity<?> test() throws FileNotFoundException {
        return ResponseEntity.ok(this.configService.test());
    }


}
