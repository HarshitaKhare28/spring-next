package com.example.backend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.model.Review;
import com.example.backend.repository.ReviewRepository;

@RestController
@RequestMapping("/api/hotels/{hotelId}/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping
    public ResponseEntity<?> listReviews(@PathVariable Long hotelId) {
        try {
            List<Review> reviews = reviewRepository.findByHotelIdOrderByCreatedAtDesc(hotelId);
            return ResponseEntity.ok(reviews.stream().map(r -> new ReviewDto(r)).collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Failed to fetch reviews: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createReview(@PathVariable Long hotelId, @RequestBody CreateReviewRequest req) {
        try {
            Review r = new Review();
            r.setHotelId(hotelId);
            r.setUserName(req.getUserName());
            r.setRating(req.getRating());
            r.setText(req.getText());
            r.setCreatedAt(LocalDateTime.now());
            Review saved = reviewRepository.save(r);
            return ResponseEntity.ok(new ReviewDto(saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Failed to save review: " + e.getMessage()));
        }
    }

    static class CreateReviewRequest {
        private String userName;
        private int rating;
        private String text;

        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
        public int getRating() { return rating; }
        public void setRating(int rating) { this.rating = rating; }
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
    }

    static class ReviewDto {
        public String id;
        public Long hotelId;
        public String userName;
        public int rating;
        public String text;
        public String createdAt;

        public ReviewDto(Review r) {
            this.id = r.getId();
            this.hotelId = r.getHotelId();
            this.userName = r.getUserName();
            this.rating = r.getRating();
            this.text = r.getText();
            this.createdAt = r.getCreatedAt() != null ? r.getCreatedAt().toString() : null;
        }
    }

    static class ErrorResponse {
        private String error;

        public ErrorResponse(String error) { this.error = error; }
        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
    }
}
