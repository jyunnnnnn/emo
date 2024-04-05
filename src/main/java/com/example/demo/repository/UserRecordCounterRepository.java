package com.example.demo.repository;

import com.example.demo.entity.UserAchievementEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

//紀錄某使用者的總減碳紀錄次數
@Repository
public interface UserRecordCounterRepository extends MongoRepository<UserAchievementEntity, String> {

    //抓取特定使用者資訊
    UserAchievementEntity findByUserId(@Param("_id") String userId);
}
