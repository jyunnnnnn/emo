package com.example.demo.repository;
import com.example.demo.service.EcoRecord;
import com.example.demo.service.Footprint;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
@Repository
public interface FootprintRepository extends MongoRepository<Footprint,String>{
    Footprint findByFPId(String type);
    void deleteByFPId(String FPId);
}
