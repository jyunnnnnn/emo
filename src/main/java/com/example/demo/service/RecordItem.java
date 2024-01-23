package com.example.demo.service;

import java.util.Map;

public class RecordItem extends Record {

    private Map<String, Double> option;

    public RecordItem(String index, String name, double coefficient, String unit, String baseline, Map<String, Double> option) {
        super(index, name, coefficient, unit, baseline);
        this.option = option;
    }

    public RecordItem(String index, String name, double coefficient, String unit, String baseline) {
        super(index, name, coefficient, unit, baseline);
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
