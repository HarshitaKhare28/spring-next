package com.example.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "http://localhost:3000")
public class LocalHotelController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping
    public ResponseEntity<?> getAllSeededHotels() {
        try {
            List<Map> hotels = mongoTemplate.findAll(Map.class, "hotels");
            return ResponseEntity.ok(hotels);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "failed to read hotels from DB", "details", e.getMessage()));
        }
    }
}
