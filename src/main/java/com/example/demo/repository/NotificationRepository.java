package com.example.demo.repository;

import com.example.demo.entity.EcoRecord;
import com.example.demo.entity.NotificationEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;

public interface NotificationRepository extends MongoRepository<NotificationEntity,String> {
    NotificationEntity findByUserId(@Param("_id") String userId);//抓取特定紀錄Id之紀錄

}
