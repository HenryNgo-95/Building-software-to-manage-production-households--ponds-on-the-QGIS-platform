package com.example.demo.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.PondRequest;
import com.example.demo.Model.PondResponse;
import com.example.demo.Model.ResponseMessage;
import com.example.demo.Service.PondService;

@RestController
@RequestMapping("/api")
public class PondController {
    @Autowired
    private PondService pondService;

    // Chức năng thêm ao nuôi mới
    @PostMapping("/addpond")
    public ResponseEntity<?> addPond(@RequestBody PondRequest pondRequest) {
        try {
            pondService.savePond(pondRequest);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error saving pond: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Endpoint để lấy tất cả thông tin ao nuôi
    @GetMapping("/ponds")
    public ResponseEntity<List<PondResponse>> getPondsByUsername(@RequestParam("username") String username) {
        List<PondResponse> ponds = pondService.getPondsByUsername(username);
        return ResponseEntity.ok(ponds);
    }

    // API xóa ao nuôi
    @DeleteMapping("/deletepond/{id}")
    public ResponseEntity<?> deletePond(@PathVariable Long id) {
        try {
            pondService.deletePond(id); // Gọi Service để xóa ao
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Pond deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error deleting pond: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Cập nhật ao nuôi
    @PutMapping("/updatepond")
    public ResponseEntity<ResponseMessage> updatePond(@RequestBody PondRequest pondRequest) {
        try {
            boolean updated = pondService.updatePond(pondRequest);
            if (updated) {
                return ResponseEntity.ok(new ResponseMessage("Cập nhật ao nuôi thành công!", true));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseMessage("Không tìm thấy ao nuôi!", false));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseMessage("Lỗi khi cập nhật ao nuôi: " + e.getMessage(), false));
        }
    }
}