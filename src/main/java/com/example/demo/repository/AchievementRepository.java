package com.example.demo.repository;

import com.example.demo.entity.Achievement;
import com.example.demo.entity.EcoRecord;
import com.example.demo.entity.UserInfo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AchievementRepository extends MongoRepository<Achievement, String> {
    void deleteByAchievementId(String AchievementId);
    EcoRecord findByAchievementId(@Param("_id") String AchievementId);//抓取特定紀錄Id之紀錄
}
