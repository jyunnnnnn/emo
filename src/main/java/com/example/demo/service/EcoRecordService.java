package com.example.demo.service;

import com.example.demo.repository.RecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EcoRecordService {
    private final RecordRepository repository;

    @Autowired
    public EcoRecordService(RecordRepository repository) {
        this.repository = repository;
    }

    //增加新紀錄到資料庫中
    public void addRecord(EcoRecord ecoRecord) {
        System.out.println(ecoRecord);
        this.repository.save(ecoRecord);
    }

    //修改歷史紀錄
    public void updateRecord(EcoRecord newEcoRecord) {
        this.repository.save(newEcoRecord);
    }

    //刪除歷史紀錄
    public void deleteRecord(EcoRecord target) {
        this.repository.delete(target);
    }

    //抓取特定使用者紀錄
    public List<EcoRecord> getSpecificUserRecords(String username) {

        return this.repository.findAllByUserId(username);
    }


    //抓取所有紀錄
    public List<EcoRecord> getAllRecords() {
        return this.repository.findAll();
    }
}
