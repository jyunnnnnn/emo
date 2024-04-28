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
    private String nickname;
    private Double totalFP;
    private int rankType;


    @Override
    public String toString() {
        return "RankInitReturnEntity{" +
                "photo='" + photo + '\'' +
                ", nickname='" + nickname + '\'' +
                ", totalFP=" + totalFP +
                ", rankType=" + rankType +
                '}';
    }
}
