package com.example.demo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RankInitReturnEntity {
    //使用者頭像
    private String photo;
    private String userId;
    private String nickname;
    private Double totalFP;
    private int rankType;
    private Double monthlyFP;
    private Double weeklyFP;
    private Double dailyFP;


    @Override
    public String toString() {
        return "RankInitReturnEntity{" +
                "photo='" + photo + '\'' +
                ", userId='" + userId + '\'' +
                ", nickname='" + nickname + '\'' +
                ", rankType=" + rankType +
                ", totalFP=" + totalFP +
                ", monthlyFP=" + monthlyFP +
                ", weeklyFP=" + weeklyFP +
                ", dailyFP=" + dailyFP +
                '}';
    }
}
