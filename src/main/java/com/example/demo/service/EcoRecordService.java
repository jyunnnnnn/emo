package com.example.demo.service;

import com.example.demo.repository.RecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EcoRecordService {
    private final RecordRepository repository;

    public static int OK = 1;
    public static int BAD = 0;

    @Autowired
    public EcoRecordService(RecordRepository repository) {
        this.repository = repository;
    }

    //增加新紀錄到資料庫中
    public void addRecord(EcoRecord ecoRecord) {
        System.out.println(ecoRecord + "已新增到資料庫中.");
        this.repository.save(ecoRecord);
    }

    //修改歷史紀錄
    public void updateRecord(EcoRecord newEcoRecord) {
        this.repository.save(newEcoRecord);
    }

    //刪除特定一個歷史紀錄
    public void deleteOneRecord(String recordId) {
        this.repository.deleteByRecordId(recordId);
    }



    //抓取特定使用者紀錄
    public List<EcoRecord> getSpecificUserRecords(String username) {
        return this.repository.findAllByUserId(username);
    }


    //抓取所有紀錄
    public List<EcoRecord> getAllRecords() {
        return this.repository.findAll();
    }
    //刪除特定使用者紀錄
    public int deleteSpecificUserRecord(String userId) {
        try {
            this.repository.deleteByUserId(userId);
        } catch (Exception err) {
            System.err.println(err + " 刪除特定使用者紀錄過程出現問題");
            return BAD;
        }
        return OK;
    }

    //刪除所有紀錄
    public int deleteAllRecord() {
        try {
            this.repository.deleteAll();
        } catch (Exception err) {
            System.err.println(err + " 刪除所有紀錄過程出現問題");
            return BAD;
        }
        return OK;
    }

}
