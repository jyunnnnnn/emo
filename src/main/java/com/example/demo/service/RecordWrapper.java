package com.example.demo.service;

import com.example.demo.entity.RecordItem;

import java.util.List;
import java.util.Map;

//減碳紀錄類別物件 含比較基準以及此類別的所有減碳紀錄事項
public class RecordWrapper {
    private Map<String, Double> base;
    private String color;
    private Map<String, String> units;

    public Map<String, String> getUnits() {
        return units;
    }

    public void setUnits(Map<String, String> units) {
        this.units = units;
    }

    public Map<String, Double> getBase() {
        return base;
    }

    public void setBase(Map<String, Double> base) {
        this.base = base;
    }

    public List<RecordItem> getContent() {
        return content;
    }

    public void setContent(List<RecordItem> content) {
        this.content = content;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    private List<RecordItem> content;
    private String name;

    @Override
    public String toString() {
        return "RecordWrapper{" +
                "base=" + base +
                ", color='" + color + '\'' +
                ", units=" + units +
                ", content=" + content +
                ", name='" + name + '\'' +
                '}';
    }
}
