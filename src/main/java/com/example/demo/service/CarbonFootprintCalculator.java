package com.example.demo.service;
import java.util.HashMap;
import java.util.Map;

public class CarbonFootprintCalculator {

    private static final Map<String, Double> TYPE_COEFFICIENTS = new HashMap<>();

    static {
        //TYPE_COEFFICIENTS.put("做的行為", 該類型的基準排放量-該行為排量的量);
        TYPE_COEFFICIENTS.put("使用環保杯", 6.0-0.0);
        TYPE_COEFFICIENTS.put("使用環保餐具", 30.0-0.0);
        TYPE_COEFFICIENTS.put("使用購物袋", 60.0-0.0);
        TYPE_COEFFICIENTS.put("搭公車", 110.0-40.0);
        TYPE_COEFFICIENTS.put("搭捷運", 110.0-40.0);
        TYPE_COEFFICIENTS.put("搭火車(台鐵)", 110.0-60.0);
        TYPE_COEFFICIENTS.put("搭高鐵", 110.0-70.0);
        // 添加更多的類型和對應的係數
        //以下單位為:gCO2e/個數
        //生活用品 有 使用不環保杯:6 使用不環保餐具:30 使用不環保袋:60
        //使用環保用品當作0排放
        //以塑膠杯為基準 每次使用環保筷=節省0.02的量=3.3333個塑膠杯
        //以下單位為:gCO2e/km
        //交通有 搭公車:40 搭捷運:40 搭高鐵:32 搭火車:60 (相較於開車110)
        //所以減少的量為 110-40 110-40 110-32 110-60
        //騎機車:100 (相較於騎電動機車:25.2)
    }

    public double calculateFootprint(String type, double data_value) {
        return TYPE_COEFFICIENTS.getOrDefault(type, 0.0) * data_value;
    }


}


