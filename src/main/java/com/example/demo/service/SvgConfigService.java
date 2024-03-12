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
