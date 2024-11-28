package com.example.demo.Controller;

import com.example.demo.Model.Farm;
import com.example.demo.Repository.FarmRepository;
import com.example.demo.Service.FarmService; // Đảm bảo import FarmService

import java.util.HashMap;
import java.util.Map;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class FarmController {

    @Autowired
    private FarmRepository farmRepository;

    @Autowired
    private FarmService farmService; // Khai báo farmService

    // Thêm trại nuôi mới
    @PostMapping("/addfarm")
    public ResponseEntity<?> addFarm(@RequestBody Farm farm) {
        // Kiểm tra xem tên farm đã tồn tại chưa
        if (farmRepository.existsByNamefarm(farm.getNamefarm())) {
            return ResponseEntity.badRequest().body("Farm with this name already exists.");
        }

        // Lưu farm vào cơ sở dữ liệu
        Farm savedFarm = farmService.saveFarm(farm);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("farm", savedFarm);
        // Trả về thông tin của farm đã lưu
        return ResponseEntity.ok(response);
    }

    // Láy thông tin trại nuôi
    @GetMapping("/farms")
    public ResponseEntity<List<Farm>> getFarmsByUsername(@RequestParam String username) {
        List<Farm> farms = farmService.getFarmsByUsername(username);
        return ResponseEntity.ok(farms);
    }

    // Chức năng xóa trại nuôi
    @DeleteMapping("/farms/{namefarm}")
    public ResponseEntity<String> deleteFarm(@PathVariable String namefarm) {
        try {
            farmService.deleteFarm(namefarm);
            return ResponseEntity.ok("Trại nuôi đã được xóa thành công.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi xóa trại nuôi.");
        }
    }

    // Cập nhật phương thức để chấp nhận cả `namefarm` và `username`
    @PutMapping("/farms/{namefarm}")
    public ResponseEntity<String> updateFarm(
            @PathVariable String namefarm,
            @RequestBody Farm updatedFarm) {

        boolean isUpdated = farmService.updateFarm(namefarm, updatedFarm);
        if (isUpdated) {
            return ResponseEntity.ok("Cập nhật trại nuôi thành công.");
        } else {
            return ResponseEntity.badRequest().body("Trại nuôi không tồn tại hoặc không thể cập nhật.");
        }
    }
}
