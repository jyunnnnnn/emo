package com.example.demo.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/*
    使用者減碳紀錄總紀錄次數，存放資料庫用
 */

@Document(collection = "Emo_RecordCounter")
public class UserAchievementEntity {

    @Id
    private String userId;

    //<大類別名稱,紀錄次數>
    private Map<String, Integer> classRecordCounter;

    //<大類別名稱,總減碳量>
    private Map<String, Double> classRecordCarbonCounter;

    //<成就Id,解鎖時間>
    private Map<String, String> achieveTime;

    public UserAchievementEntity() {
        this.classRecordCounter = new HashMap<>();
        this.classRecordCarbonCounter = new HashMap<>();
        this.achieveTime = new HashMap<>();
    }


    public UserAchievementEntity(String userId, Map<String, Integer> classRecordCounter, Map<String, Double> classRecordCarbonCounter, Map<String, String> achieveTime) {
        this.userId = userId;
        this.classRecordCounter = classRecordCounter;
        this.classRecordCarbonCounter = classRecordCarbonCounter;
        this.achieveTime = achieveTime;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Map<String, Integer> getClassRecordCounter() {
        return classRecordCounter;
    }

    public void setClassRecordCounter(Map<String, Integer> classRecordCounter) {
        this.classRecordCounter = classRecordCounter;
    }

    public Map<String, String> getAchieveTime() {
        return achieveTime;
    }

    public void setAchieveTime(Map<String, String> achieveTime) {
        this.achieveTime = achieveTime;
    }

    public Map<String, Double> getClassRecordCarbonCounter() {
        return classRecordCarbonCounter;
    }

    public void setClassRecordCarbonCounter(Map<String, Double> classRecordCarbonCounter) {
        this.classRecordCarbonCounter = classRecordCarbonCounter;
    }

    public static UserAchievementEntity getTestEntity() {
        UserAchievementEntity userAchievementEntity = new UserAchievementEntity();
        Map<String, Double> classRecordCarbonCounter = new HashMap<>();
        classRecordCarbonCounter.put("生活用品", 1.0);
        classRecordCarbonCounter.put("交通", 2.0);
        Map<String, Integer> classRecordCounter = new HashMap<>();
        classRecordCounter.put("生活用品", 1);
        classRecordCounter.put("交通", 3);

        Map<String, String> achieveDate = new HashMap<>();
        achieveDate.put("0001", "test time");

        userAchievementEntity.setUserId("testId");
        userAchievementEntity.setAchieveTime(achieveDate);
        userAchievementEntity.setClassRecordCarbonCounter(classRecordCarbonCounter);
        userAchievementEntity.setClassRecordCounter(classRecordCounter);

        return userAchievementEntity;
    }

    @Override
    public String toString() {
        return "UserAchievementEntity{" +
                "userId='" + userId + '\'' +
                ", classRecordCounter=" + classRecordCounter +
                ", classRecordCarbonCounter=" + classRecordCarbonCounter +
                ", achieveTime=" + achieveTime +
                '}';
    }
}
