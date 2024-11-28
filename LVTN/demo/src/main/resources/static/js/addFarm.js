// Xóa trại nuôi 
document.getElementById('add-farm-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const selectedFarm = document.getElementById('namefarm').value;

    if (confirm("Bạn có chắc chắn muốn xóa trại nuôi này không?")) {
        fetch(`http://localhost:8081/api/farms/${encodeURIComponent(selectedFarm)}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error deleting farm');
            }
            return response.text();
        })
        .then(message => {
            alert(message);
            // Xóa trại nuôi khỏi danh sách lựa chọn
            const selectElement = document.getElementById('namefarm');
            selectElement.remove(selectElement.selectedIndex);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting farm: ' + error.message);
        });
    }
});

// Xử lý thêm trại nuôi
document.getElementById('add-farm-form').addEventListener('submit', function (event) {
    event.preventDefault();

    // Lấy giá trị từ form
    const farmName = document.getElementById('nameFarm').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const farmingType = document.getElementById('farming').value;
    const species = document.getElementById('obj').value;
    const managerName = document.getElementById('manager').value;

    // Lấy username từ localStorage (hoặc từ một nguồn nào đó)
    const username = localStorage.getItem('username'); // Hoặc bạn có thể lấy từ form nếu cần
    if (!username) {
        alert("Tên tài khoản không tồn tại, vui lòng đăng nhập lại!");
        return;
    }

    // Kiểm tra định dạng số điện thoại (giả sử số điện thoại có 10 chữ số)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        alert('Số điện thoại không hợp lệ!');
        return;
    }

    // Kiểm tra xem giá trị có rỗng không
    if (!farmName || !address || !phone || !farmingType || !species || !managerName) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    fetch('http://localhost:8081/api/addfarm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            namefarm: farmName,  
            username: username,
            address: address,
            phone: phone,
            farming: farmingType,
            obj: species,
            manager: managerName
        }),
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
                alert("Thêm trại nuôi thành công!");
                document.getElementById("add-farm-form").reset();
            } else {
                alert("Đã xảy ra lỗi: " + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Đã xảy ra lỗi khi thêm trại nuôi: " + error.message);
        });
});

/////////////////////////////////////////////////////////////////////////////////////////////////

// Xử lý cập nhật thông tin trại nuôi
document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem('username');
    if (!username) {
        alert('Vui lòng đăng nhập để xem danh sách trại nuôi.');
        window.location.href = 'dkdn.html';
        return;
    }

    // Tải danh sách trại nuôi
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
            if (data.length > 0) {
                farmSelect.selectedIndex = 0;
                displayFarmDetails(data[0]);
            }
            farmSelect.addEventListener('change', () => {
                const selectedFarm = data.find(farm => farm.namefarm === farmSelect.value);
                displayFarmDetails(selectedFarm);
            });
        })
        .catch(error => console.error('Lỗi khi lấy danh sách trại nuôi:', error));

    // Hiển thị thông tin chi tiết của trại nuôi
    function displayFarmDetails(farm) {
        if (!farm) return;
        document.getElementById('address').value = farm.address;
        document.getElementById('phone').value = farm.phone;
        document.getElementById('farming').value = farm.farming;
        document.getElementById('obj').value = farm.obj;
        document.getElementById('manager').value = farm.manager;
    }

    // Xử lý nút cập nhật trại nuôi
    document.getElementById('updateButton').addEventListener('click', function () {
        const farmName = document.getElementById('namefarm').value;
        const updatedFarm = {
            username: username,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value,
            farming: document.getElementById('farming').value,
            obj: document.getElementById('obj').value,
            manager: document.getElementById('manager').value
        };

        fetch(`http://localhost:8081/api/farms/${encodeURIComponent(farmName)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedFarm)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi cập nhật trại nuôi');
            }
            return response.text();
        })
        .then(message => {
            alert(message);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Lỗi khi cập nhật trại nuôi: ' + error.message);
        });
    });
});