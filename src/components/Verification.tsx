import z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

interface Props {
  onClose: () => void;
}

function Verification({ onClose }: Props) {
  const schema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
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

  async function onSubmit(data: ValidSchema) {
    console.log(data);
    try {
      const res = await axios.get<ValidSchema[]>("http://localhost:8000/users");
      const user = res.data.find((u) => u.email === data.email);

      if (!user) {
        alert("No matching email");
      } else {
        alert("Email verified. Continue to reset password.");
        reset();
        navigate("/message", { state: { email: user.email } });
      }
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <>
      <div className="login-container">
        <h3 className="">What's your email address</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
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
              <p className="error-message">{errors.email?.message}</p>
            )}
          </div>

          <button className="login-btn" type="submit">
            Continue
          </button>
        </form>
        <button className="close-btn" onClick={onClose}>
          <IoClose size={20} />
        </button>
      </div>
    </>
  );
}

export default Verification;
