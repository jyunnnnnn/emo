package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

//每個紀錄都會有的資訊
public class Record {
    public Record(String index, String name, double coefficient, String unit, String baseline, String color,String description) {
        this.index = index;
        this.name = name;
        this.coefficient = coefficient;
        this.unit = unit;
        this.baseline = baseline;
        this.color = color;
        this.description=description;
    }
    public Record() {

    }
    //減碳紀錄索引
    @JsonProperty("index")
    private String index;
    //減碳紀錄名稱
    @JsonProperty("name")
    private String name;
    //係數
    @JsonProperty("coefficient")
    private double coefficient;
    //單位
    @JsonProperty("unit")
    private String unit;
    //每個減碳紀錄都有其對應的基準
    @JsonProperty("baseline")
    private String baseline;
    //每個行為有自己的顏色
    @JsonProperty("color")
    private String color;
    @JsonProperty("description")
    private String description;



    public String getIndex() {
        return index;
    }

    public void setIndex(String index) {
        this.index = index;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getCoefficient() {
        return coefficient;
    }

    public void setCoefficient(double coefficient) {
        this.coefficient = coefficient;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getBaseline() {
        return baseline;
    }

    public String getColor() {return color;}

    public String getDescription() {return description;}

    public void setColor(String color) {this.color = color;}

    public void setDescription(String description) {this.description = description;}

    @Override
    public String toString() {
        return "Record{" +
                "index='" + index + '\'' +
                ", name='" + name + '\'' +
                ", coefficient=" + coefficient +
                ", unit='" + unit + '\'' +
                ", baseline='" + baseline + '\'' +
                ", description='" + description + '\'' +
                '}';
    }

    public void setBaseline(String baseline) {
        this.baseline = baseline;
    }
}
