package com.example.demo.repository;

import com.example.demo.service.EcoRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.List;

@Repository
public interface RecordRepository extends MongoRepository<EcoRecord, String> {

    @Query("{ 'userId' : ?0 }")
    List<EcoRecord> findAllByUserId(@Param("userId") String userId);//抓取某使用者的所有紀錄

    void deleteByRecordId(String RecordId);

    void deleteByUserId(String userId);



}
