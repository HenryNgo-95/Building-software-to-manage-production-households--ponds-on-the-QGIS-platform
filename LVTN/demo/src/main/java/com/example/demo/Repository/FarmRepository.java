package com.example.demo.Repository;

import java.util.List;

import com.example.demo.Model.Farm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FarmRepository extends JpaRepository<Farm, String> {
    // Bạn có thể thêm các phương thức tùy chỉnh nếu cần
    boolean existsByNamefarm(String namefarm); // Kiểm tra sự tồn tại của farm dựa trên nameFarm

    List<Farm> findByUsername(String username); // Lấy danh sách farm theo username
}
