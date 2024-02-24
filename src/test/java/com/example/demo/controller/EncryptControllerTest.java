package com.example.demo.controller;

import com.example.demo.service.EcoRecordService;
import com.example.demo.service.EncryptService;
import com.google.gson.Gson;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
/*
    加密相關資訊controller 測試
 */

@SpringBootTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@DisplayName("Encrypt Controller Test")
class EncryptControllerTest {

    private EncryptService encryptService = new EncryptService();

    @Autowired
    private MockMvc mockMvc;

    private String key;
    private String iv;

    @BeforeEach
    public void setUp() {
        key = encryptService.getKey();
        iv = encryptService.getIv();
    }

    /*
        獲取加密金鑰和iv值
     */
    @Test
    @DisplayName("Get Encrypt Key and IV Test")
    void getEncryptKey() throws Exception {
        MvcResult result =
                mockMvc.perform(get("/api/getEncryptKey"))
                        .andExpect(status().isOk())
                        .andDo(MockMvcResultHandlers.print())
                        .andReturn();

        String str = result.getResponse().getContentAsString();
        Gson gson = new Gson();
        Map<String, String> mp = new HashMap<>();
        mp = gson.fromJson(str, Map.class);
        //測試回傳key和iv值
        assertEquals(mp.get("key"), key);
        assertEquals(mp.get("iv"), iv);
    }
}