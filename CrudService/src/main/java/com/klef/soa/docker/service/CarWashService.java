package com.klef.soa.docker.service;

import java.util.List;
import com.klef.soa.docker.entity.CarWash;

public interface CarWashService {

    CarWash addCarWash(CarWash c);

    CarWash updateCarWash(Long id, CarWash c);

    List<CarWash> displayAllCarWash();

    CarWash displayCarWashById(Long id);

    String deleteCarWashById(Long id);
}
