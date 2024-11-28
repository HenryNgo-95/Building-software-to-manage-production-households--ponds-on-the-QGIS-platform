// Hiển thị tên tài khoản từ localStorage
const username = localStorage.getItem('username');
if (username) {
    document.getElementById('username-display').innerText = `${username}`;
}

// Xử lý sự kiện khi nhấn vào icon đăng xuất
document.getElementById('logout-icon').addEventListener('click', function() {
    // Xóa username khỏi localStorage
    localStorage.removeItem('username');
    // Chuyển hướng về trang đăng nhập
    window.location.href = 'dkdn.html';
});

// Tạo bản đồ
const map = L.map('map').setView([9.7499, 105.1000], 10); // Thay 'x' và 'y'

// Thêm lớp Google Road
L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
}).addTo(map);

// Thêm lớp từ GeoServer
const wmsLayer = L.tileLayer.wms('http://localhost:8082/geoserver/wms', {
    layers: 'Google Road', // Thay 'workspace:layer_name' bằng tên lớp của bạn
    format: 'image/png',
    transparent: true,
    attribution: 'GeoServer'
}).addTo(map);

let points = []; // Mảng lưu trữ tọa độ đã chọn

// Xử lý sự kiện nhấp chuột trên bản đồ
map.on('click', function(e) {
    if (points.length < 2) {
        points.push(e.latlng); // Thêm tọa độ vào mảng
        L.marker(e.latlng).addTo(map); // Hiển thị điểm đã chọn trên bản đồ

        if (points.length === 2) {
            document.getElementById('calculateDistance').disabled = false; // Kích hoạt nút tính khoảng cách
        }
    }
});

// Tính khoảng cách khi nhấn nút
document.getElementById('calculateDistance').addEventListener('click', function() {
    const distance = map.distance(points[0], points[1]); // Tính khoảng cách giữa hai điểm
    document.getElementById('distance').innerText = `Khoảng cách: ${distance.toFixed(2)} mét`;
    points = []; // Đặt lại mảng tọa độ
    this.disabled = true; // Vô hiệu hóa nút sau khi tính
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer); // Xóa các điểm đánh dấu
        }
    });
});



// Xử lý sự kiện khi nhấn vào icon menu
document.querySelector('#blue-bar i.fa-bars').addEventListener('click', function() {
    const sidebar = document.getElementsByClassName('dropdown-menu')[0]; // Sửa lại dòng này
    sidebar.classList.toggle('open'); // Thêm hoặc xóa class 'open'
});


// Xử lý sự kiện khi nhấn vào icon menu con
$(document).ready(function () {
    $('.dropdown-menu .icon-menu').click(function () {
        $(this).parent('li').children('.sub-menu').slideToggle();
        $(this).toggleClass('fa-chevron-down fa-chevron-right');
    });

    // Thêm sự kiện cho từng <li>
    $('.dropdown-menu > li').click(function (event) {
        // Ngăn chặn sự kiện click trên thẻ a
        event.stopPropagation();
    
        // Xóa lớp 'selected' khỏi tất cả <li>
        $('.dropdown-menu > li').removeClass('selected');
    
        // Thêm lớp 'selected' cho <li> được chọn
        $(this).addClass('selected');
    });
});
