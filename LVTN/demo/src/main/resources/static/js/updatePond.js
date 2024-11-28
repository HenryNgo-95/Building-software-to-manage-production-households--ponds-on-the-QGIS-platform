document.addEventListener("DOMContentLoaded", function () {
    const pondMap = L.map('pondMap').setView([9.7499, 105.1000], 10); // Bản đồ Leaflet
    const farmSelect = document.getElementById('namefarm'); // Dropdown chọn trại nuôi
    const pondSelect = document.getElementById('selectPond'); // Dropdown chọn ao
    const updateForm = document.getElementById('update_pond_form'); // Form cập nhật ao
    const username = localStorage.getItem('username'); // Lấy username từ localStorage
    let polygonLayer = L.layerGroup().addTo(pondMap); // Layer chứa các polygon
    let ponds = []; // Lưu danh sách tất cả ao nuôi

    // Kiểm tra nếu chưa đăng nhập
    if (!username) {
        alert('Vui lòng đăng nhập để sử dụng chức năng này.');
        window.location.href = 'dkdn.html';
        return;
    }

    // Thêm tile layer cho bản đồ
    L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
    }).addTo(pondMap);

    // Tải danh sách trại nuôi theo username
    fetch(`http://localhost:8081/api/farms?username=${username}`)
        .then(response => response.json())
        .then(data => {
            farmSelect.innerHTML = '';
            data.forEach(farm => {
                const option = document.createElement('option');
                option.value = farm.namefarm;
                option.text = farm.namefarm;
                farmSelect.appendChild(option);
            });
            if (data.length > 0) {
                farmSelect.selectedIndex = 0;
                loadPonds(); // Tải ao nuôi cho trại đầu tiên
            }
        })
        .catch(error => console.error('Error fetching farms:', error));

    // Tải danh sách ao nuôi
    function loadPonds() {
        fetch(`http://localhost:8081/api/ponds?username=${username}`)
            .then(response => response.json())
            .then(data => {
                ponds = data; // Lưu toàn bộ danh sách ao nuôi
                filterPonds(); // Lọc ao theo trại được chọn
            })
            .catch(error => console.error('Error fetching ponds:', error));
    }

    // Lọc ao nuôi theo trại
    function filterPonds() {
        const selectedFarm = farmSelect.value; // Lấy trại được chọn
        const filteredPonds = ponds.filter(pond => pond.namefarm === selectedFarm); // Lọc ao theo trại
        pondSelect.innerHTML = ''; // Xóa các lựa chọn cũ
        polygonLayer.clearLayers(); // Xóa các lớp cũ trên bản đồ

        filteredPonds.forEach(pond => {
            // Thêm lựa chọn vào dropdown ao
            const option = document.createElement('option');
            option.value = JSON.stringify(pond); // Lưu toàn bộ thông tin ao vào value
            option.text = pond.namepond;
            pondSelect.appendChild(option);

            // Vẽ polygon của ao lên bản đồ
            const polygonCoordinates = parseWKTToCoordinates(pond.geom);
            if (polygonCoordinates) {
                L.polygon(polygonCoordinates, { color: 'blue' })
                    .addTo(polygonLayer)
                    .bindPopup(`<h5>Tên ao nuôi: ${pond.namepond}</h5>
                                <h5>Địa chỉ ao: ${pond.address}</h5>
                                <h5>Người quản lý: ${pond.manager}</h5>`);
            }
        });

        // Nếu có dữ liệu, chọn ao đầu tiên
        if (filteredPonds.length > 0) {
            pondSelect.selectedIndex = 0;
            populateForm(JSON.parse(pondSelect.value)); // Điền thông tin ao vào form
        }
    }

    // Hàm chuyển đổi WKT thành tọa độ
    function parseWKTToCoordinates(wkt) {
        try {
            const stripped = wkt.replace('POLYGON((', '').replace('))', '');
            const points = stripped.split(',');
            return points.map(point => {
                const [lng, lat] = point.trim().split(' ').map(Number);
                return [lat, lng];
            });
        } catch (error) {
            console.error('Error parsing WKT:', error);
            return null;
        }
    }

    // Hàm di chuyển bản đồ đến ao nuôi
    function moveToPond(geom) {
        const coordinates = parseWKTToCoordinates(geom);
        if (coordinates) {
            const bounds = L.polygon(coordinates).getBounds();
            pondMap.fitBounds(bounds); // Di chuyển và zoom đến ao
        }
    }

    // Hàm điền thông tin ao vào form
    function populateForm(pond) {
        document.getElementById('namefarm').value = pond.namefarm;
        document.getElementById('namepond').value = pond.namepond;
        document.getElementById('username_pond').value = pond.manager;
        document.getElementById('address').value = pond.address;

        // Di chuyển bản đồ đến vị trí ao
        moveToPond(pond.geom);
    }

    // Sự kiện khi thay đổi trại nuôi
    farmSelect.addEventListener('change', function () {
        filterPonds(); // Lọc ao nuôi khi thay đổi trại
    });

    // Sự kiện khi thay đổi lựa chọn ao nuôi
    pondSelect.addEventListener('change', function () {
        const selectedPond = JSON.parse(this.value);
        populateForm(selectedPond);
    });

    // Gọi hàm tải danh sách ao ngay khi tải trang
    loadPonds();

    ///////////////////////////////////////////////////////
    updateForm.addEventListener('submit', function (event) {
        event.preventDefault();
    
        // Thu thập dữ liệu từ form
        const selectedPond = JSON.parse(pondSelect.value); // Lấy thông tin ao đang chọn
        const updatedPond = {
            id: selectedPond.id, // Gửi ID để backend xác định ao cần cập nhật
            namepond: document.getElementById('namepond').value,
            manager: document.getElementById('username_pond').value,
            address: document.getElementById('address').value
        };
    
        // Gửi yêu cầu cập nhật đến server
        fetch(`http://localhost:8081/api/updatepond`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPond),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update pond.');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert('Cập nhật ao nuôi thành công!');
                    loadPonds(); // Tải lại danh sách ao
                } else {
                    alert('Đã xảy ra lỗi: ' + data.message);
                }
            })
            .catch(error => console.error('Error updating pond:', error));
    });
});