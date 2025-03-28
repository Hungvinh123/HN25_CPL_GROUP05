// import { useState } from "react";
// import { registerUser } from "../api";
// import { useNavigate } from "react-router-dom";

// const Register = () => {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const [error, setError] = useState(null);

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       await registerUser({ username, email, password });
//       navigate("/login");
//     } catch (err) {
//       setError("Registration failed!");
//     }
//   };

//   return (
//     <section className="forms-section">
//       <div className="forms">
//         <div className="form-wrapper is-active">
//           <button type="button" className="switcher switcher-signup">
//             Sign Up
//             <span className="underline"></span>
//           </button>
//           <form className="form form-signup" onSubmit={handleRegister}>
//             <fieldset>
//               <legend>Please, enter your username, email, and password for sign up.</legend>
//               <div className="input-block">
//                 <label htmlFor="signup-username">Username</label>
//                 <input id="signup-username" type="text" required onChange={(e) => setUsername(e.target.value)} />
//               </div>
//               <div className="input-block">
//                 <label htmlFor="signup-email">E-mail</label>
//                 <input id="signup-email" type="email" required onChange={(e) => setEmail(e.target.value)} />
//               </div>
//               <div className="input-block">
//                 <label htmlFor="signup-password">Password</label>
//                 <input id="signup-password" type="password" required onChange={(e) => setPassword(e.target.value)} />
//               </div>
//             </fieldset>
//             {error && <p style={{ color: "red" }}>{error}</p>}
//             <button type="submit" className="btn-signup">Sign Up</button>
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// };  

// export default Register;
