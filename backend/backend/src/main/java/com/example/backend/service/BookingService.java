package com.example.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.model.Booking;
import com.example.backend.repository.BookingRepository;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    // Create a new booking
    public Booking createBooking(Booking booking) {
        booking.setStatus("CONFIRMED");
        booking.setBookingDate(LocalDateTime.now());
        return bookingRepository.save(booking);
    }
    
    // Get all bookings for a user
    public List<Booking> getUserBookings(String userEmail) {
        return bookingRepository.findByUserEmail(userEmail);
    }
    
    // Get booking by ID
    public Optional<Booking> getBookingById(String bookingId) {
        return bookingRepository.findById(bookingId);
    }
    
    // Cancel a booking
    public Booking cancelBooking(String bookingId, String reason) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        
        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }
        
        Booking booking = bookingOpt.get();
        
        if ("CANCELLED".equals(booking.getStatus())) {
            throw new RuntimeException("Booking is already cancelled");
        }
        
        booking.setStatus("CANCELLED");
        booking.setCancellationDate(LocalDateTime.now());
        booking.setCancellationReason(reason);
        
        return bookingRepository.save(booking);
    }
    
    // Get all bookings (admin)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    // Get confirmed bookings only
    public List<Booking> getConfirmedBookings(String userEmail) {
        return bookingRepository.findByUserEmailAndStatus(userEmail, "CONFIRMED");
    }
}
