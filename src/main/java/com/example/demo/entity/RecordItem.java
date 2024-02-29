package com.example.demo.entity;

import com.example.demo.entity.Record;

import java.util.Map;

public class RecordItem extends Record {

    private Map<String, Double> option;

    public RecordItem(String index, String name, double coefficient, String unit, String baseline, Map<String, Double> option, String color) {
        super(index, name, coefficient, unit, baseline, color);
        this.option = option;
    }

    public RecordItem(String index, String name, double coefficient, String unit, String baseline, String color) {
        super(index, name, coefficient, unit, baseline, color);
    }

    public Map<String, Double> getOption() {
        return option;
    }

    public void setOption(Map<String, Double> option) {
        this.option = option;
    }

    @Override
    public String toString() {
        return "DailyRecordItem{" + "\n" +
                 super.toString() + "\n" +
                "option=" + option +
                '}';
    }
}
