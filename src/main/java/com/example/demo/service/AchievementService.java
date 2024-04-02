package com.example.demo.service;

import com.example.demo.entity.Achievement;
import com.example.demo.entity.EcoRecord;
import com.example.demo.repository.AchievementRepository;
import com.example.demo.repository.RecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.Map;

@Service
public class AchievementService {
    private AchievementRepository repository = null;

    //減碳紀錄資料庫
    private RecordRepository recordRepository;

    @Autowired
    public static int OK = 1;
    public static int BAD = 0;

    @Autowired
    public AchievementService(AchievementRepository repository, RecordRepository recordRepository) {
        this.repository = repository;
        this.recordRepository = recordRepository;

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
    public List<Achievement> userAchievementsHandler(String userId) {
        //獲取所有成就
        List<Achievement> allAchievements = this.getAllAchievement();

        List<Achievement> result = null;
        for (Achievement achievement : allAchievements) {

            switch (achievement.getType()) {
                //處理日常生活紀錄紀錄次數
                case Achievement.DAILY_FREQUENCY:
                    result.add(frequencyAchievementsHandler(userId, achievement));
                    break;
                case Achievement.DAILY_ACCUMULATION:
                    break;
                //處理交通紀錄紀錄次數
                case Achievement.TRANS_FREQUENCY:
                    result.add(frequencyAchievementsHandler(userId, achievement));
                    break;
                case Achievement.TRANS_ACCUMULATION:
                    break;
                case Achievement.DAILY_ALL:
                    break;
                case Achievement.TRANS_ALL:
                    break;
                case Achievement.RECORD_ALL:
                    break;
                case Achievement.DAILY_AND_TRANS_ALL:
                    break;

            }

        }
        return null;
    }

    //處理某類別紀錄次數相關成就
    Achievement frequencyAchievementsHandler(String userId, Achievement source) {
        //目標類別名稱
        String className = source.getType() == Achievement.DAILY_FREQUENCY ? "生活用品" : "交通";


        //找到該使用者的所有紀錄
        List<EcoRecord> userRecords = this.recordRepository.findAllByUserId(userId);

        int cnt = 0;
        //計算該使用者紀錄某大類別的紀錄數量
        for (EcoRecord record : userRecords) {
            //此紀錄項目屬於目標大類別的項目
            if (record.getClassType().equals(className)) {
                cnt++;
            }
        }
        //判斷使否達成成就條件
        if (cnt >= source.getTarget()) {
            //成就解鎖
            source.setAchieve(true);
            //設定已達成狀態
            source.setCurrent(cnt);
        }
        return source;
    }

    //處理累積量相關成就
    public Achievement accumulationAchievementsHandler(String userId, Achievement source) throws FileNotFoundException {
        ConfigService configService = new ConfigService();

        //獲取減碳紀錄大類別設定檔
        Map<String, RecordWrapper> configuration = configService.getRecordConfigurationObj();

        return null;
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
