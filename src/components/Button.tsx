import { FcGoogle } from "react-icons/fc";
import "../css/Button.css";

function Button() {
  return (
    <button className="btn">
      <FcGoogle /> <span>Continue with Google</span>
    </button>
  );
}

export default Button;
