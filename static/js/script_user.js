function validatePassword() {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorMessage = document.getElementById("error-message");
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    // Kiểm tra password có khớp định dạng
    if (!passwordPattern.test(password)) {
        errorMessage.textContent = "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm: 1 chữ cái in hoa, 1 chữ thường, 1 số, và 1 ký tự đặc biệt.";
        return false;
    }

    // Kiểm tra mật khẩu có trùng khớp không
    if (password !== confirmPassword) {
        errorMessage.textContent = "Mật khẩu nhập lại không khớp.";
        return false;
    }

    // Nếu đúng, cho phép gửi form
    errorMessage.textContent = "";
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    const errorMessage = document.getElementById('error-message');

    // Hàm lấy dữ liệu từ form đăng ký
    const getRegisterFormData = () => ({
        name: document.getElementById('name')?.value,
        username: document.getElementById('username')?.value,
        email: document.getElementById('email')?.value,
        password: document.getElementById('password')?.value,
        confirmPassword: document.getElementById('confirmPassword')?.value
    });

    // Hàm lấy dữ liệu từ form đăng nhập
    const getLoginFormData = () => ({
        username: document.getElementById('username')?.value,
        password: document.getElementById('password')?.value
    });

    // Hàm xử lý submit (đăng ký hoặc đăng nhập)
    const handleSubmitRegister = async (url, formData) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMsg = errorData.message || "Yêu cầu thất bại";
                const errorDetails = errorData.errors ? JSON.stringify(errorData.errors) : '';
                throw new Error(`${errorMsg}. Chi tiết: ${errorDetails}`);
            }

            const result = await response.json();
            console.log('Thành công:', result);
            if (url.includes('register')) {
                window.location.href = '/templates/login.html'; // Điều hướng sau đăng ký
            } else {
                sessionStorage.setItem('token', result.token);
                sessionStorage.setItem('username', result.username);
                sessionStorage.setItem('email', result.email);
                window.location.href = '/templates/home.html'; // Điều hướng sau đăng nhập
            }

        } catch (error) {
            errorMessage.textContent = `Yêu cầu thất bại: ${error.message}`;
        }
    };

    // Xử lý form đăng ký
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = getRegisterFormData();
            handleSubmitRegister('http://127.0.0.1:8080/register', formData);
        });
    }

    // Xử lý form đăng nhập
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = getLoginFormData();
            handleSubmitRegister('http://127.0.0.1:8080/login', formData);
        });
    }
});

