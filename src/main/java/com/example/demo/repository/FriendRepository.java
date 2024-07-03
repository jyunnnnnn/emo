package com.example.demo.repository;


import com.example.demo.entity.FriendEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendRepository extends MongoRepository<FriendEntity,String> {
}
