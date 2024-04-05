package com.example.demo.service;

import com.example.demo.entity.EcoRecord;
import com.example.demo.entity.UserAchievementEntity;
import com.example.demo.repository.RecordRepository;
import com.example.demo.repository.UserRecordCounterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EcoRecordService {
    private RecordRepository repository = null;
    private UserRecordCounterRepository userRecordCounterRepository;

    public static int OK = 1;
    public static int BAD = 0;

    @Autowired
    public EcoRecordService(RecordRepository repository, UserRecordCounterRepository userRecordCounterRepository) {
        this.repository = repository;
        this.userRecordCounterRepository = userRecordCounterRepository;
    }

    public EcoRecordService() {
    }


    //更新使用者總紀錄資訊
    private void addRecordAchievementObjectUpdate(EcoRecord newRecord) {

        UserAchievementEntity userAchievementEntity = this.userRecordCounterRepository.findByUserId(newRecord.getUserId());
        //累計次數
        int cnt = 1;
        if (userAchievementEntity.getClassRecordCounter() != null) {
            //該使用者已經存過此類別的項目
            if (userAchievementEntity.getClassRecordCounter().containsKey(newRecord.getClassType())) {
                cnt += userAchievementEntity.getClassRecordCounter().get(newRecord.getClassType());
                //重新覆蓋原本的資訊

            }
        }

        userAchievementEntity.getClassRecordCounter().put(newRecord.getClassType(), cnt);

        //累計減碳量
        double sum = newRecord.getFootprint();
        if (userAchievementEntity.getClassRecordCarbonCounter() != null) {
            //該使用者已經存過此類別的項目
            if (userAchievementEntity.getClassRecordCarbonCounter().containsKey(newRecord.getClassType())) {
                sum += userAchievementEntity.getClassRecordCarbonCounter().get(newRecord.getClassType());
                //重新覆蓋原本的資訊

            }
        }

        userAchievementEntity.getClassRecordCarbonCounter().put(newRecord.getClassType(), sum);
        this.userRecordCounterRepository.save(userAchievementEntity);
    }

    //增加新紀錄到資料庫中
    public EcoRecord addRecord(EcoRecord ecoRecord) {

        addRecordAchievementObjectUpdate(ecoRecord);
        return this.repository.save(ecoRecord);
    }

    //修改歷史紀錄
    public EcoRecord updateRecord(EcoRecord newEcoRecord) {
        return this.repository.save(newEcoRecord);
    }

    //刪除特定一個歷史紀錄
    public void deleteOneRecord(String recordId) {
        this.repository.deleteByRecordId(recordId);
    }

    //查詢特定recordId之紀錄
    public EcoRecord findOneRecord(String recordId) {
        return this.repository.findByRecordId(recordId);
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
