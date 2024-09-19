package com.example.demo.entity;

public class NotificationData {
    private String userId;
    private String nickname;
    private String photo;

    public NotificationData() {
    }

    public NotificationData(String userId, String nickname, String photo) {
        this.userId = userId;
        this.nickname = nickname;
        this.photo = photo;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }
}
