package com.klef.soa.docker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.klef.soa.docker.entity.CarWash;

public interface CarWashRepository extends JpaRepository<CarWash, Long> {
	
}
