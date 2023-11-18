package com.example.demo.service;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Emo_User")
public class User {
    @Id
    private String username;//使用者帳號

    public void setPassword(String password) {
        this.password = password;
    }

    private String password;//使用者密碼
    private String nickname;//使用者暱稱
    private String email;//使用者信箱
    private String userId;//使用者ID

    //constructor
    public User() {

    }

    public User(String username, String password, String nickname, String email, String userId) {
        this.username = username;
        this.password = password;
        this.nickname = nickname;
        this.email = email;
        this.userId = userId;
    }

    //constructor without nickname,default nickname is username
    public User(String username, String password, String email, String userId) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.userId = userId;
        this.nickname = username;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }


    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }


    public String toString() {
        return "Username: " + username + "\n" + "Password: " + password + "\n" + "nickname: " + nickname + "\n" + "email: " + email + "\n" + "userId: " + userId;
    }

}
//使用者註冊資料