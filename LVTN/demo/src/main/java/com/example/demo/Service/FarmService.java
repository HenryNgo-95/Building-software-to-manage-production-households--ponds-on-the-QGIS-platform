package com.example.demo.Service;

import java.util.List;

import com.example.demo.Model.Farm;
import com.example.demo.Repository.FarmRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FarmService {
    @Autowired
    private FarmRepository farmRepository;

    // Lưu farm vào csdl
    public Farm saveFarm(Farm farm) {
        return farmRepository.save(farm);
    }

    public List<Farm> getFarmsByUsername(String username) {
        return farmRepository.findByUsername(username);
    }

    // Chức năng xóa trại nuôi
    public void deleteFarm(String namefarm) {
        farmRepository.deleteById(namefarm);
    }

    // Chức năng cập nhật thông tin trại nuôi
    @Transactional
    public boolean updateFarm(String namefarm, Farm updatedFarm) {
        return farmRepository.findById(namefarm).map(existingFarm -> {
            existingFarm.setUsername(updatedFarm.getUsername());
            existingFarm.setPhone(updatedFarm.getPhone());
            existingFarm.setFarming(updatedFarm.getFarming());
            existingFarm.setManager(updatedFarm.getManager());
            existingFarm.setAddress(updatedFarm.getAddress());
            existingFarm.setObj(updatedFarm.getObj());
            farmRepository.save(existingFarm);
            return true;
        }).orElse(false);
    }
}