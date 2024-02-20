package com.example.demo.repository;
import com.example.demo.entity.Footprint;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface FootprintRepository extends MongoRepository<Footprint,String>{
    Footprint findByFPId(String type);
    void deleteByFPId(String FPId);
}
