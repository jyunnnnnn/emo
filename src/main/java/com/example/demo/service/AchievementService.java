package com.example.demo.service;

import com.example.demo.entity.Achievement;
import com.example.demo.repository.AchievementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class AchievementService {
    private AchievementRepository repository = null;

    public static int OK = 1;
    public static int BAD = 0;

    @Autowired
    public AchievementService(AchievementRepository repository) {
        this.repository = repository;
    }

    public AchievementService() {
    }

    //增加新成就到資料庫中
    public Achievement addAchievement(Achievement achievement) {return this.repository.save(achievement);}

    //修改成就
    public Achievement updateRecord(Achievement newAchievement) {
        return this.repository.save(newAchievement);
    }

    //刪除特定一個成就
    public void deleteOneAchievement(String AchievementId) {
        this.repository.deleteByAchievementId(AchievementId);
    }

    //抓取所有成就
    public List<Achievement> getAllAchievement() {
        return this.repository.findAll();
    }

    //刪除所有成就
    public int deleteAllAchievementId() {
        try {
            this.repository.deleteAll();
        } catch (Exception err) {
            System.err.println(err + " 刪除所有紀錄過程出現問題");
            return BAD;
        }
        return OK;
    }
}
