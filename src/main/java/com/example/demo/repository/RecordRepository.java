package com.example.demo.repository;

import com.example.demo.entity.EcoRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecordRepository extends MongoRepository<EcoRecord, String> {

    @Query("{ 'userId' : ?0 }")
    List<EcoRecord> findAllByUserId(@Param("userId") String userId);//抓取某使用者的所有紀錄

    EcoRecord findByRecordId(@Param("_id") String recordId);//抓取特定紀錄Id之紀錄

    @Query("{'userId' : ?0 ,'classType':?1}")
    List<EcoRecord> findByUserIdAndClassType(@Param("userId") String userId, @Param("classType") String classType);

    void deleteByRecordId(String RecordId);

    void deleteByUserId(String userId);


}
