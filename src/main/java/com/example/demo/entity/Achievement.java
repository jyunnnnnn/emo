    package com.example.demo.entity;

    import org.springframework.data.annotation.Id;
    import org.springframework.data.mongodb.core.mapping.Document;

    import java.util.List;

    @Document(collection = "Emo_Achievement")
    public class Achievement {

        private String AchievementId;//紀錄id
        private String AchievementName;//成就名稱
        private String AchievementDescription;//成就目標敘述
        private String unLockedSvg;
        private String lockedSvg;
        private int target; //成就目標
        private int current;//目前進度
        private boolean achieve;//是否解鎖

        //constructor
        public Achievement(String AchievementId, String AchievementName, String AchievementDescription, String unLockedSvg, String lockedSvg,int target,int current,boolean achieve) {
            this.AchievementId = AchievementId; ;
            this.AchievementName = AchievementName;
            this.AchievementDescription = AchievementDescription;
            this.unLockedSvg = unLockedSvg;
            this.lockedSvg = lockedSvg;
            this.target = target;
            this.current = current;
            this.achieve = achieve;
        }

        public boolean isAchieve() {
            return achieve;
        }

        public String getAchievementId() {
            return AchievementId;
        }

        public int getCurrent() {
            return current;
        }

        public String getAchievementDescription() {
            return AchievementDescription;
        }

        public String getAchievementName() {
            return AchievementName;
        }

        public int getTarget() {
            return target;
        }

        public String getLockedSvg() {
            return lockedSvg;
        }

        public String getUnLockedSvg() {
            return unLockedSvg;
        }

        public void setAchieve(boolean achieve) {
            this.achieve = achieve;
        }

        public void setAchievementId(String achievementId) {
            AchievementId = achievementId;
        }

        public void setAchievementDescription(String achievementDescription) {
            AchievementDescription = achievementDescription;
        }

        public void setAchievementName(String achievementName) {
            AchievementName = achievementName;
        }

        public void setCurrent(int current) {
            this.current = current;
        }

        public void setLockedSvg(String lockedSvg) {
            this.lockedSvg = lockedSvg;
        }

        public void setTarget(int target) {
            this.target = target;
        }

        public void setUnLockedSvg(String unLockedSvg) {
            this.unLockedSvg = unLockedSvg;
        }

        public String toString(){
            return "{" +
            "AchievementId: "+ AchievementId+"\n"+
            "AchievementName: " + AchievementName+"\n"+
            "AchievementDescription: " + AchievementDescription+"\n"+
            "unLockedSvg: " + unLockedSvg+"\n"+
            "lockedSvg: " + lockedSvg+"\n"+
            "target: " + target+"\n"+
            "current: " + current+"\n"+
            "achieve: " +achieve+"}";
        }
    }
