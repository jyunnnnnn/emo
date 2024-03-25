package com.example.demo.service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.HashMap;
import java.util.Map;

@Service
public class SvgConfigService {
    private final GsonBuilder builder = new GsonBuilder();
    private final Gson gson = builder.setPrettyPrinting().create();
    private final String jsonPath = "src/main/resources/SvgConfig.json";

    public SvgConfigService() throws FileNotFoundException {
    }

    public String getAllSvgJson() {
        try {
            FileReader svgConfigFile = new FileReader(jsonPath);  // 在每次調用時重新讀取檔案
            SvgConfigurationWrapper svgConfiguration = gson.fromJson(svgConfigFile, SvgConfigurationWrapper.class);
            return gson.toJson(svgConfiguration);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            return null;
        }
    }


    //修改svg設定檔內容
    public void updateSvg(String className, Map<String, String> newContent) throws FileNotFoundException {
        FileReader svgConfigFile = new FileReader(jsonPath);  // 在每次調用時重新讀取檔案

        SvgConfigurationWrapper svgConfiguration = gson.fromJson(svgConfigFile, SvgConfigurationWrapper.class);
        //設定檔原本內容
        Map<String, Map<String, String>> content = svgConfiguration.getSvgImages();

        //將新內容新增或修改到設定黨內
        for (String contentName : newContent.keySet()) {
            content.get(className).put(contentName, newContent.get(contentName));
        }
        svgConfiguration.setSvgImages(content);
        String jsonStr = gson.toJson(svgConfiguration);

        updateConfiguration(jsonStr);

    }

    //管理員頁面更新content svg設定檔內容
    public void adminPageUpdateSvg(String categoryName, Map<String, String> newSvg, String contentName, String index) throws FileNotFoundException {


        //根據類別呼叫對應的function
        if (categoryName == "daily") {
            dailyClassHandler(newSvg, contentName);
        } else if (categoryName == "transportation") {
            transportationClassHandler(newSvg, contentName, index);
        }

    }

    //處理daily svg設定檔內容
    private void dailyClassHandler(Map<String, String> newSvg, String contentName) throws FileNotFoundException {
        //修改svg recordList內容

        FileReader svgConfigFile = new FileReader(jsonPath);  // 在每次調用時重新讀取檔案

        SvgConfigurationWrapper svgConfiguration = gson.fromJson(svgConfigFile, SvgConfigurationWrapper.class);
        //設定檔原本內容
        Map<String, Map<String, String>> content = svgConfiguration.getSvgImages();

        //修改recordList內容
        content.get("recordList").put(contentName, newSvg.get("recordList"));


        //寫入設定檔
        svgConfiguration.setSvgImages(content);
        String jsonStr = gson.toJson(svgConfiguration);

        updateConfiguration(jsonStr);

    }

    //處理transportation svg設定檔內容
    private void transportationClassHandler(Map<String, String> newSvg, String contentName, String index) throws FileNotFoundException {
        //修改svg recordList內容

        FileReader svgConfigFile = new FileReader(jsonPath);  // 在每次調用時重新讀取檔案

        SvgConfigurationWrapper svgConfiguration = gson.fromJson(svgConfigFile, SvgConfigurationWrapper.class);
        //設定檔原本內容
        Map<String, Map<String, String>> content = svgConfiguration.getSvgImages();

        //修改recordList內容
        content.get("recordList").put(contentName, newSvg.get("recordList"));

        String hover = index + "Hover";
        String icon = index + "Icon";

        //修改transportation 該content的hover
        content.get("transportation").put(hover, newSvg.get("hover"));
        //修改transportation 該content的icon
        content.get("transportation").put(icon, newSvg.get("icon"));
        content.get("marker").put(contentName, newSvg.get("marker"));

        //寫入設定檔
        svgConfiguration.setSvgImages(content);
        String jsonStr = gson.toJson(svgConfiguration);

        updateConfiguration(jsonStr);
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
