    package com.example.demo.entity;

    import org.springframework.data.annotation.Id;
    import org.springframework.data.mongodb.core.mapping.Document;

    import java.util.List;

    @Document(collection = "Emo_Achievement")
    public class Achievement {
        @Id
        private String achievementId;//紀錄id
        private String achievementName;//成就名稱
        private String achievementDescription;//成就目標敘述
        private String unLockedSvg;
        private String lockedSvg;
        private int target; //成就目標
        private int current;//目前進度
        private boolean achieve;//是否解鎖

        //constructor
        public Achievement(String achievementId, String achievementName, String achievementDescription, String unLockedSvg, String lockedSvg,int target,int current,boolean achieve) {
            this.achievementId = achievementId; ;
            this.achievementName = achievementName;
            this.achievementDescription = achievementDescription;
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
            return achievementId;
        }

        public int getCurrent() {
            return current;
        }

        public String getAchievementDescription() {
            return achievementDescription;
        }

        public String getAchievementName() {
            return achievementName;
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
            this.achievementId = achievementId;
        }

        public void setAchievementDescription(String achievementDescription) {
            this.achievementDescription = achievementDescription;
        }

        public void setAchievementName(String achievementName) {
            this.achievementName = achievementName;
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
            "AchievementId: "+ achievementId+"\n"+
            "AchievementName: " + achievementName+"\n"+
            "AchievementDescription: " + achievementDescription+"\n"+
            "unLockedSvg: " + unLockedSvg+"\n"+
            "lockedSvg: " + lockedSvg+"\n"+
            "target: " + target+"\n"+
            "current: " + current+"\n"+
            "achieve: " +achieve+"}";
        }
    }
