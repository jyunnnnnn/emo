package com.example.demo.service;

import java.util.Map;

//設定檔Wrapper物件
public class ConfigurationWrapper {
    //所有減碳紀錄類別 EX:日常用品:所有日常用品紀錄事項
    private Map<String, RecordWrapper> RecordCategory;
    private Map<String, String> setting;

    public Map<String, String> getSetting() {
        return this.setting;
    }

    public Map<String, RecordWrapper> getRecordCategory() {
        return RecordCategory;
    }

    public void setRecordCategory(Map<String, RecordWrapper> recordCategory) {
        RecordCategory = recordCategory;
    }

    //輸出格式
    @Override
    public String toString() {
        String result = "";

        for (String key : RecordCategory.keySet()) {
            result += key;
            result += ": \n" + RecordCategory.get(key);
            result += "\n";
        }

        return result;
    }
}
