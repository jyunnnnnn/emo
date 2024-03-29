package com.example.demo.entity;

import org.springframework.web.multipart.MultipartFile;

public class UserPhoto {
    private String username;//使用者帳號
    private byte[] photo;
    public UserPhoto(String username, byte[] photo) {
        this.username = username;
        this.photo = photo;
    }
    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
    public String toString() {
        return "Username: " + username + "\n" +
                "photo" + photo + "\n" ;
    }
}
