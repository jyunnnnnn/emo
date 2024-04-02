package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "Emo_Achievement")
public class Achievement {

    public static final int DAILY_FREQUENCY = 0;//生活用品紀錄次數
    public static final int TRANS_FREQUENCY = 1;//交通紀錄次數
    public static final int DAILY_ACCUMULATION = 2;//日常用品減碳量累積
    public static final int TRANS_ACCUMULATION = 3;//交通減碳量累積

    public static final int DAILY_ALL = 4;//記錄所有生活用品至少一次
    public static final int TRANS_ALL = 5;//記錄所有交通至少一次

    public static final int RECORD_ALL = 6;//不限類別，累積紀錄次數

    public static final int DAILY_AND_TRANS_ALL = 7;//交通和生活用品所有類別均紀錄過

    @Id
    @JsonProperty("achievementId")
    private String achievementId;//紀錄id

    @JsonProperty("achievementName")
    private String achievementName;//成就名稱

    @JsonProperty("achievementDescription")
    private String achievementDescription;//成就目標敘述

    @JsonProperty("unLockedSvg")
    private String unLockedSvg;

    @JsonProperty("lockedSvg")
    private String lockedSvg;

    @JsonProperty("target")
    private int target; //成就目標

    @JsonProperty("current")
    private int current;//目前進度

    @JsonProperty("achieve")
    private boolean achieve;//是否解鎖

    @JsonProperty("type")
    private int type;//成就類型

    public Achievement() {
    }


    public Achievement(String achievementId, String achievementName, String achievementDescription, String unLockedSvg, String lockedSvg, int target, int current, boolean achieve, int type) {
        this.achievementId = achievementId;
        this.achievementName = achievementName;
        this.achievementDescription = achievementDescription;
        this.unLockedSvg = unLockedSvg;
        this.lockedSvg = lockedSvg;
        this.target = target;
        this.current = current;
        this.achieve = achieve;
        this.type = type;
    }

    public String getAchievementId() {
        return achievementId;
    }

    public void setAchievementId(String achievementId) {
        this.achievementId = achievementId;
    }

    public String getAchievementName() {
        return achievementName;
    }

    public void setAchievementName(String achievementName) {
        this.achievementName = achievementName;
    }

    public String getAchievementDescription() {
        return achievementDescription;
    }

    public void setAchievementDescription(String achievementDescription) {
        this.achievementDescription = achievementDescription;
    }

    public String getUnLockedSvg() {
        return unLockedSvg;
    }

    public void setUnLockedSvg(String unLockedSvg) {
        this.unLockedSvg = unLockedSvg;
    }

    public String getLockedSvg() {
        return lockedSvg;
    }

    public void setLockedSvg(String lockedSvg) {
        this.lockedSvg = lockedSvg;
    }

    public int getTarget() {
        return target;
    }

    public void setTarget(int target) {
        this.target = target;
    }

    public int getCurrent() {
        return current;
    }

    public void setCurrent(int current) {
        this.current = current;
    }

    public boolean isAchieve() {
        return achieve;
    }

    public void setAchieve(boolean achieve) {
        this.achieve = achieve;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "Achievement{" +
                "achievementId='" + achievementId + '\'' +
                ", achievementName='" + achievementName + '\'' +
                ", achievementDescription='" + achievementDescription + '\'' +
                ", unLockedSvg='" + unLockedSvg + '\'' +
                ", lockedSvg='" + lockedSvg + '\'' +
                ", target=" + target +
                ", current=" + current +
                ", achieve=" + achieve +
                ", type=" + type +
                '}';
    }
}
