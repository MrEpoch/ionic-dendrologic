import { PasswordResetForm } from "@/components/auth/PasswordResetForm";
import Loading from "@/components/Loading";
import { api_url, passwordResetSessionName } from "@/lib/config";
import { CapacitorHttp } from "@capacitor/core";
import { IonContent } from "@ionic/react";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const history = useHistory();
  const loadingData = useRef(false);

  const fetchData = async () => {
    try {
      let token = null;
      try {
        const keys = await SecureStoragePlugin.keys();
        token = keys.value.includes(passwordResetSessionName)
          ? await SecureStoragePlugin.get({ key: passwordResetSessionName })
          : null;
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      const resetPassword = await CapacitorHttp.request({
        method: "GET",
        url: `${api_url}/api/auth/reset-password`,
        headers: {
          "Content-Type": "application/json",
          "Authorization-Password-Session": token?.value ?? "",
        },
      });
      console.log(resetPassword.data);
      const resetPasswordRes = await resetPassword.data;
      if (!resetPasswordRes.success) {
        if (resetPasswordRes.error === "UNAUTHORIZED")
          await SecureStoragePlugin.clear();
        if (resetPasswordRes.redirect)
          return history.push(resetPasswordRes.redirect);
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
      <h1>Enter your new password</h1>
      <PasswordResetForm />
    </div>
  );
}
