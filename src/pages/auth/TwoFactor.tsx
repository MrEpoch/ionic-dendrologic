import { TwoFactorVerificationForm } from "@/components/auth/TwoFactorSetUpForm";
import { api_url, sessionName } from "@/lib/config";
import { CapacitorHttp } from "@capacitor/core";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const history = useHistory();
  const loadingData = useRef(false);

  const fetchData = async () => {
    try {
      // Check rate limit
      let token = null;
      try {
        const keys = await SecureStoragePlugin.keys();
        token = keys.value.includes(sessionName)
          ? await SecureStoragePlugin.get({ key: sessionName })
          : null;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      const twoFactor = await CapacitorHttp.request({
        method: "GET",
        url: `${api_url}/api/auth/2fa`,
        headers: {
          "Content-Type": "application/json",
          "Authorization-Session": token?.value ?? "",
        },
      });
      console.log(twoFactor.data);
      const twoFactorRes = await twoFactor.data;
      if (!twoFactorRes.success) {
        if (twoFactorRes?.error === "UNAUTHORIZED")
          await SecureStoragePlugin.clear();
        if (twoFactorRes.redirect) return history.push(twoFactorRes.redirect);
        return history.push("/");
      }

      // Get data
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loadingData.current) {
      loadingData.current = true;
      fetchData();
    }
  }, [history]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex gap-4 flex-col justify-center dark:bg-background bg-background items-center h-full w-full">
      <h1>Two-factor authentication</h1>
      <p>Enter the code from your authenticator app.</p>
      <TwoFactorVerificationForm />
      <Link to="/auth/2fa/reset">Use recovery code</Link>
    </div>
  );
}
