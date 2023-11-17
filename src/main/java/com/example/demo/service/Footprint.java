package com.example.demo.service;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Emo_Footprint")
public class Footprint {
        private String type;//紀錄項目 (EX:環保杯)
        private double coefficient;//碳足跡

        //constructor
        public Footprint( String type, double coefficient) {
            this.type = type;
            this.coefficient= coefficient;
        }

    public double getCoefficient() {
        return coefficient;
    }

    public String getType() {
        return type;
    }

    public void setCoefficient(double coefficient) {
        this.coefficient = coefficient;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String toString(){
            return "{" + '\n'+
                    "recordId: " + type + '\n'+
                    "userId: " + coefficient  +'\n'+"}";

    }
}
