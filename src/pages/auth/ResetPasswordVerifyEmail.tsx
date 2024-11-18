import { PasswordResetEmailVerificationForm } from "@/components/auth/PasswordResetForm";
import { api_url, passwordResetSessionName } from "@/lib/config";
import { PasswordResetSession } from "@/types";
import { CapacitorHttp } from "@capacitor/core";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<PasswordResetSession | null>(null);
  const history = useHistory();
  const loadingData = useRef(false);

  const fetchData = async () => {
    try {
      // Check rate limit
      let token = null;
      const keys = await SecureStoragePlugin.keys();
      try {
        token = keys.value.includes(passwordResetSessionName)
          ? await SecureStoragePlugin.get({ key: passwordResetSessionName })
          : null;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      const resetPassword = await CapacitorHttp.request({
        method: "GET",
        url: `${api_url}/api/auth/reset-password/verify-email`,
        headers: {
          "Content-Type": "application/json",
          "Authorization-Password-Session": token?.value ?? "",
        },
      });
      console.log(resetPassword.data);
      const resetPasswordRes = await resetPassword.data;
      if (!resetPasswordRes.success) {
        if (resetPasswordRes.error === "UNAUTHORIZED") {
          keys.value.includes(passwordResetSessionName) &&
            (await SecureStoragePlugin.clear());
          return history.push("/auth/login");
        }
        if (resetPasswordRes.redirect)
          return history.push(resetPasswordRes.redirect);
        return history.push("/");
      }

      // Get data
      setSession(resetPasswordRes.session);
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
      <h1>Verify your email address</h1>
      <p>We sent an 8-digit code to {session?.email}.</p>
      <PasswordResetEmailVerificationForm />
    </div>
  );
}
