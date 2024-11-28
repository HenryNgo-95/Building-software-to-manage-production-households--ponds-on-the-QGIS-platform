package com.example.demo.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Model.Pond;
import com.example.demo.Model.PondRequest;
import com.example.demo.Model.PondResponse;
import com.example.demo.Repository.PondRepository;

import jakarta.transaction.Transactional;

@Service
public class PondService {
    @Autowired
    private PondRepository pondRepository;

    // Lưu ao nuôi vào csdl
    @Transactional
    public void savePond(PondRequest pondRequest) {
        pondRepository.savePond(
                pondRequest.getNamefarm(),
                pondRequest.getNamepond(),
                pondRequest.getAddress(),
                "SRID=4326;" + pondRequest.getGeom(), // Chuỗi WKT có SRID
                pondRequest.getUsername(),
                pondRequest.getManager());
    }

    // Xử lý lấy thông tin ao nuôi
    public List<PondResponse> getPondsByUsername(String username) {
        List<Object[]> results = pondRepository.findPondsByUsername(username);
        List<PondResponse> responses = new ArrayList<>();

        for (Object[] row : results) {
            responses.add(new PondResponse(
                    ((Long) row[0]), // id
                    (String) row[1], // namepond
                    (String) row[2], // namefarm
                    (String) row[3], // geom (WKT)
                    (String) row[4], // username
                    (String) row[5], // address
                    (String) row[6] // manager
            ));
        }
        return responses;
    }

    // Xóa ao nuôi
    @Transactional
    public void deletePond(Long id) {
        pondRepository.deleteById(id); // Xóa ao theo ID
    }

    // Cập nhật thông tin ao nuôi
    @Transactional
    public boolean updatePond(PondRequest pondRequest) {
        Optional<Pond> optionalPond = pondRepository.findById(pondRequest.getId());
        if (optionalPond.isPresent()) {
            Pond pond = optionalPond.get();
            pond.setNamepond(pondRequest.getNamepond());
            pond.setAddress(pondRequest.getAddress());
            pond.setManager(pondRequest.getManager());
            pondRepository.save(pond); // Lưu thông tin cập nhật
            return true;
        }
        return false;
    }
}
