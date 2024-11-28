/*document.addEventListener("DOMContentLoaded", function () {
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
            username: manager,
            address: address
        };

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

    ////////////////////////////////////////////////////////////
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
    //////////////////////////////////////////////////////////////

    // Hàm tải danh sách ao nuôi
    function loadPonds() {
        fetch(`http://localhost:8081/api/ponds?username=${username}`)
            .then(response => response.json())
            .then(data => {
                if (polygonLayer) {
                    pondMap.removeLayer(polygonLayer); // Xóa lớp cũ trước khi thêm mới
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
                                        <h5>Người quản lý: ${pond.username}</h5>
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




//////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
    let isDrawing = false;
    let drawnCoordinates = []; // Lưu trữ các tọa độ đã vẽ
    const startDrawingButton = document.getElementById("start-drawing");
    const finishDrawingButton = document.getElementById("finish-drawing");

    // Lấy vị trí hiện tại và vẽ đa giác
    function startGeolocationTracking() {
        if (!navigator.geolocation) {
            alert("Trình duyệt của bạn không hỗ trợ Geolocation.");
            return;
        }

        navigator.geolocation.watchPosition(
            function (position) {
                if (isDrawing) {
                    const { latitude, longitude } = position.coords;
                    drawnCoordinates.push([latitude, longitude]); // Thêm tọa độ vào mảng

                    // Cập nhật bản đồ với điểm mới
                    if (drawnCoordinates.length > 1) {
                        const polygon = L.polygon(drawnCoordinates, { color: 'blue' });
                        polygon.addTo(pondMap);
                    }
                }
            },
            function (error) {
                console.error("Lỗi Geolocation:", error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0
            }
        );
    }

    // Bắt đầu vẽ
    startDrawingButton.addEventListener("click", function () {
        isDrawing = true;
        drawnCoordinates = []; // Reset mảng tọa độ
        finishDrawingButton.disabled = false;
        alert("Đang theo dõi vị trí của bạn để vẽ đa giác.");
    });

    // Kết thúc vẽ
    finishDrawingButton.addEventListener("click", function () {
        isDrawing = false;
        finishDrawingButton.disabled = true;

        // Kiểm tra nếu đủ tọa độ để tạo Polygon
        if (drawnCoordinates.length < 3) {
            alert("Cần ít nhất 3 điểm để tạo thành một đa giác.");
            return;
        }

        // Đóng đa giác
        drawnCoordinates.push(drawnCoordinates[0]);

        // Chuyển đổi thành WKT Polygon
        const wktPolygon = `POLYGON((${drawnCoordinates.map(coord => coord[1] + " " + coord[0]).join(", ")}))`;

        // Hiển thị WKT để kiểm tra
        console.log("WKT Polygon:", wktPolygon);

        // Lưu WKT vào cơ sở dữ liệu
        const namefarm = document.getElementById("namefarm").value;
        const namepond = document.getElementById("namepond").value;
        const address = document.getElementById("address").value;
        const username = document.getElementById("username_pond").value;

        const data = {
            namepond: namepond,
            namefarm: namefarm,
            geom: wktPolygon,
            username: username,
            address: address
        };

        fetch("http://localhost:8081/api/addpond", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.ok) {
                    alert("Thêm ao nuôi thành công!");
                } else {
                    alert("Thêm ao nuôi thất bại.");
                }
            })
            .catch(error => console.error("Error:", error));
    });

    // Bắt đầu lấy vị trí
    startGeolocationTracking();
});
*/

///////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
    let isDrawing = false;
    let drawnCoordinates = []; // Lưu trữ các tọa độ đã vẽ
    let polygonLayer = null; // Layer chứa đa giác vẽ
    const startDrawingButton = document.getElementById("start-drawing");
    const finishDrawingButton = document.getElementById("finish-drawing");
    const pondMap = L.map('pondMap').setView([9.7499, 105.1000], 10); // Khởi tạo bản đồ Leaflet
    
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

    // Thêm tile layer vào bản đồ
    L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
    }).addTo(pondMap);

    // Bắt đầu vẽ
    startDrawingButton.addEventListener("click", function () {
        isDrawing = true;
        drawnCoordinates = []; // Reset mảng tọa độ
        finishDrawingButton.disabled = false;

        alert("Đang vẽ đa giác. Vui lòng di chuyển thiết bị để thêm điểm.");
    });

    // Sử dụng Geolocation để lấy tọa độ và thêm điểm vào đa giác
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            function (position) {
                if (isDrawing) {
                    const { latitude, longitude } = position.coords;
                    drawnCoordinates.push([latitude, longitude]); // Thêm tọa độ vào mảng

                    // Hiển thị tọa độ ra console
                    console.log(`Tọa độ hiện tại: Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`);

                    // Cập nhật đa giác trên bản đồ
                    if (polygonLayer) {
                        pondMap.removeLayer(polygonLayer);
                    }
                    polygonLayer = L.polygon(drawnCoordinates, { color: 'blue' }).addTo(pondMap);
                }
            },
            function (error) {
                console.error("Lỗi Geolocation:", error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0
            }
        );
    } else {
        alert("Trình duyệt của bạn không hỗ trợ Geolocation.");
    }

    // Kết thúc vẽ
    finishDrawingButton.addEventListener("click", function () {
        isDrawing = false;
        finishDrawingButton.disabled = true;

        if (drawnCoordinates.length < 3) {
            alert("Cần ít nhất 3 điểm để tạo thành một đa giác.");
            return;
        }

        // Đóng đa giác
        drawnCoordinates.push(drawnCoordinates[0]);

        // Chuyển đổi thành WKT Polygon
        const wktPolygon = `POLYGON((${drawnCoordinates.map(coord => coord[1] + " " + coord[0]).join(", ")}))`;

        // Hiển thị WKT để kiểm tra
        console.log("WKT Polygon:", wktPolygon);
        alert("Vẽ hoàn tất! Tọa độ đã được lưu. Bạn có thể gửi lên server.");
    });
});
