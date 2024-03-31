package com.example.demo.repository;

import com.example.demo.entity.Achievement;
import com.example.demo.entity.UserInfo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AchievementRepository extends MongoRepository<Achievement, String> {
    void deleteByAchievementId(String AchievementId);
}
