package com.example.demo.service;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Emo_Footprint")
public class Footprint {
        @Id
        private String FPId;
        private String type;//紀錄項目 (EX:環保杯)
        private double coefficient;//碳足跡

        //constructor
        public Footprint( String FPId, String type, double coefficient) {
            this.FPId = FPId;
            this.type = type;
            this.coefficient= coefficient;
        }

    public String getFPId() {return FPId;}

    public void setFPId(String FPId) {this.FPId = FPId;}

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
                    "Id: "+FPId + '\n'+
                    "type: " + type + '\n'+
                    "coefficient: " + coefficient  +'\n'+"}";

    }
}
