package com.example.demo.controller;

import com.example.demo.entity.Achievement;
import com.example.demo.entity.EcoRecord;
import com.example.demo.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/AC")
public class AchievementController {
    private final AchievementService achievementService;
    @Autowired
    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }
    @PostMapping("/addAchievement")
    public ResponseEntity<?> addAchievement(@RequestBody Achievement achievement) {
        try {
            this.achievementService.addAchievement(achievement);
            System.out.println(achievement);
        } catch (Exception err) {
            System.err.println(err + " 使用者新增成就過程出現錯誤");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok("achievement added successfully");
    }
    @PutMapping("/updateAchievement")
    public ResponseEntity<?> updateAchievement(@RequestBody Achievement achievement) {
        //是否正常更新
        try {
            this.achievementService.updateRecord(achievement);
        } catch (Exception err) {
            System.err.println(err + " 使用者更新成就過程出現錯誤");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok("achievement updated successfully");
    }
    @GetMapping("/getAllAchievement")
    public ResponseEntity<?> getAllRecords() {
        try {
            List<Achievement> Achievements = this.achievementService.getAllAchievement();
            return ResponseEntity.ok(Achievements);
        } catch (Exception err) {
            System.err.println(err + " 抓取所有成就過程出現錯誤");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    @DeleteMapping("/deleteOneRecord")
    public ResponseEntity<?> deleteOneRecord(@RequestParam("AchievementId") String AchievementId) {
        try {
            this.achievementService.deleteOneAchievement(AchievementId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception err) {
            System.err.println("刪除" + AchievementId + "成就過程出現問題");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }
}
