package com.example.demo.entity;

import org.springframework.security.core.userdetails.User;

import java.util.Date;
import java.util.Map;

/*
    回傳給前端頁面的使用者成就狀態資訊物件
 */
public class UserAchievement extends Achievement {

    //達成時間
    private Date accomplishTime;

    //是否為初次解鎖
    private boolean firstAccomplish;

    public UserAchievement() {
    }

    public UserAchievement(Achievement achievement, Date accomplishTime, boolean firstAccomplish) {
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

    public Date getAccomplishTime() {
        return accomplishTime;
    }

    public void setAccomplishTime(Date accomplishTime) {
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
