package com.example.demo.service;

public class User {
    private String account;
    private String password;
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