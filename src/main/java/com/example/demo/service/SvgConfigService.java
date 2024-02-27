package com.example.demo.service;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
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


}
