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
import java.util.List;

import static com.mongodb.client.model.Indexes.ascending;

@Service
public class RankService {

    private RankRepository rankRepository;
    private RecordRepository recordRepository;

    private UserRepository userRepository;
    private UserRecordCounterRepository userRecordCounterRepository;
    private List<RankEntity> ranks;

    @Autowired
    public RankService(RankRepository rankRepository, RecordRepository recordRepository, UserRepository userRepository, UserRecordCounterRepository userRecordCounterRepository) {
        this.rankRepository = rankRepository;
        this.recordRepository = recordRepository;
        this.userRepository = userRepository;
        this.userRecordCounterRepository = userRecordCounterRepository;
    }


    public List<RankInitReturnEntity> getUsersRankingInfo() {
        ranks = this.rankRepository.findAll(Sort.by(Sort.Direction.ASC, "rankType"));

        //抓出所有使用者的總減碳量
        List<UserAchievementEntity> users = this.userRecordCounterRepository.findAll();

        List<RankInitReturnEntity> result = new ArrayList<>();

        for (UserAchievementEntity user : users) {
            //初始化該使用者的rank物件
            RankInitReturnEntity rankInitReturnEntity = new RankInitReturnEntity();

            //獲取使用者id
            String userId = user.getUserId();
            rankInitReturnEntity.setUserId(userId);

            double totalFP = 0.0;
            //計算總減碳量
            if (user.getClassRecordCarbonCounter().containsKey("生活用品")) {
                totalFP += user.getClassRecordCarbonCounter().get("生活用品");
            }

            if (user.getClassRecordCarbonCounter().containsKey("交通")) {
                totalFP += user.getClassRecordCarbonCounter().get("交通");
            }

            rankInitReturnEntity.setTotalFP(totalFP);

            //找到此使用者所屬的rank
            int rankType = this.findRank(totalFP);
            rankInitReturnEntity.setRankType(rankType);

            //找到該使用者的資料
            UserInfo userInfo = this.userRepository.findByUserId(userId);
            if (userInfo != null) {
                rankInitReturnEntity.setNickname(userInfo.getNickname());
                rankInitReturnEntity.setPhoto(userInfo.getPhoto());
            } else {
                //沒有此使用者就跳過
                continue;
            }


            result.add(rankInitReturnEntity);
        }


        return result;
    }

    //新增rank
    public void addRank(RankEntity rankEntity) {
        this.rankRepository.save(rankEntity);
        return;
    }


    public List<RankEntity> getAllRank() {
        return this.rankRepository.findAll();
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
