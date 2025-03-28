// import { useState } from "react";
// import { loginUser } from "../api";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const [error, setError] = useState(null);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await loginUser({ email, password });
//       localStorage.setItem("token", response.data.user.token);
//       navigate("/profile");
//     } catch (err) {
//       setError("Login failed! Check your credentials.");
//     }
//   };

//   return (
//     <section className="forms-section">
//       <div className="forms">
//         <div className="form-wrapper is-active">
//           <button type="button" className="switcher switcher-login">
//             Login
//             <span className="underline"></span>
//           </button>
//           <form className="form form-login" onSubmit={handleLogin}>
//             <fieldset>
//               <legend>Please, enter your email and password for login.</legend>
//               <div className="input-block">
//                 <label htmlFor="login-email">E-mail</label>
//                 <input id="login-email" type="email" required onChange={(e) => setEmail(e.target.value)} />
//               </div>
//               <div className="input-block">
//                 <label htmlFor="login-password">Password</label>
//                 <input id="login-password" type="password" required onChange={(e) => setPassword(e.target.value)} />
//               </div>
//             </fieldset>
//             {error && <p style={{ color: "red" }}>{error}</p>}
//             <button type="submit" className="btn-login">Login</button>
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// };
// export default Login;
