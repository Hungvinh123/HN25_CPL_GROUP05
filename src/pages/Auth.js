import { useState } from "react";
import { registerUser, loginUser } from "../api";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";  // Import yup
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Auth.css";

const Auth = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Schema validation bằng yup
  const loginSchema = yup.object().shape({
    email: yup.string().email("Email không hợp lệ.").required("Vui lòng nhập email."),
    password: yup.string().min(3, "Mật khẩu phải có ít nhất 3 ký tự.").required("Vui lòng nhập mật khẩu."),
  });

  const registerSchema = yup.object().shape({
    username: yup.string().min(3, "Tên người dùng phải có ít nhất 3 ký tự.").required("Vui lòng nhập tên người dùng."),
    email: yup.string().email("Email không hợp lệ.").required("Vui lòng nhập email."),
    password: yup.string().min(3, "Mật khẩu phải có ít nhất 3 ký tự.").required("Vui lòng nhập mật khẩu."),
  });

  const handleSubmit = async () => {
    try {
      const schema = isLogin ? loginSchema : registerSchema;
      await schema.validate({ username, email, password }, { abortEarly: false });
      setError(null); // Xóa lỗi trước khi gửi request

      if (isLogin) {
        const response = await loginUser({ email, password });
        const { token, username } = response.data.user;
      
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        setUser(username);
      
        toast.success("Đăng nhập thành công! 🎉"); // ✅ toast thành công
        setTimeout(() => {
          navigate("/home");
        }, 1000); // 1000ms = 1 giây
      } else {
        await registerUser({ username, email, password });
        toast.success("Đăng ký thành công! 🎉"); // ✅ toast thành công
        setIsLogin(true);
      }
      
    } catch (err) {
      if (err.name === "ValidationError") {
        err.errors.forEach((message) => {
          toast.error(message); // ❌ hiện từng lỗi bằng toast riêng
        });
      }
       else {
        const apiError = err.response?.data?.errors || {};
        const errorMessage =
          apiError.email ||
          apiError.username ||
          apiError.password ||
          "Đã có lỗi xảy ra!";
        toast.error(errorMessage); // ❌ toast lỗi API
      }
    }
    
    
    
  };

  return (
    <div className="auth-container">
  <div className="auth-form-wrapper enhanced">
    <h2>{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>
   

    {!isLogin && (
      <input
        type="text"
        placeholder="Tên người dùng"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="auth-input"
      />
    )}
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="auth-input"
    />
    <input
      type="password"
      placeholder="Mật khẩu"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="auth-input"
    />

    <button onClick={handleSubmit} className="auth-btn">
      {isLogin ? "Đăng nhập" : "Đăng ký"}
    </button>
    <p onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
      {isLogin ? "Tạo tài khoản mới" : "Đã có tài khoản? Đăng nhập"}
    </p>
  </div>
  <ToastContainer />
</div>

  );
};

export default Auth;
