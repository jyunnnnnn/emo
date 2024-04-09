package com.example.demo.entity;

import java.util.Date;

/*
    回傳給前端頁面的使用者成就狀態資訊物件
 */
public class UserAchievement extends Achievement {

    //達成時間
    private String accomplishTime;

    //是否為初次解鎖
    private boolean firstAccomplish;

    public UserAchievement() {
    }

    public UserAchievement(Achievement achievement, String accomplishTime, boolean firstAccomplish) {
        super(achievement);
        this.accomplishTime = accomplishTime;
        this.firstAccomplish = firstAccomplish;
    }

    public UserAchievement(String achievementId, String achievementName, String achievementDescription, String unLockedSvg, String lockedSvg, int target, double current, boolean achieve, int type, String achievementClass) {
        super(achievementId, achievementName, achievementDescription, unLockedSvg, lockedSvg, target, current, achieve, type, achievementClass);
    }

    public UserAchievement(Achievement source) {
        super(source);
        accomplishTime = null;
        firstAccomplish = false;
    }

    public String getAccomplishTime() {
        return accomplishTime;
    }

    public void setAccomplishTime(String accomplishTime) {
        this.accomplishTime = accomplishTime;
    }

    public boolean isFirstAccomplish() {
        return firstAccomplish;
    }

    public void setFirstAccomplish(boolean firstAccomplish) {
        this.firstAccomplish = firstAccomplish;
    }

    @Override
    public String toString() {
        return "UserAchievement{" +
                "accomplishTime=" + accomplishTime +
                ", firstAccomplish=" + firstAccomplish +
                '}';
    }
}
