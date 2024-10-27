import { api_url, sessionName } from "@/lib/config";
import { CapacitorHttp } from "@capacitor/core";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { TwoFactorResetForm } from "@/components/auth/TwoFactorSetUpForm";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const history = useHistory();


  const fetchData = useCallback(async () => {
    try {
      // Check rate limit
      let token = null;
      try {
        token = await SecureStoragePlugin.get({ key: sessionName });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      const settings = await CapacitorHttp.request({
        method: "GET",
        url: `${api_url}/api/auth/2fa/reset`,
        headers: {
          "Content-Type": "application/json",
          "Authorization-Session": token?.value ?? "",
        },
      });
      console.log(settings.data);
      const settingsRes = await settings.data;
      if (!settingsRes.success) {
        if (settingsRes.redirect) return history.push(settingsRes.redirect);
        return history.push('/');
      }

      // Get data

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }, [history]);


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
			<h1>Recover your account</h1>
			<TwoFactorResetForm />
    </>
  );
}
