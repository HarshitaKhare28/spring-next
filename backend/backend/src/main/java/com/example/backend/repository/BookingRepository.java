package com.example.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.model.Booking;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserEmail(String userEmail);
    List<Booking> findByStatus(String status);
    List<Booking> findByUserEmailAndStatus(String userEmail, String status);
}
