package com.example.demo.service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.PrintStream;

//設定檔Service物件
@Service
public class ConfigService {

    //Gson檢析物件創建
    private GsonBuilder builder = new GsonBuilder();
    private Gson gson = builder.setPrettyPrinting().create();

    //json設定檔路徑
    private String jsonPath = "src/main/resources/config.json";

    //獨取設定檔案
    private FileReader configFile = new FileReader(jsonPath);

    //json內容解析成java物件
    ConfigurationWrapper record = gson.fromJson(configFile, ConfigurationWrapper.class);


    public ConfigService() throws FileNotFoundException {
    }



    //獲取所有減碳紀錄事項Json字串
    public String getAllRecordJson() {
        return gson.toJson(record.getRecordCategory());
    }

    public String test() {
        return gson.toJson(record.getSetting());
    }


}
