import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SteamAuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const steamId = params.get("steamid");
    const displayName = params.get("display_name");
    const avatarUrl = params.get("avatar_url");
    const token = params.get("token");
    if (steamId && token) {
      localStorage.setItem("steam_id", steamId);
      localStorage.setItem("account_display_name", displayName);
      localStorage.setItem("avatar_url", avatarUrl);
      localStorage.setItem("token", token);
      navigate("/my_games");
    } else {
      navigate("/login?error=steam_auth_failed");
    }
  }, [params, navigate]);

  return <div>Signing you in with Steam...</div>;
};

export default SteamAuthSuccess;