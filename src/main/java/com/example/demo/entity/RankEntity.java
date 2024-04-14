package com.example.demo.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "Emo_Rank")
public class RankEntity {
    //牌位名稱
    private String rankName;
    //牌位類型
    private int rankType;
    //牌位顏色
    private String rankColor;

    //達成此階段的最低減碳量
    private double lowerBound;

    @Override
    public String toString() {
        return "RankEntity{" +
                "rankName='" + rankName + '\'' +
                ", rankType=" + rankType +
                ", rankColor='" + rankColor + '\'' +
                ", lowerBound=" + lowerBound +
                '}';
    }
}
