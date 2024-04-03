package com.example.demo.service;

import com.example.demo.entity.Achievement;
import com.example.demo.entity.EcoRecord;
import com.example.demo.repository.AchievementRepository;
import com.example.demo.repository.RecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public static int OK = 1;
    public static int BAD = 0;

    @Autowired
    public AchievementService(AchievementRepository repository, RecordRepository recordRepository, ConfigService configService) {
        this.repository = repository;
        this.recordRepository = recordRepository;
        this.configService = configService;

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
    public List<Achievement> userAchievementsHandler(String userId) throws FileNotFoundException {
        //獲取所有成就
        List<Achievement> allAchievements = this.getAllAchievement();

        //預先獲取該使用者的所有紀錄
        List<EcoRecord> records = this.recordRepository.findAllByUserId(userId);

        //該使用者的所有成就達成狀況
        List<Achievement> result = new ArrayList<>();
        for (Achievement achievement : allAchievements) {

            switch (achievement.getType()) {
                //處理日常生活紀錄紀錄次數
                case Achievement.DAILY_FREQUENCY:
                    result.add(frequencyAchievementsHandler(userId, achievement, records));
                    break;
                case Achievement.DAILY_ACCUMULATION:
                    result.add(accumulationAchievementsHandler(userId, achievement, records));
                    break;
                //處理交通紀錄紀錄次數
                case Achievement.TRANS_FREQUENCY:
                    result.add(frequencyAchievementsHandler(userId, achievement, records));
                    break;
                case Achievement.TRANS_ACCUMULATION:
                    result.add(accumulationAchievementsHandler(userId, achievement, records));
                    break;
                case Achievement.DAILY_ALL:
                    result.add(specificClassAllKinds(userId, achievement, records));
                    break;
                case Achievement.TRANS_ALL:
                    result.add(specificClassAllKinds(userId, achievement, records));
                    break;
                case Achievement.RECORD_ALL:
                    result.add(totalNumberOfRecord(userId, achievement, records));
                    break;
                case Achievement.DAILY_AND_TRANS_ALL:
                    result.add(allKinds(userId, achievement, records));
                    break;

            }

        }


        return result;
    }

    //總紀錄數量
    private Achievement totalNumberOfRecord(String userId, Achievement source, List<EcoRecord> records) {


        source.setCurrent(records.size());
        if (records.size() >= source.getTarget()) {
            source.setAchieve(true);
        }
        return source;
    }

    //全部種類項目是否都記錄過(包含交通、日常用品)
    private Achievement allKinds(String userId, Achievement source, List<EcoRecord> records) {

        //獲取所有紀錄種類數量
        int szOfContents = configService.getRecordConfigurationObj().get("daily").getContent().size() +
                configService.getRecordConfigurationObj().get("transportation").getContent().size();


        //紀錄已計算過的種類
        Map<String, Boolean> vis = new HashMap<>();


        //使用者紀錄的種類數量
        int cnt = 0;
        for (EcoRecord record : records) {

            if (!vis.containsKey(record.getClassType())) {
                vis.put(record.getClassType(), true);
                cnt++;
            }
        }

        //設定使用者達成狀態
        source.setCurrent(cnt >= szOfContents ? 1 : 0);
        if (cnt >= szOfContents) {
            source.setAchieve(true);
        }

        return source;
    }

    private Achievement specificClassAllKinds(String userId, Achievement source, List<EcoRecord> records) {
        //目標類別名稱
        String className = source.getType() == Achievement.DAILY_ALL ? "生活用品" : "交通";
        String engClassname = className == "生活用品" ? "daily" : "transportation";

        //獲取特定大類別的所有紀錄種類(EX:所有日常用品的紀錄種類)
        int szOfContents = configService.getRecordConfigurationObj().get(engClassname).getContent().size();


        //紀錄已計算過的種類
        Map<String, Boolean> vis = new HashMap<>();

        //使用者紀錄的種類數量
        int cnt = 0;
        for (EcoRecord record : records) {

            //找到目標大類別紀錄
            if (className != record.getClassType())
                continue;

            if (!vis.get(record.getClassType())) {
                vis.put(record.getClassType(), true);
                cnt++;
            }
        }

        //設定使用者達成狀態
        source.setCurrent(cnt >= szOfContents ? 1 : 0);
        if (cnt >= szOfContents) {
            source.setAchieve(true);
        }

        return source;
    }

    //處理某類別紀錄次數相關成就
    private Achievement frequencyAchievementsHandler(String userId, Achievement source, List<EcoRecord> records) {
        //目標類別名稱
        String className = source.getType() == Achievement.DAILY_FREQUENCY ? "生活用品" : "交通";


        int cnt = 0;

        for (EcoRecord record : records) {
            if (record.getClassType().equals(className))
                cnt++;
        }
        //設定已達成狀態
        source.setCurrent(cnt);

        //判斷使否達成成就條件
        if (cnt >= source.getTarget()) {
            //成就解鎖
            source.setAchieve(true);

        }
        return source;
    }

    //處理累積量相關成就
    private Achievement accumulationAchievementsHandler(String userId, Achievement source, List<EcoRecord> records) throws FileNotFoundException {

        //目標類別名稱
        String className = source.getType() == Achievement.DAILY_ACCUMULATION ? "生活用品" : "交通";

        //獲取減碳紀錄大類別設定檔
        Map<String, RecordWrapper> configuration = configService.getRecordConfigurationObj();


        //總累積量
        double sum = 0.0;

        //找出該使用者的目標類別紀錄(EX:找出日常生活相關紀錄)
        for (EcoRecord record : records) {
            if (record.getClassType().equals(className))
                //累積符合條件的碳足跡紀錄
                //ps:可能需要根據單位調整數值
                sum += record.getFootprint();

        }

        //設定已達成狀態
        source.setCurrent(sum);

        //判斷使否達成成就條件
        if (sum >= source.getTarget()) {
            //成就解鎖
            source.setAchieve(true);

        }

        return source;
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
