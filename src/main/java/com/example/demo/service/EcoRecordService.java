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

    public static final int OK = 1;
    public static final int BAD = 0;


    public static final int ADD = 0;
    public static final int UPDATE = 1;
    public static final int DELETE = 2;

    @Autowired
    public EcoRecordService(RecordRepository repository, UserRecordCounterRepository userRecordCounterRepository) {
        this.repository = repository;
        this.userRecordCounterRepository = userRecordCounterRepository;
    }

    public EcoRecordService() {
    }


    //更新使用者成就總紀錄資訊
    public void recordAchievementObjectUpdate(String userId, EcoRecord target, int type) {
        long time1 = System.currentTimeMillis();

        UserAchievementEntity userAchievementEntity = this.userRecordCounterRepository.findByUserId(userId);

//        System.out.println(userAchievementEntity);

        String className = null;
        if (target != null)
            className = target.getClassType();

        if (type == ADD) {
            //新增紀錄
            int cnt = 1;

            if (userAchievementEntity.getClassRecordCounter().containsKey(className))
                cnt += userAchievementEntity.getClassRecordCounter().get(className);

            double sum = target.getFootprint();

            if (userAchievementEntity.getClassRecordCarbonCounter().containsKey(className))
                sum += userAchievementEntity.getClassRecordCarbonCounter().get(className);
            //避免數值為負值
            cnt = cnt <= 0 ? 0 : cnt;
            sum = sum <= 0.0 ? 0.0 : sum;
            userAchievementEntity.getClassRecordCarbonCounter().put(className, sum);
            userAchievementEntity.getClassRecordCounter().put(className, cnt);

        } else if (type == UPDATE) {
            //更新紀錄
            EcoRecord oldRecord = this.repository.findByRecordId(target.getRecordId());
            double sum = target.getFootprint() - oldRecord.getFootprint() + userAchievementEntity.getClassRecordCarbonCounter().get(className);
            sum = sum <= 0.0 ? 0.0 : sum;
            userAchievementEntity.getClassRecordCarbonCounter().put(className, sum);

        } else if (type == DELETE) {
            //刪除記錄
            int cnt = userAchievementEntity.getClassRecordCounter().get(className) - 1;
            double sum = userAchievementEntity.getClassRecordCarbonCounter().get(className) - target.getFootprint();
            //避免數值為負值
            cnt = cnt <= 0 ? 0 : cnt;
            sum = sum <= 0.0 ? 0.0 : sum;
            userAchievementEntity.getClassRecordCarbonCounter().put(className, sum);
            userAchievementEntity.getClassRecordCounter().put(className, cnt);
        }


        this.userRecordCounterRepository.save(userAchievementEntity);
        long time2 = System.currentTimeMillis();

        System.out.println("重新整理使用者成就物件 執行時間: " + (time2 - time1) + "豪秒");
    }

    //增加新紀錄到資料庫中
    public EcoRecord addRecord(EcoRecord ecoRecord) {

        this.repository.save(ecoRecord);
        this.recordAchievementObjectUpdate(ecoRecord.getUserId(), ecoRecord, ADD);
        return ecoRecord;
    }

    //修改歷史紀錄
    public EcoRecord updateRecord(EcoRecord newEcoRecord) {
        //順序不能顛倒
        this.recordAchievementObjectUpdate(newEcoRecord.getUserId(), newEcoRecord, UPDATE);
        this.repository.save(newEcoRecord);


        return newEcoRecord;
    }

    //刪除特定一個歷史紀錄
    public void deleteOneRecord(String recordId) {
        EcoRecord target = this.repository.findByRecordId(recordId);
        String userId = target.getUserId();
        this.repository.deleteByRecordId(recordId);
        this.recordAchievementObjectUpdate(userId, target, DELETE);

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
