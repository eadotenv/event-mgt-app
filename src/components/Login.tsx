import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "../entities/User";
import Button from "./Button";
import Verification from "./Verification";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

// Login Validation Schema (Defined outside to maintain execution efficiency)
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Authentication Submission Logic
  async function onSubmit(loginData: LoginFormData) {
    console.log("login data:", loginData);
    try {
      const res = await axios.get<User[]>("http://localhost:8000/users");
      const user = res.data.find(
        (u) => u.email === loginData.email && u.password === loginData.password,
      );

      if (user) {
        alert("Login successful!");
        navigate("/page-layout", { state: { user } });
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error("Authentication internal error:", err);
    }
    reset();
  }

  return (
    <div className={`container ${showModal ? "open" : ""}`}>
      <div className={`login-box ${showModal ? "open" : ""}`}>
        <div className="first-div">
          <h3 className="login-head">Log in</h3>
          <p className="login-text">
            New User? Tap{" "}
            <Link to="/signup" className="login-text-link">
              Here to Sign up
            </Link>
          </p>
          <Button />
        </div>

        <div className="three-lines">
          <span className="left"></span>
          <span className="or">OR</span>
          <span className="right"></span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          {/* Email Input Field */}
          <div className="mail-box">
            <label className="form-label" htmlFor="email">
              Email address
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="Enter email address"
              className="form-control"
              id="email"
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input Field */}
          <div className="password-box">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="psward">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter password"
                className="form-control"
                id="password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="pass-eye"
                role="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <IoMdEye size={20} className="eye" />
                ) : (
                  <IoMdEyeOff size={20} className="eye" />
                )}
              </span>
            </div>
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          <button className="login-btn" type="submit">
            Continue
          </button>
        </form>

        {/* Forgot Password and Modal Operations */}
        <div className="modal-box">
          <div className="forgot">
            Forgot password?{" "}
            <Link
              to="#"
              onClick={() => setShowModal(true)}
              className="login-text-link"
            >
              Reset now
            </Link>
          </div>

          {showModal && (
            <div className="show-modal">
              <Verification onClose={() => setShowModal(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
