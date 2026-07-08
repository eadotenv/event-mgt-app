import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "./Button";
import "../css/Login.css";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const signUpSchema = z.object({
  firstname: z.string().min(3, "First name must be at least 3 characters"),
  lastname: z.string().min(3, "Last name must be at least 3 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

function SignUp() {
  const navigate = useNavigate();
  const [hidePassword, setHidePassword] = useState<boolean>(true); // true means hidden by default

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  function onSubmit(data: SignUpFormData) {
    console.log("Submit sign-up data:", data);
    axios
      .post("http://localhost:8000/users/", data)
      .then(() => {
        reset();
        navigate("/last-step");
      })
      .catch((err) => {
        console.error("Sign up failed:", err);
      });
  }

  return (
    <div className="container">
      <div className="login-box sign-box">
        <div className="first-div">
          <h3 className="login-head">Sign up</h3>
          <p className="login-text">
            Already have an account? Tap{" "}
            <Link to="/" className="login-text-link">
              Here to Login
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
          {/* Name Section */}
          <div className="name-container">
            <label className="form-label">Name</label>
            <div className="name-box">
              <div className="first-name">
                <input
                  type="text"
                  {...register("firstname")}
                  placeholder="First name"
                  className="form-control"
                />
                {errors.firstname && (
                  <p className="error-message">{errors.firstname.message}</p>
                )}
              </div>

              <div className="last-name">
                <input
                  type="text"
                  {...register("lastname")}
                  placeholder="Last name"
                  className="form-control"
                />
                {errors.lastname && (
                  <p className="error-message">{errors.lastname.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Email Section */}
          <div className="mail-box">
            <label className="form-label" htmlFor="email">
              Email
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

          {/* Password Section */}
          <div className="password-box">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="psward">
              <input
                type={hidePassword ? "password" : "text"}
                {...register("password")}
                placeholder="Enter password"
                className="form-control"
                id="password"
              />
              <span
                onClick={() => setHidePassword(!hidePassword)}
                className="pass-eye"
                role="button"
                aria-label={hidePassword ? "Show password" : "Hide password"}
              >
                {hidePassword ? (
                  <IoMdEyeOff size={20} className="eye" />
                ) : (
                  <IoMdEye size={20} className="eye" />
                )}
              </span>
            </div>
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            className="login-btn"
            type="submit"
            style={{ backgroundColor: isValid ? "green" : "black" }}
          >
            Continue
          </button>
        </form>

        <p className="sign">
          By signing up you agree to our{" "}
          <a href="#" className="service">
            terms of service
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
