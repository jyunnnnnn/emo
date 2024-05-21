package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.entity.Record;
import com.example.demo.repository.RankRepository;
import com.example.demo.repository.RecordRepository;
import com.example.demo.repository.UserRecordCounterRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.mongodb.client.model.Indexes.ascending;

@Service
public class RankService {

    private RankRepository rankRepository;
    private RecordRepository recordRepository;

    private UserRepository userRepository;
    private UserRecordCounterRepository userRecordCounterRepository;
    private List<RankEntity> ranks;
    private List<UserInfo> userList;
    private List<UserAchievementEntity> users;


    @Autowired
    public RankService(RankRepository rankRepository, RecordRepository recordRepository, UserRepository userRepository, UserRecordCounterRepository userRecordCounterRepository) {
        this.rankRepository = rankRepository;
        this.recordRepository = recordRepository;
        this.userRepository = userRepository;
        this.userRecordCounterRepository = userRecordCounterRepository;
        //排行物件只需要系統啟動時載入就好
        ranks = this.rankRepository.findAll(Sort.by(Sort.Direction.ASC, "rankType"));
        userList = this.userRepository.findAll();
        users = this.userRecordCounterRepository.findAll();
    }

    //更新使用者成就物件和使用者名單物件
    public void updateRankObject() {
        userList = this.userRepository.findAll();
        users = this.userRecordCounterRepository.findAll();
    }


    public List<RankInitReturnEntity> getUsersRankingInfo() {
        List<RankInitReturnEntity> result = new ArrayList<>();


        Map<String, UserInfo> userInfoMap = new HashMap<>();

//        List<UserInfo> userList = this.userRepository.findAll();


        for (UserInfo userInfo : userList) {
            userInfoMap.put(userInfo.getUserId(), userInfo);
        }


//        List<UserAchievementEntity> users = this.userRecordCounterRepository.findAll();

        for (UserAchievementEntity user : users) {
            String userId = user.getUserId();
            UserInfo userInfo = userInfoMap.get(userId);
            if (userInfo == null) {
                continue;
            }

            RankInitReturnEntity rankInitReturnEntity = new RankInitReturnEntity();
            rankInitReturnEntity.setUserId(userId);
            rankInitReturnEntity.setNickname(userInfo.getNickname());
            rankInitReturnEntity.setPhoto(userInfo.getPhoto());

            double totalFP = 0.0;
            Map<String, Double> classRecordCarbonCounter = user.getClassRecordCarbonCounter();
            if (classRecordCarbonCounter.containsKey("生活用品")) {
                totalFP += classRecordCarbonCounter.get("生活用品");
            }
            if (classRecordCarbonCounter.containsKey("交通")) {
                totalFP += classRecordCarbonCounter.get("交通");
            }
            rankInitReturnEntity.setTotalFP(totalFP);

            int rankType = this.findRank(totalFP);
            rankInitReturnEntity.setRankType(rankType);

            result.add(rankInitReturnEntity);
        }
        return result;
    }

    //新增rank
    public void addRank(RankEntity rankEntity) {
        this.rankRepository.save(rankEntity);
    }


    public List<RankEntity> getAllRank() {
        return ranks;
    }

    //找出該總減碳量所屬的牌位
    private int findRank(double totalFP) {

        for (int i = 0; i < ranks.size(); i++) {
            if ((i + 1) < ranks.size() && ranks.get(i).getLowerBound() <= totalFP && ranks.get(i + 1).getLowerBound() > totalFP) {
                return ranks.get(i).getRankType();
            }
        }

        //總減碳量超級大
        return ranks.get(ranks.size() - 1).getRankType();
    }

}
