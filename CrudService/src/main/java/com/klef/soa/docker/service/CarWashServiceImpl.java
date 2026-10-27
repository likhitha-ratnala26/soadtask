package com.klef.soa.docker.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.soa.docker.entity.CarWash;
import com.klef.soa.docker.repository.CarWashRepository;
import com.klef.soa.docker.service.CarWashService;

@Service
public class CarWashServiceImpl implements CarWashService {

    @Autowired
    private CarWashRepository repo;

    @Override
    public CarWash addCarWash(CarWash c) {
        c.setId(null);
        return repo.save(c);
    }

    @Override
    public CarWash updateCarWash(Long id, CarWash c) {
        CarWash existing = repo.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("CarWash ID not found"));

        existing.setServiceName(c.getServiceName());
        existing.setWashType(c.getWashType());
        existing.setPrice(c.getPrice());
        existing.setOpen(c.getOpen());

        return repo.save(existing);
    }

    @Override
    public List<CarWash> displayAllCarWash() {
        return repo.findAll();
    }

    @Override
    public CarWash displayCarWashById(Long id) {
        return repo.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("CarWash ID not found"));
    }

    @Override
    public String deleteCarWashById(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return "CarWash deleted successfully";
        }

        throw new RuntimeException("CarWash ID not found");
    }
}
