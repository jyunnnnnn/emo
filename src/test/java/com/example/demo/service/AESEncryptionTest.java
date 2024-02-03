package com.example.demo.service;

import com.example.demo.service.AESEncryption;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

//測試加密物件功能
@SpringBootTest
class AESEncryptionTest {

    private AESEncryption aes;
    private String encryptKey = "s!5aNv*5%waZ*vt5";
    private String encryptIv = "E4&XZW!%%M3Wq3MC";

    @BeforeEach
    void setUp() {
        this.aes = new AESEncryption();
    }

    //測試加密功能
    @Test
    @DisplayName("Encrypt Function Test")
    void encrypt() {
        String encryptStr = aes.encrypt("test");
        //判斷加密字串是否正確
        assertEquals(encryptStr, "A8HCG55vZND8Qx2E41HONA==");
    }

    //測試解密功能
    @Test
    @DisplayName("Decrypt Function Test")
    void decrypt() {
        String decryptStr = aes.decrypt("A8HCG55vZND8Qx2E41HONA==");
        assertEquals(decryptStr, "test");
    }

    //測試金鑰是否正確
    @Test
    @DisplayName("Key string Test")
    void key() {
        assertEquals(this.aes.getKey(), encryptKey);
    }

    @Test
    @DisplayName("IV string Test")
    void iv() {
        assertEquals(this.aes.getIv(), encryptIv);
    }
}