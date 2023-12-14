package com.example.demo.service;

import org.springframework.stereotype.Service;

@Service
public class EncryptService {

    private final AESEncryption aes;

    public EncryptService(){
        this.aes=new AESEncryption();
    }
    public String getKey(){
        return aes.getKey();
    }
    public String getIv(){
        return aes.getIv();
    }



}
