package com.example.demo.entity;

import com.example.demo.entity.Record;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public class RecordItem extends Record {

    @JsonProperty("option")
    private Map<String, Double> option;

    public RecordItem(String index, String name, double coefficient, String unit, String baseline, Map<String, Double> option, String color, String description) {
        super(index, name, coefficient, unit, baseline, color, description);
        this.option = option;
    }

    public RecordItem(String index, String name, double coefficient, String unit, String baseline, String color, String description) {
        super(index, name, coefficient, unit, baseline, color, description);
    }

    public RecordItem(String index, String name, double coefficient, String unit, String baseline, String color, String description, Map<String, Double> option) {
        super(index, name, coefficient, unit, baseline, color, description);
        this.option = option;
    }

    public RecordItem() {

    }

    public Map<String, Double> getOption() {
        return option;
    }

    public void setOption(Map<String, Double> option) {
        this.option = option;
    }

    @Override
    public String toString() {
        String name = this.option == null ? "TransportationRecordItem" : "DailyRecordItem";
        return name + "{" + "\n" +
                super.toString() + "\n" +
                "option=" + option +
                '}';
    }
}
