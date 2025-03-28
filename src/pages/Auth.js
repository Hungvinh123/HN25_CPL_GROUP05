import { useState } from "react";
import { registerUser, loginUser } from "../api";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Hàm kiểm tra dữ liệu đầu vào trước khi gọi API
  const validateInput = () => {
    if (!email.trim()) return "Vui lòng nhập email.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Email không hợp lệ.";
    if (!password.trim()) return "Vui lòng nhập mật khẩu.";
    if (password.length < 3) return "Mật khẩu phải có ít nhất 3 ký tự.";
    if (!isLogin && !username.trim()) return "Vui lòng nhập tên người dùng.";
    if (!isLogin && username.length < 3) return "Tên người dùng phải có ít nhất 3 ký tự.";
    return null; // Không có lỗi
  };

  const handleSubmit = async () => {
    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      if (isLogin) {
        const response = await loginUser({ email, password });
        localStorage.setItem("token", response.data.user.token);
        navigate("/profile");
      } else {
        await registerUser({ username, email, password });
        setIsLogin(true); // Chuyển sang màn hình đăng nhập sau khi đăng ký thành công
      }
      setError(null); // Xóa lỗi nếu thành công
    } catch (err) {
      // ✅ Lấy lỗi từ API và hiển thị
      const apiError = err.response?.data?.errors || {};
      const errorMessage = apiError.email?.[0] || apiError.password?.[0] || apiError.username?.[0] || "Đã có lỗi xảy ra!";
      setError(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>
      {error && <p style={{ color: "red" }}>co tai khoan</p>}

      {!isLogin && (
        <input type="text" placeholder="Tên người dùng" value={username} onChange={(e) => setUsername(e.target.value)} />
      )}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleSubmit}>{isLogin ? "Đăng nhập" : "Đăng ký"}</button>
      <p onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
        {isLogin ? "Tạo tài khoản mới" : "Đã có tài khoản? Đăng nhập"}
      </p>
    </div>
  );
};

export default Auth;
