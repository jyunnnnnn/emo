package com.example.demo.controller;

import com.example.demo.entity.RankEntity;
import com.example.demo.entity.RankInitReturnEntity;
import com.example.demo.repository.RankRepository;
import com.example.demo.service.RankService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/rank")
public class RankController {


    private RankService rankService;

    private RankRepository rankRepository;

    @Autowired
    public RankController(RankService rankService, RankRepository rankRepository) {
        this.rankRepository = rankRepository;
        this.rankService = rankService;
    }

    @GetMapping("/getRankObj")
    public ResponseEntity<?> getRankInitObj() throws JsonProcessingException {

        List<RankInitReturnEntity> res = this.rankService.getUsersRankingInfo();

        return ResponseEntity.ok(res);
    }

    @PutMapping("/updateRankObj")
    public ResponseEntity<?> updateRankObj() {
        //回傳物件之前先做物件更新
        this.rankService.updateRankObject();
        //回傳rank物件和rank使用者物件
        List<RankInitReturnEntity> res = this.rankService.getUsersRankingInfo();

        return ResponseEntity.ok(res);
    }


    //回傳排行等級物件陣列
    @GetMapping("/getUsersRankData")
    public ResponseEntity<?> getUsersRankData() {
        return ResponseEntity.ok(this.rankService.getAllRank());
    }

    @PostMapping("/addRank")
    public ResponseEntity<?> addRank(@RequestBody RankEntity rankEntity) {

        this.rankService.addRank(rankEntity);

        return ResponseEntity.ok("Insert Success");
    }
}
