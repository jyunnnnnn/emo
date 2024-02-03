package com.example.demo.repository;

import com.example.demo.repository.RecordRepository;
import com.example.demo.service.EcoRecord;
import com.example.demo.service.EcoRecordService;
import org.assertj.core.api.Assert;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

//減碳紀錄Repository功能測試(測試與MongoDB端互動)
//@SpringBootTest
@Disabled("Do not really need to test")
class EcoRecordRepositoryTest {

    @Autowired
    private EcoRecordService ecoRecordService;

    @Autowired
    private RecordRepository recordRepository;
    //測試用紀錄
    private static List<EcoRecord> testList = new ArrayList<>();

    //測試環境建置
    @BeforeEach
    void setUp() {
        //自創測試紀錄
        testList.clear();
        for (int i = 1; i <= 3; i++) {
            EcoRecord tmp = new EcoRecord("test", "test", "test", i, i * 0.1, i * 0.2, 100.0, new Date().toString(), "test" + i);
            testList.add(tmp);
            this.recordRepository.save(tmp);
        }

    }

    //清除測試資料
    @AfterEach
    public void clear() {
        testList.clear();
        this.recordRepository.deleteByUserId("test");
    }

    @Test
    @DisplayName("Add Record Test")
    void addRecord() {
        //測試新增記錄功能 新增成功會回傳新增物件
        for (EcoRecord tmp : testList) {
            EcoRecord result = this.recordRepository.save(tmp);
            //新增物件後會回傳該物件
            assertNotNull(result);
            //回傳物件與新增物件之ID相同
            assertEquals(result.getRecordId(), tmp.getRecordId());
        }
    }

    @Test
    @DisplayName("Find Record By RecordId Test")
    void findOneRecord() {
        //找尋recordId為test1之紀錄
        EcoRecord tmp = this.recordRepository.findByRecordId("test1");
        assertEquals(tmp.getRecordId(), "test1");
    }

    //修改紀錄測試(使用recordId找尋特定紀錄並修改)
    @Test
    @DisplayName("Update One Record Test")
    void updateRecord() {
        //修改recordId為test1之紀錄
        EcoRecord tmp = this.recordRepository.findByRecordId("test1");
        int newDataValue = 999;
        tmp.setData_value(newDataValue);
        EcoRecord updateTarget = this.recordRepository.save(tmp);
        //更新物件後會回傳該物件
        assertNotNull(updateTarget);
        //回傳物件與更新物件之ID相同
        assertEquals(updateTarget.getRecordId(), tmp.getRecordId());
        //檢測數值是否修改成功
        assertEquals(updateTarget.getData_value(), newDataValue);
    }

    //測試刪除特定recordId之紀錄
    @Test
    @DisplayName("Delete One Record By RecordId Test")
    void deleteOneRecord() {
        //刪除recordId為test3之紀錄
        this.recordRepository.deleteByRecordId("test3");
        EcoRecord deleteRecord = this.recordRepository.findByRecordId("test3");
        //判斷是否刪除成功
        assertNull(deleteRecord);
    }

    //測試查詢特定使用者的所有紀錄
    @Test
    @DisplayName("Find All Specific User Record Test")
    void getSpecificUserRecords() {
        //查詢所有test使用者之紀錄
        List<EcoRecord> result = this.recordRepository.findAllByUserId("test");
        for (EcoRecord tmp : result) {
            //測試是否為test使用者之資料
            assertEquals(tmp.getUserId(), "test");
        }
        //測試抓取紀錄數量是否正確(預先新增3筆紀錄)
        assertEquals(result.size(), 3);
    }

    @Test
    @DisplayName("Get All Record Test")
    void getAllRecords() {
        //獲取所有紀錄測試
        List<EcoRecord> allRecord = this.recordRepository.findAll();
        assertNotNull(allRecord);
    }

    @Test
    @DisplayName("Delete All Specific User Record Test")
    void deleteSpecificUserRecord() {
        //刪除特定使用者測試
        //刪除使用者test2的紀錄
        this.recordRepository.deleteByUserId("test2");
        List<EcoRecord> target = this.recordRepository.findAllByUserId("test2");
        assertTrue(target.isEmpty());
    }


}