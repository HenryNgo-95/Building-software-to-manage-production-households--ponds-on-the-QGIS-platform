// Thêm ao nuôi mới
document.addEventListener("DOMContentLoaded", function () {
    const mapContainer = document.getElementById('pondMap');
    const username = localStorage.getItem('username');
    const addPondForm = document.getElementById('add_pond_form');
    let pondMap;
    let polygonLayer = null;

    // Kiểm tra nếu username tồn tại
    if (!username) {
        alert('Vui lòng đăng nhập để xem danh sách ao nuôi.');
        window.location.href = 'dkdn.html';
        return;
    }

    // Tải danh sách trại theo username
    fetch(`http://localhost:8081/api/farms?username=${username}`)
        .then(response => response.json())
        .then(data => {
            const farmSelect = document.getElementById('namefarm');
            farmSelect.innerHTML = '';
            data.forEach(farm => {
                const option = document.createElement('option');
                option.value = farm.namefarm;
                option.text = farm.namefarm;
                farmSelect.appendChild(option);
            });
            if (data.length > 0) farmSelect.selectedIndex = 0;
        })
        .catch(error => console.error('Error fetching farms:', error));

    // Khởi tạo bản đồ
    if (!pondMap) {
        pondMap = L.map(mapContainer).setView([9.7499, 105.1000], 10);
        L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20,
        }).addTo(pondMap);
    }

    // Xử lý khi gửi form thêm ao
    addPondForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const namefarm = document.getElementById('namefarm').value;
        const namepond = document.getElementById('namepond').value;
        const address = document.getElementById('address').value;
        const manager = document.getElementById('username_pond').value;

        const lat1 = parseFloat(document.getElementById('lat1').value);
        const lng1 = parseFloat(document.getElementById('lng1').value);
        const lat2 = parseFloat(document.getElementById('lat2').value);
        const lng2 = parseFloat(document.getElementById('lng2').value);

        if (isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2)) {
            alert('Vui lòng nhập đầy đủ tọa độ!');
            return;
        }

        // Chuỗi WKT Polygon
        const geomWkt = `POLYGON((${lng1} ${lat1}, ${lng2} ${lat1}, ${lng2} ${lat2}, ${lng1} ${lat2}, ${lng1} ${lat1}))`;
        const data = {
            namepond: namepond,
            namefarm: namefarm,
            geom: geomWkt,
            username: username,
            address: address,
            manager: manager
        };
        console.log(data);

        // Gửi yêu cầu lưu dữ liệu vào cơ sở dữ liệu
        fetch("http://localhost:8081/api/addpond", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorText => {
                        throw new Error('Server response error: ' + errorText || response.statusText);
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert("Thêm ao nuôi thành công!");
                    loadPonds(); // Gọi lại API để tải danh sách ao
                    document.getElementById("add_pond_form").reset();
                } else {
                    alert("Đã xảy ra lỗi: " + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    });

    
    // Hàm tính diện tích từ tọa độ của polygon
    function calculateArea(coordinates) {
        const R = 6378137; // Bán kính Trái đất (m)
        let area = 0;

        if (coordinates.length > 2) {
            for (let i = 0; i < coordinates.length - 1; i++) {
                const p1 = coordinates[i];
                const p2 = coordinates[i + 1];
                area += (toRadians(p2[1]) - toRadians(p1[1])) *
                    (2 + Math.sin(toRadians(p1[0])) + Math.sin(toRadians(p2[0])));
            }
            area = (area * R * R) / 2; // Công thức diện tích hình cầu
        }
        return Math.abs(area); // Trả về diện tích (m²)
    }

    // Hàm chuyển đổi độ sang radian
    function toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
   

    // Hàm tải danh sách ao nuôi
    function loadPonds() {
        fetch(`http://localhost:8081/api/ponds?username=${username}`)
            .then(response => response.json())
            .then(data => {
                if (polygonLayer) {
                    //pondMap.removeLayer(polygonLayer); // Xóa lớp cũ trước khi thêm mới
                    polygonLayer.clearLayers();
                } else {
                    // Nếu chưa tồn tại, khởi tạo mới
                    polygonLayer = L.layerGroup().addTo(pondMap);
                }
                data.forEach(pond => {
                    const wkt = pond.geom;
                    const polygonCoordinates = parseWKTToCoordinates(wkt);

                    if (polygonCoordinates) {
                        const area = calculateArea(polygonCoordinates); // Tính diện tích
                        L.polygon(polygonCoordinates, { color: 'blue' })
                            .addTo(pondMap)
                            .bindPopup(`<h5>Tên ao nuôi: ${pond.namepond}</h5>
                                        <h5>Địa chỉ ao: ${pond.address}</h5> 
                                        <h5>Người quản lý: ${pond.manager}</h5>
                                        <h5> Diện tích ao: ${area.toFixed(2)} m² </h5>
                                        <button class="delete-pond-btn" data-id="${pond.id}" style="background-color: #dc3545; color: #fff; border: none; padding: 5px 10px; cursor: pointer;">Xóa</button>`);
                    }
                });
            })
            .catch(error => console.error('Error fetching ponds:', error));
    }


    // Hàm chuyển đổi WKT thành tọa độ
    function parseWKTToCoordinates(wkt) {
        try {
            // Loại bỏ tiền tố "POLYGON((" và hậu tố "))"
            const stripped = wkt.replace('POLYGON((', '').replace('))', '');

            // Tách các cặp tọa độ
            const points = stripped.split(',');

            // Chuyển đổi từng cặp tọa độ thành [lat, lng]
            const coordinates = points.map(point => {
                const [lng, lat] = point.trim().split(' ').map(Number);
                return [lat, lng]; // Leaflet sử dụng [lat, lng]
            });

            return coordinates;
        } catch (error) {
            console.error('Error parsing WKT:', error);
            return null;
        }
    }

    // Gọi loadPonds() ngay khi trang tải
    loadPonds();
});

// Lắng nghe sự kiện click vào nút xóa ao
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-pond-btn")) {
        const pondId = event.target.getAttribute("data-id");

        // Hiển thị xác nhận trước khi xóa
        if (confirm("Bạn có chắc chắn muốn xóa ao nuôi này?")) {
            // Gửi yêu cầu xóa đến backend
            fetch(`http://localhost:8081/api/deletepond/${pondId}`, {
                method: "DELETE"
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Xóa thất bại. Vui lòng thử lại.");
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        alert("Xóa ao nuôi thành công!");
                        loadPonds(); // Tải lại danh sách ao nuôi
                        // Làm mới trang web
                        window.location.reload();
                    } else {
                        alert("Đã xảy ra lỗi khi xóa ao nuôi.");
                    }
                })
        }
    }
});