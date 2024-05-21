package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.AchievementRepository;
import com.example.demo.repository.RecordRepository;
import com.example.demo.repository.UserRecordCounterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.util.*;

@Service
public class AchievementService {

    //成就資料庫
    @Autowired
    private AchievementRepository repository;
    @Autowired
    private ConfigService configService;

    //減碳紀錄資料庫
    @Autowired
    private RecordRepository recordRepository;

    @Autowired
    private UserRecordCounterRepository userRecordCounterRepository;

    //所有成就物件
    private List<Achievement> allAchievements;

    public static int OK = 1;
    public static int BAD = 0;


    @Autowired
    public AchievementService(AchievementRepository repository, RecordRepository recordRepository, ConfigService configService, UserRecordCounterRepository userRecordCounterRepository) {
        this.repository = repository;
        this.recordRepository = recordRepository;
        this.configService = configService;
        this.userRecordCounterRepository = userRecordCounterRepository;
        allAchievements=this.repository.findAll();
    }


    public AchievementService() throws FileNotFoundException {
    }

    //增加新成就到資料庫中
    public Achievement addAchievement(Achievement achievement) {
        return this.repository.save(achievement);
    }

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


    //處理使用者的成就達成狀態並回傳一個成就LIST，裡面包含成就相關資訊以及使用者達成狀態
    public List<UserAchievement> userAchievementsHandler(String userId) throws FileNotFoundException, InterruptedException {



        //預先獲取該使用者的所有紀錄
        List<EcoRecord> records = this.recordRepository.findAllByUserId(userId);

        //預先獲取該使用者的紀錄相關資訊
        UserAchievementEntity userAchievementEntity = this.userRecordCounterRepository.findByUserId(userId);


        //該使用者的所有成就達成狀況
        List<UserAchievement> result = new ArrayList<>();

        //多執行緒計算
        AchievementThread myThreads[] = new AchievementThread[allAchievements.size()];
        int idx = 0;
        for (Achievement achievement : allAchievements) {
            myThreads[idx] = new AchievementThread(userId, achievement, achievement.getType(), configService, records, userAchievementEntity);
            myThreads[idx].start();
            idx += 1;
        }

        for (int i = 0; i < myThreads.length; i++) {
            myThreads[i].join();
            result.add(myThreads[i].getUserAchievement());
        }


        //Threads跑完之後 將最後的使用者成就物件覆蓋到資料庫內(java pass by reference)
        this.userRecordCounterRepository.save(userAchievementEntity);


        return result;
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
