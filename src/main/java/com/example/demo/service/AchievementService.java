package com.example.demo.service;

import com.example.demo.entity.Achievement;
import com.example.demo.entity.EcoRecord;
import com.example.demo.entity.UserAchievement;
import com.example.demo.entity.UserAchievementEntity;
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


    public static int OK = 1;
    public static int BAD = 0;

    public static final int FREQUENCY = 0;
    public static final int ACCUMULATION = 1;

    public static final int OTHER = 2;

    @Autowired
    public AchievementService(AchievementRepository repository, RecordRepository recordRepository, ConfigService configService, UserRecordCounterRepository userRecordCounterRepository) {
        this.repository = repository;
        this.recordRepository = recordRepository;
        this.configService = configService;
        this.userRecordCounterRepository = userRecordCounterRepository;
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
    public List<UserAchievement> userAchievementsHandler(String userId) throws FileNotFoundException {
        //獲取所有成就
        List<Achievement> allAchievements = this.getAllAchievement();

        //預先獲取該使用者的所有紀錄
        List<EcoRecord> records = this.recordRepository.findAllByUserId(userId);

        //預先獲取該使用者的紀錄相關資訊
        UserAchievementEntity userAchievementEntity = this.userRecordCounterRepository.findByUserId(userId);

        //該使用者的所有成就達成狀況
        List<UserAchievement> result = new ArrayList<>();

        for (Achievement achievement : allAchievements) {

            switch (achievement.getType()) {
                //處理日常生活紀錄紀錄次數
                case Achievement.DAILY_FREQUENCY:
                    result.add(frequencyAchievementsHandler(userId, achievement, userAchievementEntity));
                    break;
                case Achievement.DAILY_ACCUMULATION:
                    result.add(accumulationAchievementsHandler(userId, achievement, userAchievementEntity));
                    break;
                //處理交通紀錄紀錄次數
                case Achievement.TRANS_FREQUENCY:
                    result.add(frequencyAchievementsHandler(userId, achievement, userAchievementEntity));
                    break;
                case Achievement.TRANS_ACCUMULATION:
                    result.add(accumulationAchievementsHandler(userId, achievement, userAchievementEntity));
                    break;
                case Achievement.DAILY_ALL:
                    result.add(specificClassAllKinds(userId, achievement, records, userAchievementEntity));
                    break;
                case Achievement.TRANS_ALL:
                    result.add(specificClassAllKinds(userId, achievement, records, userAchievementEntity));
                    break;
                case Achievement.RECORD_ALL:
                    result.add(totalNumberOfRecord(userId, achievement, userAchievementEntity));
                    break;
                case Achievement.DAILY_AND_TRANS_ALL:
                    result.add(allKinds(userId, achievement, records, userAchievementEntity));
                    break;

            }

        }

        return result;
    }

    //總紀錄數量
    private UserAchievement totalNumberOfRecord(String userId, Achievement source, UserAchievementEntity userAchievementEntity) {

        long time1 = System.currentTimeMillis();

        UserAchievement userAchievement = new UserAchievement(source);

        //獲取該使用者所有紀錄次數
        int total = 0;
        if (userAchievementEntity.getClassRecordCounter().get("生活用品") != null) {
            total += userAchievementEntity.getClassRecordCounter().get("生活用品");
        }

        if (userAchievementEntity.getClassRecordCounter().get("交通") != null) {
            total += userAchievementEntity.getClassRecordCounter().get("交通");
        }

        //設定使用者完成次數
        userAchievement.setCurrent(total);

        //是否達成過了且(可能)經過CRUD後仍然達成
        if (total >= source.getTarget() && isAccomplished(source.getAchievementId(), userAchievementEntity)) {
            userAchievement.setFirstAccomplish(false);
            userAchievement.setAccomplishTime(userAchievementEntity.getAchieveTime().get(source.getAchievementId()));
            userAchievement.setAchieve(true);
            return userAchievement;
        }

        /*
            第一次達成 或 未達成(有可能之前達成過但經過CRUD後變成未達成狀態)
         */

        //若第一次達成成就條件
        if (total >= source.getTarget()) {

            userAchievement.setAchieve(true);
            //使用者第一次完成此成就

            //設定為第一次完成以及初次達成時間(前端判斷用)
            userAchievement.setFirstAccomplish(true);

            Date accomplishDate = new Date();
            userAchievement.setAccomplishTime(accomplishDate);

            //設置完成時間並存到資料庫內
            userAchievementEntity.getAchieveTime().put(source.getAchievementId(), accomplishDate);
        } else {
            //未達成成就
            userAchievement.setAchieve(false);
            userAchievement.setAccomplishTime(null);
            userAchievement.setFirstAccomplish(false);

            //重新設定使用者成就資料庫物件
            if (userAchievementEntity.getAchieveTime().containsKey(source.getAchievementId()))
                //移除之前達成時間
                userAchievementEntity.getAchieveTime().remove(source.getAchievementId());
        }

        //覆蓋使用者成就資料庫資訊
        this.userRecordCounterRepository.save(userAchievementEntity);
        long time2 = System.currentTimeMillis();

        System.out.println("totalNumberOfRecord花了:" + (time2 - time1) + "毫秒");
        return userAchievement;
    }

    //全部種類項目是否都記錄過(包含交通、日常用品)
    private UserAchievement allKinds(String userId, Achievement source, List<EcoRecord> records, UserAchievementEntity userAchievementEntity) {
        long time1 = System.currentTimeMillis();
        UserAchievement userAchievement = new UserAchievement(source);
                /*
            判斷使用者是否達成
         */

        //獲取所有紀錄種類數量
        int szOfContents = configService.getRecordConfigurationObj().get("daily").getContent().size() + configService.getRecordConfigurationObj().get("transportation").getContent().size();


        //紀錄已計算過的種類
        Map<String, Boolean> vis = new HashMap<>();


        //使用者紀錄的種類數量
        int cnt = 0;
        for (EcoRecord record : records) {

            if (!vis.containsKey(record.getType())) {
                vis.put(record.getType(), true);
                cnt++;
            }
        }

        //是否已達成
        if (cnt >= szOfContents && isAccomplished(source.getAchievementId(), userAchievementEntity)) {
            userAchievement.setAccomplishTime(userAchievementEntity.getAchieveTime().get(source.getAchievementId()));
            userAchievement.setCurrent(1);
            userAchievement.setAchieve(true);
            userAchievement.setFirstAccomplish(false);
            return userAchievement;
        }


        /*
            第一次達成 或 未達成(有可能之前達成過但經過CRUD後變成未達成狀態)
         */

        //使用者第一次達成
        if (cnt >= szOfContents) {
            //設定使用者達成狀態
            userAchievement.setCurrent(1);
            //設置已達成
            userAchievement.setAchieve(true);
            Date accomplishDate = new Date();
            //設置達成時間並覆蓋資料庫內容
            userAchievement.setAccomplishTime(accomplishDate);
            userAchievement.setFirstAccomplish(true);
            userAchievementEntity.getAchieveTime().put(source.getAchievementId(), accomplishDate);

        } else {
            //未達成成就
            userAchievement.setAchieve(false);
            userAchievement.setAccomplishTime(null);
            userAchievement.setFirstAccomplish(false);

            //重新設定使用者成就資料庫物件
            if (userAchievementEntity.getAchieveTime().containsKey(source.getAchievementId()))
                //移除之前達成時間
                userAchievementEntity.getAchieveTime().remove(source.getAchievementId());
        }

        //覆蓋使用者成就資料庫資訊
        this.userRecordCounterRepository.save(userAchievementEntity);

        long time2 = System.currentTimeMillis();
        System.out.println("allKinds: " + (time2 - time1) + "毫秒");
        return userAchievement;
    }


    //特定大類別紀錄所有種類紀錄
    private UserAchievement specificClassAllKinds(String userId, Achievement source, List<EcoRecord> records, UserAchievementEntity userAchievementEntity) {

        long time1 = System.currentTimeMillis();
        UserAchievement userAchievement = new UserAchievement(source);

        //目標類別名稱
        String className = source.getType() == Achievement.DAILY_ALL ? "生活用品" : "交通";
        String engClassname = className.equals("生活用品") ? "daily" : "transportation";

        //獲取特定大類別的所有紀錄種類(EX:所有日常用品的紀錄種類)
        int szOfContents = configService.getRecordConfigurationObj().get(engClassname).getContent().size();


        //紀錄已計算過的種類
        Map<String, Boolean> vis = new HashMap<>();

        //使用者紀錄的種類數量
        int cnt = 0;
        for (EcoRecord record : records) {
            //找到目標大類別紀錄
            if (record.getClassType().equals(className)) {
                if (!vis.containsKey(record.getType())) {
                    vis.put(record.getType(), true);
                    cnt++;
                }
            }
        }


        //設定使用者達成狀態
        userAchievement.setCurrent(cnt >= szOfContents ? 1 : 0);

        //是否已達成
        if (cnt >= szOfContents && isAccomplished(source.getAchievementId(), userAchievementEntity)) {

            userAchievement.setFirstAccomplish(false);
            userAchievement.setAccomplishTime(userAchievementEntity.getAchieveTime().get(source.getAchievementId()));
            userAchievement.setCurrent(1);
            userAchievement.setAchieve(true);

            return userAchievement;
        }

        /*
            第一次達成 或 未達成(有可能之前達成過但經過CRUD後變成未達成狀態)
         */

        if (cnt >= szOfContents) {

            //使用者第一次達成
            userAchievement.setAchieve(true);

            //設置達成時間並覆蓋資料庫
            Date accomplishDate = new Date();
            userAchievement.setAccomplishTime(accomplishDate);
            userAchievement.setFirstAccomplish(true);

            userAchievementEntity.getAchieveTime().put(source.getAchievementId(), accomplishDate);

        } else {
            //未達成成就
            userAchievement.setAchieve(false);
            userAchievement.setAccomplishTime(null);
            userAchievement.setFirstAccomplish(false);

            //重新設定使用者成就資料庫物件
            if (userAchievementEntity.getAchieveTime().containsKey(source.getAchievementId()))
                //移除之前達成時間
                userAchievementEntity.getAchieveTime().remove(source.getAchievementId());
        }

        //覆蓋使用者成就資料庫資訊
        this.userRecordCounterRepository.save(userAchievementEntity);
        long time2 = System.currentTimeMillis();
        System.out.println("specificClassAllKinds: " + (time2 - time1) + "毫秒");
        return userAchievement;
    }

    //處理某類別紀錄次數相關成就
    private UserAchievement frequencyAchievementsHandler(String userId, Achievement source, UserAchievementEntity userAchievementEntity) {

        UserAchievement userAchievement = new UserAchievement(source);
        long time1 = System.currentTimeMillis();

        //目標類別名稱
        String className = source.getType() == Achievement.DAILY_FREQUENCY ? "生活用品" : "交通";

        int cnt = 0;
        if (userAchievementEntity.getClassRecordCounter().containsKey(className))
            cnt = userAchievementEntity.getClassRecordCounter().get(className);

        //設定已達成狀態
        userAchievement.setCurrent(cnt);


        //是否已達成且仍然達成
        if (cnt >= source.getTarget() && isAccomplished(source.getAchievementId(), userAchievementEntity)) {
            userAchievement.setAchieve(true);
            userAchievement.setAccomplishTime(userAchievementEntity.getAchieveTime().get(source.getAchievementId()));
            userAchievement.setCurrent(userAchievementEntity.getClassRecordCounter().get(className));
            userAchievement.setFirstAccomplish(false);
            return userAchievement;
        }

        /*
            第一次達成 或 未達成(有可能之前達成過但經過CRUD後變成未達成狀態)
         */


        //判斷使否達成成就條件
        if (cnt >= source.getTarget()) {
            //成就解鎖
            userAchievement.setAchieve(true);

            //設置達成時間並覆蓋資料庫
            Date accomplishDate = new Date();
            userAchievement.setAccomplishTime(accomplishDate);
            userAchievement.setFirstAccomplish(true);

            userAchievementEntity.getAchieveTime().put(source.getAchievementId(), accomplishDate);

        } else {
            //未達成成就
            userAchievement.setAchieve(false);
            userAchievement.setAccomplishTime(null);
            userAchievement.setFirstAccomplish(false);

            //重新設定使用者成就資料庫物件
            if (userAchievementEntity.getAchieveTime().containsKey(source.getAchievementId()))
                //移除之前達成時間
                userAchievementEntity.getAchieveTime().remove(source.getAchievementId());
        }

        //覆蓋使用者成就資料庫資訊
        this.userRecordCounterRepository.save(userAchievementEntity);
        long time2 = System.currentTimeMillis();
        System.out.println("frequencyAchievementsHandler: " + (time2 - time1) + "毫秒");
        return userAchievement;
    }

    //處理累積量相關成就
    private UserAchievement accumulationAchievementsHandler(String userId, Achievement source, UserAchievementEntity userAchievementEntity) throws FileNotFoundException {
        long time1 = System.currentTimeMillis();

        UserAchievement userAchievement = new UserAchievement(source);
        //目標類別名稱
        String className = source.getType() == Achievement.DAILY_ACCUMULATION ? "生活用品" : "交通";


        //總累積量
        double sum = 0.0;
        if (userAchievementEntity.getClassRecordCarbonCounter().containsKey(className))
            sum = userAchievementEntity.getClassRecordCarbonCounter().get(className);

        //設定已達成狀態
        userAchievement.setCurrent(sum);


        //是否已達成
        if (sum >= source.getTarget() && isAccomplished(source.getAchievementId(), userAchievementEntity)) {
            userAchievement.setAccomplishTime(userAchievementEntity.getAchieveTime().get(source.getAchievementId()));
            userAchievement.setFirstAccomplish(false);
            userAchievement.setCurrent(userAchievementEntity.getClassRecordCarbonCounter().get(className));
            userAchievement.setAchieve(true);
            return userAchievement;
        }

        /*
            第一次達成 或 未達成(有可能之前達成過但經過CRUD後變成未達成狀態)
         */

        //判斷使否達成成就條件
        if (sum >= source.getTarget()) {
            //成就解鎖
            userAchievement.setAchieve(true);

            //設置達成時間並覆蓋資料庫
            Date accomplishDate = new Date();
            userAchievement.setAccomplishTime(accomplishDate);
            userAchievement.setFirstAccomplish(true);

            userAchievementEntity.getAchieveTime().put(source.getAchievementId(), accomplishDate);


        } else {
            //未達成成就
            userAchievement.setAchieve(false);
            userAchievement.setAccomplishTime(null);
            userAchievement.setFirstAccomplish(false);

            //重新設定使用者成就資料庫物件
            if (userAchievementEntity.getAchieveTime().containsKey(source.getAchievementId()))
                //移除之前達成時間
                userAchievementEntity.getAchieveTime().remove(source.getAchievementId());
        }

        //覆蓋使用者成就資料庫資訊
        this.userRecordCounterRepository.save(userAchievementEntity);
        long time2 = System.currentTimeMillis();
        System.out.println("accumulationAchievementsHandler: " + (time2 - time1) + "毫秒");
        return userAchievement;
    }

    //判斷是否已達成某成就
    private boolean isAccomplished(String acId, UserAchievementEntity userAchievementEntity) {
        if (userAchievementEntity.getAchieveTime() == null)
            return false;
        return userAchievementEntity.getAchieveTime().containsKey(acId);
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
