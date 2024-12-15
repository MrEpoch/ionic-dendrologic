import { api_url, sessionName } from "@/lib/config";
import { CapacitorHttp } from "@capacitor/core";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { TwoFactorResetForm } from "@/components/auth/TwoFactorSetUpForm";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { IonContent } from "@ionic/react";
import Loading from "@/components/Loading";

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
        if (settingsRes?.error === "UNAUTHORIZED")
          await SecureStoragePlugin.clear();
        if (settingsRes.redirect) return history.push(settingsRes.redirect);
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

  if (loading) return <Loading />;

  return (
    <div className="flex gap-4 flex-col justify-center dark:bg-background bg-background py-16 pt-96 items-center p-4 h-96 w-full">
      <h1>Recover your account</h1>
      <TwoFactorResetForm />
    </div>
  );
}
