package com.example.demo.repository;


import com.example.demo.entity.RankEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RankRepository extends MongoRepository<RankEntity, String> {

}
