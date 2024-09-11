package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
@Data
@Document(collection = "Emo_Notification")
public class NotificationEntity {

    @Id
    @JsonProperty("userId")
    private String userId;

    @JsonProperty("notifyList")
    private List<String> notifyList;

    public NotificationEntity() {

    }

    public NotificationEntity(String userId) {
        this.userId = userId;
        notifyList = new ArrayList<>();
    }

    public NotificationEntity(String userId, List<String> notifyList) {
        this.userId = userId;
        this.notifyList = notifyList;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<String> getNotifyList() {
        return notifyList;
    }

    public void setNotifyList(List<String> notifyList) {
        this.notifyList = notifyList;
    }
}
