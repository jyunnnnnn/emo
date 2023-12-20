package com.example.demo.service;
import com.example.demo.repository.FootprintRepository;
import com.example.demo.repository.RecordRepository;
import com.example.demo.repository.RecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FootprintService {


    private final FootprintRepository repository;
    public static int OK = 7;
    public static int FAIL = 8;
    @Autowired
    public FootprintService( FootprintRepository repository ) {this.repository = repository;}


    public List<Footprint> getAllFootprint() {
        return this.repository.findAll();
    }
    public void addFootprint(Footprint footprint) {
        System.out.println(footprint);
        this.repository.save(footprint);
    }
    public int updateFootprintByFPId(String FPId, double newCoefficient) {
        Footprint result = this.repository.findByFPId(FPId);
        if (result != null) {
            Footprint updatedFootprint = new Footprint(FPId,result.getType(), newCoefficient);
            this.repository.save(updatedFootprint);
            return OK;
        }
        return FAIL;
    }
    public int deleteAllFootprint() {
        try {
            this.repository.deleteAll();
        } catch (Exception err) {
            System.err.println(err + " 刪除所有紀錄過程出現問題");
            return FAIL;
        }
        return OK;
    }
    public void deleteOneFootprint(String FPId) {
        this.repository.deleteByFPId(FPId);
    }
}

//    static {
//        //TYPE_COEFFICIENTS.put("做的行為", 該類型的基準排放量-該行為排量的量);
//        TYPE_COEFFICIENTS.put("環保杯", 6.0-0.0);
//        TYPE_COEFFICIENTS.put("環保餐具", 30.0-0.0);
//        TYPE_COEFFICIENTS.put("購物袋", 60.0-0.0);
//        TYPE_COEFFICIENTS.put("公車", 110.0-40.0);
//        TYPE_COEFFICIENTS.put("捷運", 110.0-40.0);
//        TYPE_COEFFICIENTS.put("火車", 110.0-60.0);
//        TYPE_COEFFICIENTS.put("高鐵", 110.0-70.0);
//        // 添加更多的類型和對應的係數
//        //以下單位為:gCO2e/個數
//        //生活用品 有 使用不環保杯:6 使用不環保餐具:30 使用不環保袋:60
//        //使用環保用品當作0排放
//        //以塑膠杯為基準 每次使用環保筷=節省0.02的量=3.3333個塑膠杯
//        //以下單位為:gCO2e/km
//        //交通有 搭公車:40 搭捷運:40 搭高鐵:32 搭火車:60 (相較於開車110)
//        //所以減少的量為 110-40 110-40 110-32 110-60
//        //騎機車:100 (相較於騎電動機車:25.2)
//    }
//
//    public double calculateFootprint(String type, double data_value) {
//        return TYPE_COEFFICIENTS.getOrDefault(type, 0.0) * data_value;
//    }
