import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./LoginBtn.css";
import useToken from "../../context/useToken";
import useAxios from "axios-hooks";
import { useEffect } from "react";

export default function LoginBtn() {
  const { isCreator, setToken } = useToken();
  const [{ data, error }, login] = useAxios(
    { url: "/auth/login", method: "post" },
    { manual: true }
  );

  useEffect(() => {
    if (error) {
      alert("Login Failed");
      return;
    }

    if (data?.accessToken) {
      setToken(data.accessToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error]);

  return (
    <div className="loginBtnWrapper">
      {isCreator ? (
        <button
          type="button"
          className="loginBtn"
          onClick={(e) => {
            e.preventDefault();
            setToken(null);
          }}
        >
          Log out
        </button>
      ) : (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <GoogleLogin
            useOneTap={false}
            onSuccess={async (credentialResponse) => {
              login({ data: { token: credentialResponse.credential } });
            }}
            onError={() => {
              alert("Login Failed");
            }}
            theme="filled_black"
            shape="pill"
          />
        </GoogleOAuthProvider>
      )}
    </div>
  );
}
