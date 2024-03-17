package com.example.demo.service;

import com.example.demo.entity.DotOfLine;
import com.example.demo.entity.EcoRecord;
import com.example.demo.repository.RecordRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
//Delete 功能不測試 delete功能純粹基於MongoDB端功能

//減碳紀錄Service測試
@SpringBootTest
@ExtendWith(MockitoExtension.class)
@DisplayName("EcoRecord Service Layer Test")
class EcoRecordServiceTest {

    @InjectMocks
    private EcoRecordService ecoRecordService;
    //虛假紀錄資料庫，用以模擬資料庫運作，並非實際與資料庫互動，能避免mongoDB出問題時導致service測試失敗的問題
    @Mock
    private static RecordRepository recordRepository;
    private static List<EcoRecord> testList = new ArrayList<>();

    //    建置測試環境
    @BeforeEach
    public void setUp() {
        //自創測試紀錄
        testList.clear();
        for (int i = 1; i <= 3; i++) {
            EcoRecord tmp = tmp = new EcoRecord(
                    "testUserId",
                    "testClassType",
                    "testType",
                    i*5,
                    i*0.1,
                    i*0.2,
                    i+5,
                    "testField1",
                    "testField2",
                    Arrays.asList(
                            new DotOfLine(1.0, 1.0, 2.0,1.0),
                            new DotOfLine(1.0, 3.0, 4.0,1.0)
                    )
            );
            testList.add(tmp);
        }

    }

    //測試新增紀錄功能
    @Test
    @DisplayName("Add Record Test")
    void addRecordTest() {
        EcoRecord target = testList.get(1);

        //設置資料庫運作模式
        when(this.recordRepository.save(target)).thenReturn(target);

        EcoRecord result = ecoRecordService.addRecord(target);
        assertEquals(target.getRecordId(), result.getRecordId());
    }

    //測試更新紀錄數值
    @Test
    @DisplayName("Update Record Test")
    void updateRecordTest() {
        //舊資料
        EcoRecord target = testList.get(1);
        //新資料
        EcoRecord newTarget = target;
        newTarget.setData_value(999);
        when(recordRepository.save(newTarget)).thenReturn(newTarget);
        EcoRecord result = this.ecoRecordService.updateRecord(newTarget);
        assertEquals(result.getData_value(), newTarget.getData_value());
    }


    @Test
    @DisplayName("Find One Record Using Record Id Test")
        //測試查詢特定紀錄功能
    void findOneRecordTest() {
        EcoRecord target = testList.get(1);
        String targetRecordId = target.getRecordId();
        when(recordRepository.findByRecordId(targetRecordId)).thenReturn(target);

        EcoRecord result = this.ecoRecordService.findOneRecord(targetRecordId);

        assertEquals(result.getRecordId(), target.getRecordId());
    }

    @Test
    @DisplayName("Get All Specific UserInfo Record Test")
        //抓取特定使用者的所有紀錄資訊
    void getSpecificUserRecordsTest() {

        String targetUser = "testUserId";
        when(recordRepository.findAllByUserId(targetUser)).thenReturn(testList);

        List<EcoRecord> result = this.ecoRecordService.getSpecificUserRecords(targetUser);

        for (EcoRecord tmp : result) {
            //檢查抓取紀錄userId是否為目標使用者的
            assertEquals(tmp.getUserId(), targetUser);
        }
    }

    @Test
    @DisplayName("Get All Record Test")
        //抓取所有紀錄
    void getAllRecordsTest() {
        when(recordRepository.findAll()).thenReturn(testList);
        List<EcoRecord> result = this.ecoRecordService.getAllRecords();
        assertEquals(result.size(), testList.size());
    }

}