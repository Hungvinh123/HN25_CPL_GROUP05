import { useState } from "react";
import { registerUser, loginUser } from "../api";
import { useNavigate } from "react-router-dom";
import "./Auth.css";  // Thêm file CSS để quản lý style

const Auth = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const validateInput = () => {
    if (!email.trim()) return "Vui lòng nhập email.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Email không hợp lệ.";
    if (!password.trim()) return "Vui lòng nhập mật khẩu.";
    if (password.length < 3) return "Mật khẩu phải có ít nhất 3 ký tự.";
    if (!isLogin && !username.trim()) return "Vui lòng nhập tên người dùng.";
    if (!isLogin && username.length < 3) return "Tên người dùng phải có ít nhất 3 ký tự.";
    return null;
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
        const { token, username } = response.data.user;

        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        setUser(username);

        navigate("/profile");
      } else {
        await registerUser({ username, email, password });
        setIsLogin(true);
      }
      setError(null);
    } catch (err) {
      const apiError = err.response?.data?.errors || {};
      const errorMessage = apiError.email?.[0] || apiError.password?.[0] || apiError.username?.[0] || "Đã có lỗi xảy ra!";
      setError(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h2>{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>
        {error && <p className="error-message">{error}</p>}

        {!isLogin && (
          <input type="text" placeholder="Tên người dùng" value={username} onChange={(e) => setUsername(e.target.value)} />
        )}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button onClick={handleSubmit} className="auth-btn">{isLogin ? "Đăng nhập" : "Đăng ký"}</button>
        <p onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
          {isLogin ? "Tạo tài khoản mới" : "Đã có tài khoản? Đăng nhập"}
        </p>
      </div>
    </div>
  );
};

export default Auth;
