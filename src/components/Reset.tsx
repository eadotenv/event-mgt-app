import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import z from "zod";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";

function Reset() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const schema = z
    .object({
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain uppercase letter")
        .regex(/[0-9]/, "Password must contain a number"),
      confirm: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain uppercase letter")
        .regex(/[0-9]/, "Password must contain a number"),
    })
    .refine((data) => data.password === data.confirm, {
      message: "Passwords do not match",
      path: ["confirm"],
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

  // if (!user) {
  //   return <p className="text-center mt-5">Unauthorized access</p>;
  // }

  async function onSubmit(data: ValidSchema) {
    try {
      await axios.put("http://localhost:8000/users/" + user.id, {
        ...user,
        password: data.password,
      });

      alert("Password reset successful");
      reset();
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div
          className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4 
                    px-3 py-3 bg-body-secondary rounded "
        >
          <div className="mb-3 text-balance">
            <h3 className="fw-bold fs-5">Reset Password</h3>
          </div>

          <form className="mb-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label" htmlFor="new-password">
                New Password
              </label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="New password"
                  className="form-control "
                  id="new-password"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="position-absolute top-50 end-0 translate-middle text-secondary"
                  style={{ cursor: "pointer" }}
                >
                  {showPassword ? (
                    <IoMdEye size={20} />
                  ) : (
                    <IoMdEyeOff size={20} />
                  )}
                </span>
              </div>

              {errors.password && (
                <p className="text-danger">{errors.password?.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="confirm-password">
                Confirm Password
              </label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("confirm")}
                  placeholder="Confirm password"
                  className="form-control "
                  id="confirm-password"
                />
              </div>

              {errors.confirm && (
                <p className="text-danger">{errors.confirm.message}</p>
              )}
            </div>
            <button className="btn btn-dark w-100" type="submit">
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Reset;
