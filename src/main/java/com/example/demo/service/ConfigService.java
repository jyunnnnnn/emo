package com.example.demo.service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//設定檔Service物件
@Service
public class ConfigService {
    public static int CATEGORY_NOT_EXIST = 1;
    public static int OK = 0;
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

    //新增或更新一個新(舊)紀錄項目到特定類別
    public int updateNewContent(String category, RecordItem newItem) throws IOException {
        //更新設定檔內容物件
        Map<String, RecordWrapper> t1 = record.getRecordCategory();//獲取原減碳紀錄內容
        //不存在此類別
        if (!t1.containsKey(category)) {
            return CATEGORY_NOT_EXIST;
        }

        RecordWrapper t2 = t1.get(category);//獲取目標類別

        List<RecordItem> content = t2.getContent();

        //遍歷目標項目是否存在
        for (RecordItem element : content) {
            if (element.getIndex() == newItem.getIndex()) {//將目標項目從List中移除
                content.remove(element);
                break;
            }
        }
        content.add(newItem);
        t2.setContent(content);
        t1.replace(category, t2);
        record.setRecordCategory(t1);
        //修改設定檔文件
        String newJsonStr = gson.toJson(record);
        updateConfiguration(newJsonStr);

        return OK;
    }

    public String test() {
        return gson.toJson(record.getSetting());
    }


    //寫入設定檔
    private void updateConfiguration(String newJsonString) {
        File file = new File(jsonPath);
        BufferedWriter writer = null;
        try {
            writer = new BufferedWriter(new FileWriter(file));
            writer.write(newJsonString);
            writer.close();
        } catch (IOException err) {
            throw new RuntimeException(err);
        }
    }


}
