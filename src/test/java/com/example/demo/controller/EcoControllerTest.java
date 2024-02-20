package com.example.demo.controller;

import java.lang.reflect.*;

import com.example.demo.service.EcoRecord;
import com.example.demo.service.EcoRecordService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.internal.matchers.Null;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@DisplayName("Eco Record Controller Test")
class EcoControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private EcoRecordService ecoRecordService;

    @Autowired
    private ObjectMapper objectMapper;

    private EcoRecord testRecord = new EcoRecord("test", "test", "test", 0.0, 0.0, 0.0, 0.0, "test", "test");
    private List<EcoRecord> testList = Arrays.asList(testRecord, testRecord);

    /*
        新增紀錄測試
     */
    @Test
    @DisplayName("Add Record Test")
    void addRecord() throws Exception {
        //新增過程成功
        when(ecoRecordService.addRecord(any(EcoRecord.class))).thenReturn(testRecord);
        mockMvc.perform(post("/api/addRecord")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testRecord)))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());
        //新增記錄失敗
        when(ecoRecordService.addRecord(any(EcoRecord.class))).thenThrow(NullPointerException.class);
        mockMvc.perform(post("/api/addRecord")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testRecord)))
                .andExpect(status().isBadRequest())
                .andDo(MockMvcResultHandlers.print());
    }

    /*
        更新紀錄測試
     */
    @Test
    @DisplayName("Update Record Test")
    void updateRecord() throws Exception {
        //更新紀錄成功
        when(ecoRecordService.updateRecord(any(EcoRecord.class))).thenReturn(testRecord);
        mockMvc.perform(put("/api/updateRecord")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testRecord)))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());

        //更新紀錄失敗
        when(ecoRecordService.updateRecord(any(EcoRecord.class))).thenThrow(NullPointerException.class);
        mockMvc.perform(put("/api/updateRecord")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testRecord)))
                .andExpect(status().isBadRequest())
                .andDo(MockMvcResultHandlers.print());

    }

    /*
        獲取特定使用者紀錄
     */
    @Test
    @DisplayName("Get Specific User Record Test")
    void getSpecificUserRecord() throws Exception {
        //成功獲取特定使用者紀錄
        when(ecoRecordService.getSpecificUserRecords(any(String.class))).thenReturn(testList);
        MvcResult result = mockMvc.perform(get("/api/getSpecificUserRecord")
                        .param("userId", testRecord.getUserId()))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andReturn();
        String resultStr = result.getResponse().getContentAsString();

        Gson gson = new Gson();
        Type listType = new TypeToken<List<EcoRecord>>() {
        }.getType();
        List<EcoRecord> resultList = gson.fromJson(resultStr, listType);
        //檢驗回傳紀錄是否為該使用者
        for (EcoRecord tmp : resultList) {
            assertEquals(testRecord.getUserId(), tmp.getUserId());
        }

        //獲取使用者紀錄失敗
        when(ecoRecordService.getSpecificUserRecords(any(String.class))).thenThrow(NullPointerException.class);
        mockMvc.perform(get("/api/getSpecificUserRecord")
                        .param("userId", testRecord.getUserId()))
                .andExpect(status().isBadRequest())
                .andDo(MockMvcResultHandlers.print());


    }

    /*
        抓取所有紀錄
     */
    @Test
    @DisplayName("Get All Record Test")
    void getAllRecords() throws Exception {
        //回傳所有紀錄成功
        when(ecoRecordService.getAllRecords()).thenReturn(testList);
        MvcResult result =
                mockMvc.perform(get("/api/getAllRecords"))
                        .andExpect(status().isOk())
                        .andDo(MockMvcResultHandlers.print())
                        .andReturn();
        String resultStr = result.getResponse().getContentAsString();
        Gson gson = new Gson();
        Type listType = new TypeToken<List<EcoRecord>>() {
        }.getType();
        List<EcoRecord> resultList = gson.fromJson(resultStr, listType);
        //檢驗回傳紀錄數量
        assertEquals(resultList.size(), 2);

        //回傳記錄失敗
        when(ecoRecordService.getAllRecords()).thenThrow(NullPointerException.class);
        mockMvc.perform(get("/api/getAllRecords"))
                .andExpect(status().isBadRequest())
                .andDo(MockMvcResultHandlers.print());
    }

    /*
        刪除特定紀錄
     */
    @Test
    @DisplayName("Delete One Record Test")
    void deleteOneRecord() throws Exception {
        //刪除記錄成功
        mockMvc.perform(delete("/api/deleteOneRecord")
                        .param("recordId", testRecord.getRecordId()))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());

        //刪除記錄過程出現問題
        doThrow(NullPointerException.class).when(ecoRecordService).deleteOneRecord(any(String.class));
        mockMvc.perform(delete("/api/deleteOneRecord")
                        .param("recordId", testRecord.getRecordId()))

                .andExpect(status().isBadRequest())
                .andDo(MockMvcResultHandlers.print());
    }

    /*
        刪除多筆紀錄
     */
    @Test
    @DisplayName("Delete amount of Record Test")
    void deleteMulRecord() throws Exception {
        //刪除多筆紀錄成功
        List<String> test = new ArrayList<>();
        test.add("test");
        test.add("test");
        mockMvc.perform(delete("/api/deleteMulRecord")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(test)))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());
        //刪除多筆紀錄過程出現問題
        doThrow(NullPointerException.class).when(ecoRecordService).deleteOneRecord(any(String.class));
        mockMvc.perform(delete("/api/deleteMulRecord")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(test)))
                .andExpect(status().isBadRequest())
                .andDo(MockMvcResultHandlers.print());
    }

    /*
        刪除特定使用者紀錄
     */
    @Test
    @DisplayName("Delete Specific User Record Test")
    void deleteSpecificUserRecord() throws Exception {
        //刪除特定使用者紀錄成功
        mockMvc.perform(delete("/api/deleteSpecificUserRecord")
                        .param("userId", testRecord.getUserId()))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());
        //刪除特定使用者記錄過程出現錯誤
        doThrow(NullPointerException.class).when(ecoRecordService).deleteSpecificUserRecord(any(String.class));
        mockMvc.perform(delete("/api/deleteSpecificUserRecord")
                        .param("userId", testRecord.getUserId()))
                .andExpect(status().isOk())
                .andExpect(content().string("Fail"))
                .andDo(MockMvcResultHandlers.print());
    }


}