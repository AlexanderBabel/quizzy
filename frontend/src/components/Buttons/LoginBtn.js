import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./LoginBtn.css";

const LoginBtn = ({ setToken }) => {
  return (
    <div className="loginBtnWrapper">
      <GoogleOAuthProvider
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      >
        <GoogleLogin
          useOneTap={false}
          onSuccess={async (credentialResponse) => {
            const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/v1/auth/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: credentialResponse.credential,
              }),
            });
            const { status } = response;
            if (status !== 201) {
              alert("Login Failed");
              return;
            }

            const data = await response.json();
            if (data.accessToken) {
              setToken(data.accessToken);
            }
          }}
          onError={() => {
            alert("Login Failed");
          }}
          theme="filled_black"
          shape="pill"
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default LoginBtn;
