package com.example.demo.service;

import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

/*
 * AES algorithm 密碼加密、解密
 */
public class AESEncryption {

    //字符编码
    private static final String CHARSET = "UTF-8";
    //指定AES加密算法
    private static final String ALGORITHM = "AES";

    //指定AES加密算法模式
    private static final String ALGORITHM_CIPHER = "AES/CBC/PKCS5Padding";
    private  final String KEY = "s!5aNv*5%waZ*vt5";// 加密金鑰
    //偏移量
    private  final String IV  = "E4&XZW!%%M3Wq3MC";
    // 加密method
    public  String encrypt(String plaintext) {
        try {
            SecretKeySpec secret = new SecretKeySpec(KEY.getBytes(CHARSET), ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM_CIPHER);
            IvParameterSpec iv = new IvParameterSpec(IV.getBytes(CHARSET));
            cipher.init(Cipher.ENCRYPT_MODE, secret, iv);
            byte[] encrypted = cipher.doFinal(plaintext.getBytes(CHARSET));
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    // 解密method
    public  String decrypt(String ciphertext) {
        try {
            SecretKeySpec secret = new SecretKeySpec(KEY.getBytes(CHARSET), ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM_CIPHER);
            IvParameterSpec iv = new IvParameterSpec(IV.getBytes(CHARSET));
            cipher.init(Cipher.DECRYPT_MODE, secret, iv);
            byte[] decrypted = cipher.doFinal(Base64.getDecoder().decode(ciphertext));
            return new String(decrypted);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    public String getKey(){
        return this.KEY;
    }
    public String getIv(){return this.IV;}

}