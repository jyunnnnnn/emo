package com.example.demo.entity;

//每個紀錄都會有的資訊
public class Record {
    public Record(String index, String name, double coefficient, String unit, String baseline) {
        this.index = index;
        this.name = name;
        this.coefficient = coefficient;
        this.unit = unit;
        this.baseline = baseline;
    }

    //減碳紀錄索引
    private String index;
    //減碳紀錄名稱
    private String name;
    //係數
    private double coefficient;
    //單位
    private String unit;
    //每個減碳紀錄都有其對應的基準
    private String baseline;

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

    @Override
    public String toString() {
        return "Record{" +
                "index='" + index + '\'' +
                ", name='" + name + '\'' +
                ", coefficient=" + coefficient +
                ", unit='" + unit + '\'' +
                ", baseline='" + baseline + '\'' +
                '}';
    }

    public void setBaseline(String baseline) {
        this.baseline = baseline;
    }
}
