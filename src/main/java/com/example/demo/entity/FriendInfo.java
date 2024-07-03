package com.example.demo.entity;

//好友訊息
public class FriendInfo {

    private String userId;


    public FriendInfo() {

    }

    public FriendInfo(String userId) {
        this.userId = userId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
