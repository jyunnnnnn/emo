package com.example.demo.repository;

import com.example.demo.entity.UserInfo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends MongoRepository<UserInfo, String> {

    UserInfo findByUsername(String username);

    UserInfo findByEmail(String email);


    UserInfo deleteByUserId(String userId);
}

