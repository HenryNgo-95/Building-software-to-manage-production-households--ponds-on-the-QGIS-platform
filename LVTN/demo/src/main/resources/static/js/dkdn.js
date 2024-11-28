// Xử lý sự kiện khi nhấn vào đăng ký
document.getElementById("show-register").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";
});

// Xử lý sự kiện khi nhấn vào đăng nhập
document.getElementById("show-login").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("register-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
});

// Hàm đăng ký
function registerUser(event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form

    const fullname = event.target.fullname.value;
    const username = event.target.username.value; // Lấy tên tài khoản
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;
    const gender = event.target.gender.value;
    const address = event.target.address.value;
    const dateOfBirth = event.target.dateOfBirth.value;

    // Kiểm tra mật khẩu và xác nhận mật khẩu
    if (password !== confirmPassword) {
        alert("Mật khẩu không khớp!");
        return;
    }

    // Gửi dữ liệu đăng ký đến server
    fetch('http://localhost:8081/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullname, username, email, password, gender, address, dateOfBirth }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert("Đăng ký thành công!");
            document.getElementById("register-form").style.display = "none";
            document.getElementById("login-form").style.display = "block"; // Quay lại form đăng nhập
        } else {
            alert("Đã xảy ra lỗi: " + data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert("Đã xảy ra lỗi khi đăng ký.");
    });
}

function loginUser(event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form

    const username = event.target.username1.value;
    const password = event.target.password1.value;

    // Gửi dữ liệu đăng nhập đến server
    fetch('http://localhost:8081/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Gửi username và password trong body
    })
    .then(response => {
        if (!response.ok) {
            // Nếu phản hồi không thành công, hiển thị thông báo lỗi
            return response.text().then(text => {
                throw new Error(text || 'Đăng nhập không thành công');
            });
        }
        return response.json(); // Chuyển đổi phản hồi thành JSON
    })
    .then(data => {
        // Kiểm tra xem đăng nhập có thành công không
        if (data.success) {
            alert("Đăng nhập thành công!");
            localStorage.setItem('username', username); // Lưu tên tài khoản vào localStorage
            window.location.href = 'index.html'; // Chuyển hướng đến trang index.html
        } else {
            alert(data.message || "Tên đăng nhập hoặc mật khẩu không đúng.");
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert("Đã xảy ra lỗi khi đăng nhập: " + error.message);
    });
}


// Gán sự kiện cho cả hai form
document.getElementById("login-form").onsubmit = loginUser;
document.getElementById("register-form").onsubmit = registerUser;