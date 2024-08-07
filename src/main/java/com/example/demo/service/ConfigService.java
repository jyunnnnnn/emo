package com.example.demo.service;

import com.example.demo.entity.RecordItem;
import com.example.demo.entity.UpdateRecordClassBaseRequest;
import com.example.demo.entity.UpdateRecordClassColorRequest;
import com.example.demo.entity.updateRecordRequest;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
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
    private final String jsonPath = "src/main/resources/config.json";

    //獨取設定檔案
    private final FileReader configFile = new FileReader(jsonPath);
    ConfigurationWrapper record = gson.fromJson(configFile, ConfigurationWrapper.class);

    @Autowired
    private SvgConfigService svgConfigService;

    public ConfigService() throws FileNotFoundException {
    }


    //獲取所有減碳紀錄事項Json字串
    public String getAllRecordJson() {
        return gson.toJson(record.getRecordCategory());
    }

    public Map<String, RecordWrapper> getRecordConfigurationObj() {
        return this.record.getRecordCategory();
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


    //更新大類別
    public void updateRecordClass(String categoryName, updateRecordRequest req) throws FileNotFoundException {
        //更新設定檔內容物件
        Map<String, RecordWrapper> t1 = record.getRecordCategory();//獲取原減碳紀錄內容
        RecordWrapper t2 = t1.get(categoryName);//獲取目標類別
        List<RecordItem> contents = t2.getContent();
        RecordItem target = null;
        //flag:true 新增 flag:false 更新
        boolean flag = true;
        for (int i = 0; i < contents.size(); i++) {
            if (contents.get(i).getIndex().equals(req.getContent().getIndex())) {
                target = contents.get(i);
                contents.set(i, req.getContent());
                flag = false;
                break;
            }
        }

        if (flag) {
            //為新增紀錄
            contents.add(req.getContent());
        } else {
            //更新紀錄，刪除原svg內容

            this.svgConfigService.deleteClass(categoryName, target);
        }
        //更新該類別的content
        t2.setContent(contents);
        t1.replace(categoryName, t2);
        //刪除其對應的svg資料

        //更新svg設定檔
        this.svgConfigService.adminPageUpdateContentSvg(categoryName, req.getSvg(), req.getContent().getName(), req.getContent().getIndex());

        record.setRecordCategory(t1);
        //修改設定檔文件
        String newJsonStr = gson.toJson(record);
        updateConfiguration(newJsonStr);
    }

    //更新大類別顏色
    public void updateRecordClassColor(String categoryName, UpdateRecordClassColorRequest req) {

        Map<String, RecordWrapper> t1 = record.getRecordCategory();//獲取原減碳紀錄內容
        RecordWrapper t2 = t1.get(categoryName);//獲取目標類別
        //設定新顏色
        t2.setColor(req.getColor());
        //取代原本的顏色
        t1.replace(categoryName, t2);

        record.setRecordCategory(t1);
        //修改設定檔文件
        String newJsonStr = gson.toJson(record);
        updateConfiguration(newJsonStr);
    }

    //更新大類別基準
    public void updateRecordClassBase(String categoryName, UpdateRecordClassBaseRequest req) {
        Map<String, RecordWrapper> t1 = record.getRecordCategory();//獲取原減碳紀錄內容
        RecordWrapper t2 = t1.get(categoryName);//獲取目標類別
        Map<String, Double> newBase = t2.getBase();
        for (String key : req.getBase().keySet()) {
            newBase.put(key, req.getBase().get(key));
        }

        t2.setBase(newBase);
        //取代原本的顏色
        t1.replace(categoryName, t2);

        record.setRecordCategory(t1);
        //修改設定檔文件
        String newJsonStr = gson.toJson(record);
        updateConfiguration(newJsonStr);
    }

    //刪除特定紀錄項目
    public void deleteRecordContent(String index) throws FileNotFoundException {

        //刪除類別設定檔特定內容
        Map<String, RecordWrapper> t1 = record.getRecordCategory();//獲取原減碳紀錄內容
        RecordItem target = null;
        String targetClassName = null;
        for (String key : t1.keySet()) {
            boolean flag = false;
            RecordWrapper t2 = t1.get(key);
            List<RecordItem> contents = t2.getContent();
            for (int i = 0; i < contents.size(); i++) {
                //找到目標
                if (contents.get(i).getIndex().equals(index)) {
                    targetClassName = key;
                    target = contents.get(i);
                    contents.remove(i);
                    t2.setContent(contents);
                    //取代原本的顏色
                    t1.replace(targetClassName, t2);

                    record.setRecordCategory(t1);
                    //修改設定檔文件
                    String newJsonStr = gson.toJson(record);
                    updateConfiguration(newJsonStr);
                    flag = true;
                    break;
                }
            }
            if (flag)
                break;
        }

        //刪除其對應的svg資料
        this.svgConfigService.deleteClass(targetClassName, target);
    }

    //刪除特定大類別的基準
    public void deleteRecordBase(String categoryName, List<String> targets) {
        Map<String, RecordWrapper> t1 = record.getRecordCategory();//獲取原減碳紀錄內容
        RecordWrapper t2 = t1.get(categoryName);//獲取目標類別
        Map<String, Double> newBase = t2.getBase();

        for (String target : targets) {
            newBase.remove(target);
        }

        t2.setBase(newBase);
        //取代原本的顏色
        t1.replace(categoryName, t2);

        record.setRecordCategory(t1);
        //修改設定檔文件
        String newJsonStr = gson.toJson(record);
        updateConfiguration(newJsonStr);
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
