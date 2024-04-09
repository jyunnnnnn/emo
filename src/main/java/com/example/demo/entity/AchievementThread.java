package com.example.demo.entity;

import com.example.demo.repository.UserRecordCounterRepository;
import com.example.demo.service.ConfigService;

import java.io.FileNotFoundException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AchievementThread extends Thread {
    private int type;
    private UserAchievement userAchievement;
    private ConfigService configService;

    private List<EcoRecord> records;

    private UserAchievementEntity userAchievementEntity;

    private String userId;
    private Achievement source;

    public AchievementThread(String userId, Achievement source, int type, ConfigService configService, List<EcoRecord> records, UserAchievementEntity userAchievementEntity) {
        this.type = type;
        this.configService = configService;
        this.userAchievementEntity = userAchievementEntity;
        this.records = records;
        this.userId = userId;
        this.source = source;
        this.userAchievement = new UserAchievement(source);
    }

    @Override
    public void run() {
        try {
            if (type == Achievement.DAILY_ACCUMULATION || type == Achievement.TRANS_ACCUMULATION) {
                this.accumulationAchievementsHandler();
            } else if (type == Achievement.DAILY_ALL || type == Achievement.TRANS_ALL) {
                this.specificClassAllKinds();
            } else if (type == Achievement.DAILY_FREQUENCY || type == Achievement.TRANS_FREQUENCY) {
                this.frequencyAchievementsHandler();
            } else if (type == Achievement.DAILY_AND_TRANS_ALL) {
                this.allKinds();
            } else if (type == Achievement.RECORD_ALL) {
                this.totalNumberOfRecord();
            }
        } catch (Exception err) {
            err.printStackTrace();
        }

    }

    //總紀錄數量
    private void totalNumberOfRecord() {


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

        //是否達成過了且經過CRUD後仍然達成
        if (total >= source.getTarget() && isAccomplished(source.getAchievementId())) {
            userAchievement.setFirstAccomplish(false);
            userAchievement.setAccomplishTime(userAchievementEntity.getAchieveTime().get(source.getAchievementId()));
            userAchievement.setAchieve(true);
            return;
        }

        /*
            第一次達成 或 未達成(有可能之前達成過但經過CRUD後變成未達成狀態)
         */

        //若第一次達成成就條件
        if (total >= source.getTarget()) {
            //使用者第一次完成此成就
            userAchievement.setAchieve(true);


            //設定為第一次完成以及初次達成時間(前端判斷用)
            userAchievement.setFirstAccomplish(true);


            //  直接格式化輸出現在時間的方法

            String accomplishDate = generateCurrentDateAndTimeInStr();

            userAchievement.setAccomplishTime(accomplishDate);
            userAchievement.setFirstAccomplish(true);
            userAchievementEntity.getAchieveTime().put(source.getAchievementId(), accomplishDate);
        } else {
            //未達成成就且也沒達成過
            userAchievement.setAchieve(false);
            userAchievement.setAccomplishTime(null);
            userAchievement.setFirstAccomplish(false);

            //重新設定使用者成就資料庫物件
            if (userAchievementEntity.getAchieveTime().containsKey(source.getAchievementId())) {
                //移除之前達成時間
                userAchievementEntity.getAchieveTime().remove(source.getAchievementId());
            }

        }


    }

    //全部種類項目是否都記錄過(包含交通、日常用品)
    private void allKinds() {

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

        userAchievement.setCurrent(cnt >= szOfContents ? 1 : 0);

        //是否已達成
        if (cnt >= szOfContents && isAccomplished(source.getAchievementId())) {
            userAchievement.setAccomplishTime(userAchievementEntity.getAchieveTime().get(source.getAchievementId()));
            userAchievement.setAchieve(true);
            userAchievement.setFirstAccomplish(false);
            return;
        }


        /*
            第一次達成 或 未達成(有可能之前達成過但經過CRUD後變成未達成狀態)
         */

        //使用者第一次達成
        if (cnt >= szOfContents) {
            //設定使用者達成狀態
            //設置已達成
            userAchievement.setAchieve(true);
            //  直接格式化輸出現在時間的方法

            String accomplishDate = generateCurrentDateAndTimeInStr();

            userAchievement.setAccomplishTime(accomplishDate);
            userAchievement.setFirstAccomplish(true);
            userAchievementEntity.getAchieveTime().put(source.getAchievementId(), accomplishDate);

        } else {
            //未達成成就
            userAchievement.setAchieve(false);
            userAchievement.setAccomplishTime(null);
            userAchievement.setFirstAccomplish(false);

            //重新設定使用者成就資料庫物件
            if (userAchievementEntity.getAchieveTime().containsKey(source.getAchievementId())) {
                //移除之前達成時間
                userAchievementEntity.getAchieveTime().remove(source.getAchievementId());
            }
        }


    }


    //特定大類別紀錄所有種類紀錄
    private void specificClassAllKinds() {


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
        if (cnt >= szOfContents && isAccomplished(source.getAchievementId())) {

            userAchievement.setFirstAccomplish(false);
            userAchievement.setAccomplishTime(userAchievementEntity.getAchieveTime().get(source.getAchievementId()));
            userAchievement.setCurrent(1);
            userAchievement.setAchieve(true);

            return;
        }

        /*
            第一次達成 或 未達成(有可能之前達成過但經過CRUD後變成未達成狀態)
         */

        if (cnt >= szOfContents) {

            //使用者第一次達成
            userAchievement.setAchieve(true);

            //  直接格式化輸出現在時間的方法

            String accomplishDate = generateCurrentDateAndTimeInStr();

            userAchievement.setAccomplishTime(accomplishDate);
            userAchievement.setFirstAccomplish(true);
            userAchievementEntity.getAchieveTime().put(source.getAchievementId(), accomplishDate);

        } else {
            //未達成成就
            userAchievement.setAchieve(false);
            userAchievement.setAccomplishTime(null);
            userAchievement.setFirstAccomplish(false);

            //重新設定使用者成就資料庫物件
            if (userAchievementEntity.getAchieveTime().containsKey(source.getAchievementId())) {
                //移除之前達成時間
                userAchievementEntity.getAchieveTime().remove(source.getAchievementId());
            }
        }


    }

    //處理某類別紀錄次數相關成就
    private void frequencyAchievementsHandler() {


        //目標類別名稱
        String className = source.getType() == Achievement.DAILY_FREQUENCY ? "生活用品" : "交通";

        int cnt = 0;
        if (userAchievementEntity.getClassRecordCounter().containsKey(className))
            cnt = userAchievementEntity.getClassRecordCounter().get(className);

        //設定已達成狀態
        userAchievement.setCurrent(cnt);


        //是否已達成且仍然達成
        if (cnt >= source.getTarget() && isAccomplished(source.getAchievementId())) {
            userAchievement.setAchieve(true);
            userAchievement.setAccomplishTime(userAchievementEntity.getAchieveTime().get(source.getAchievementId()));
            userAchievement.setCurrent(userAchievementEntity.getClassRecordCounter().get(className));
            userAchievement.setFirstAccomplish(false);
            return;
        }

        /*
            第一次達成 或 未達成(有可能之前達成過但經過CRUD後變成未達成狀態)
         */


        //判斷使否達成成就條件
        if (cnt >= source.getTarget()) {
            //成就解鎖
            userAchievement.setAchieve(true);

            //  直接格式化輸出現在時間的方法

            String accomplishDate = generateCurrentDateAndTimeInStr();

            userAchievement.setAccomplishTime(accomplishDate);
            userAchievement.setFirstAccomplish(true);
            userAchievementEntity.getAchieveTime().put(source.getAchievementId(), accomplishDate);

        } else {
            //未達成成就
            userAchievement.setAchieve(false);
            userAchievement.setAccomplishTime(null);
            userAchievement.setFirstAccomplish(false);

            //重新設定使用者成就資料庫物件
            if (userAchievementEntity.getAchieveTime().containsKey(source.getAchievementId())) {
                //移除之前達成時間
                userAchievementEntity.getAchieveTime().remove(source.getAchievementId());
            }
        }


    }

    //處理累積量相關成就
    private void accumulationAchievementsHandler() throws FileNotFoundException {


        //目標類別名稱
        String className = source.getType() == Achievement.DAILY_ACCUMULATION ? "生活用品" : "交通";


        //總累積量
        double sum = 0.0;
        if (userAchievementEntity.getClassRecordCarbonCounter().containsKey(className))
            sum = userAchievementEntity.getClassRecordCarbonCounter().get(className);

        //設定已達成狀態
        userAchievement.setCurrent(sum);


        //是否已達成
        if (sum >= source.getTarget() && isAccomplished(source.getAchievementId())) {
            userAchievement.setAccomplishTime(userAchievementEntity.getAchieveTime().get(source.getAchievementId()));
            userAchievement.setFirstAccomplish(false);
            userAchievement.setCurrent(userAchievementEntity.getClassRecordCarbonCounter().get(className));
            userAchievement.setAchieve(true);
            return;
        }

        /*
            第一次達成 或 未達成(有可能之前達成過但經過CRUD後變成未達成狀態)
         */

        //判斷使否達成成就條件
        if (sum >= source.getTarget()) {
            //成就解鎖
            userAchievement.setAchieve(true);

            //  直接格式化輸出現在時間的方法

            String accomplishDate = generateCurrentDateAndTimeInStr();

            userAchievement.setAccomplishTime(accomplishDate);
            userAchievement.setFirstAccomplish(true);
            userAchievementEntity.getAchieveTime().put(source.getAchievementId(), accomplishDate);


        } else {
            //未達成成就
            userAchievement.setAchieve(false);
            userAchievement.setAccomplishTime(null);
            userAchievement.setFirstAccomplish(false);

            //重新設定使用者成就資料庫物件
            if (userAchievementEntity.getAchieveTime().containsKey(source.getAchievementId())) {
                //移除之前達成時間
                userAchievementEntity.getAchieveTime().remove(source.getAchievementId());
            }
        }


    }

    //產生當前時間字串
    private String generateCurrentDateAndTimeInStr() {
        //  直接格式化輸出現在時間的方法
        SimpleDateFormat sdFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String accomplishDate = sdFormat.format(new Date());
        return accomplishDate;
    }

    //判斷是否已達成某成就
    private boolean isAccomplished(String acId) {
        if (userAchievementEntity.getAchieveTime() == null)
            return false;
        return userAchievementEntity.getAchieveTime().containsKey(acId);
    }

    public UserAchievement getUserAchievement() {
        return this.userAchievement;
    }
}
