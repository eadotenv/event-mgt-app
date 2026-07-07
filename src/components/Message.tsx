import { MdEmail } from "react-icons/md";
import { useLocation } from "react-router-dom";

function Message() {
  const location = useLocation();
  const email = location.state.email;
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div
          className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4 
                    px-3 py-5 bg-body-secondary rounded text-center"
          style={{ border: "2px solid green", height: "70vh" }}
        >
          <div className="text-center mb-3">
            <MdEmail size={40} style={{ color: "green" }} />
          </div>

          <h3 className="fs-5 fw-bold text-center mb-3">Check your inbox</h3>
          <p className="fw-medium">
            If an account exist for {email}, you should receive a password reset
            email soon. It may take up to 5 minutes.
          </p>
          <hr />

          <p>
            Wrong email?{" "}
            <a
              href="#"
              className="link-offset-1 link-underline link-underline-opacity-0"
            >
              Change email
            </a>
          </p>
          <p>
            Didn't receive email?{" "}
            <a
              href="#"
              className="link-offset-2 link-underline link-underline-opacity-0"
            >
              Resend email
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Message;
