package com.klef.soa.docker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.klef.soa.docker.entity.CarWash;
import com.klef.soa.docker.service.CarWashService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/carwash")
@CrossOrigin(origins = {
	    "http://localhost:5173",
	    "http://localhost:5174"
	})
public class CarWashController {

    @Autowired
    private CarWashService service;

    @GetMapping("/")
    public String demo() {
        return "CarWash Management System is running!";
    }

    // 1. ADD
    @PostMapping("/add")
    public ResponseEntity<CarWash> addCarWash(
            @Valid @RequestBody CarWash c) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.addCarWash(c));
    }

    // 2. UPDATE
    @PutMapping("/update/{id}")
    public ResponseEntity<CarWash> updateCarWash(
            @PathVariable Long id,
            @Valid @RequestBody CarWash c) {

        return ResponseEntity.ok(service.updateCarWash(id, c));
    }

    // 3. DISPLAY ALL
    @GetMapping("/displayall")
    public ResponseEntity<List<CarWash>> displayAllCarWash() {
        return ResponseEntity.ok(service.displayAllCarWash());
    }

    // 4. DISPLAY BY ID
    @GetMapping("/displaybyid/{id}")
    public ResponseEntity<CarWash> displayCarWashById(
            @PathVariable Long id) {

        return ResponseEntity.ok(service.displayCarWashById(id));
    }

    // 5. DELETE BY ID
    @DeleteMapping("/deletebyid/{id}")
    public ResponseEntity<String> deleteCarWashById(
            @PathVariable Long id) {

        return ResponseEntity.ok(service.deleteCarWashById(id));
    }
}
