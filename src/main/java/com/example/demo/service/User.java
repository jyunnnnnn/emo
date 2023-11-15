package com.example.demo.service;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Emo_User")
public class User {
    private String account;
    private String password;
    private String nickname;
    private String mail;
    private String userID;
    private String confirmPassword;

    public User(String account, String password) {
        this.account = account;
        this.password = password;

    }
    public String getAccount() {
        return account;
    }

    public String getPassword() {
        return password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }
}
//使用者註冊資料