import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SteamAuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!params) {
      console.error("No search params found!");
      return;
    }
    const steamId = params.get("steam_id");
    const displayName = params.get("display_name");
    const avatarUrl = params.get("avatar_url");
    const token = params.get("token");
    console.log("Params:", steamId, token, displayName, avatarUrl);
    if (steamId && token) {
      localStorage.setItem("steam_id", steamId);
      localStorage.setItem("account_display_name", displayName);
      localStorage.setItem("avatar_url", avatarUrl);
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } else {
      navigate("/login?error=steam_auth_failed");
    }
  }, [params, navigate]);

  return <div>Signing you in with Steam...</div>;
};



//simple auth from when things were not going so well at all 
// const SteamAuthSuccess = () => {
//   return <div>SteamAuthSuccess is rendering!</div>;
// };

export default SteamAuthSuccess;