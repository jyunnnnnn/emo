package com.example.demo.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

//加密Service端測試
@SpringBootTest
@DisplayName("Encrypt Service Layer Test")
class EncryptServiceTest {

    @Autowired
    private EncryptService encryptService;

    @BeforeEach
    public void setUp() {
        this.encryptService = new EncryptService();
    }

    private String targetKey = "s!5aNv*5%waZ*vt5";
    private String targetIv = "E4&XZW!%%M3Wq3MC";

    @Test
    @DisplayName("Get Encrypt Key Test")
        //回傳金鑰測試
    void getKey() {
        String result = this.encryptService.getKey();
        assertEquals(result, targetKey);
    }

    @Test
    @DisplayName("Get Encrypt Iv Test")
    void getIv() {
        String result = this.encryptService.getIv();
        assertEquals(result, targetIv);
    }
}