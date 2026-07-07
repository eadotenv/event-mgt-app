import Button from "./Button";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
import axios from "axios";
import Verification from "./Verification";
import type { User } from "../entities/User";
// import "../css/Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // validating form with zod

  const schema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain uppercase letter")
      .regex(/[0-9]/, "Password must contain a number"),
  });

  type ValidSchema = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ValidSchema>({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();

  //submitting data
  async function onSubmit(loginData: ValidSchema) {
    console.log(loginData);
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
      console.error(err);
    }

    reset();
  }

  return (
    <>
      <div className={`container ${showModal ? "open" : ""}`}>
        <div className={`login-box ${showModal ? "open" : ""}`}>
          <div className="first-div">
            <h3 className="login-head">Log in</h3>
            <p className="login-text">
              New User? Tap
              <Link to="/signup" className="login-text-link">
                Here to Sign up
              </Link>
            </p>
            <Button />
          </div>

          <div className="three-lines">
            <span className="left"></span>
            <span className="or">OR</span>
            <span className="right"> </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
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
                <p className="error-message">{errors.email?.message}</p>
              )}
            </div>

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
                >
                  {showPassword ? (
                    <IoMdEye size={20} className="eye" />
                  ) : (
                    <IoMdEyeOff size={20} className="eye" />
                  )}
                </span>
              </div>

              {errors.password && (
                <p className="error-message">{errors.password?.message}</p>
              )}
            </div>

            <button className="login-btn" type="submit">
              Continue
            </button>
          </form>

          <div className="modal-box">
            <div className="forgot">
              Forgot password?{" "}
              <Link
                to={"#"}
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
    </>
  );
}

export default Login;
