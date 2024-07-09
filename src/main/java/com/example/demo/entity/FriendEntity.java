package com.example.demo.entity;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.*;

/*
    Friend List of a user

    contains 2 member

    1. Friend List , 已經是朋友的列表
        Data Structure: Map<String,FriendInfo>: friend's userId , info about the user

    2. Requested List, 還沒答覆的對象(誰向我發送了邀請)
        Data Structure: Set<String> : requested userId

    3. Requesting List,向誰發送了邀請
        Data Structure: Set<String> : requesting userId


 */
@Document(collection = "Emo_Friend")
public class FriendEntity {


    @Id
    private String userId;
    private List<FriendInfo> friendList;
    private Set<String> requestingList;

    private Set<String> requestedList;

    public FriendEntity() {
    }

    public FriendEntity(String userId) {
        this.userId = userId;
        friendList = new ArrayList<>();
        requestedList = new HashSet<>();
        requestingList = new HashSet<>();
    }


    //新增加好友資訊
    public void addNewFriendInfo(FriendInfo targetInfo) {
        friendList.add(targetInfo);
    }

    //新增邀請對象userId (我發送邀請給其他人)
    public void addNewRequesting(String targetId) {
        requestingList.add(targetId);
    }

    //新增發送邀請給本使用者的userId (其他人發送給我)
    public void addNewRequsted(String targetId) {
        requestedList.add(targetId);
    }


    //取消好友邀請
    public void removeRequesting(String targetId) {
        requestingList.remove(targetId);
    }

    //取消他人發送的邀請
    public void removeRequested(String targetId) {
        requestedList.remove(targetId);
    }

    //刪除targetId這名好友
    public void deleteFriend(String targetId) {
        for (int i = 0; i < friendList.size(); i++) {
            if (friendList.get(i).getUserId().equals(targetId)) {
                friendList.remove(i);
                break;
            }
        }
    }


    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }


    public List<FriendInfo> getFriendList() {
        return friendList;
    }

    public void setFriendList(List<FriendInfo> friendList) {
        this.friendList = friendList;
    }

    public Set<String> getRequestingList() {
        return requestingList;
    }

    public void setRequestingList(Set<String> requestingList) {
        this.requestingList = requestingList;
    }

    public Set<String> getRequestedList() {
        return requestedList;
    }

    public void setRequestedList(Set<String> requestedList) {
        this.requestedList = requestedList;
    }

    @Override
    public String toString() {
        return "FriendEntity{" +
                "userId='" + userId + '\'' +
                ", friendList=" + friendList +
                ", requestingList=" + requestingList +
                ", requestedList=" + requestedList +
                '}';
    }
}
