import { EmailVerificationForm } from "@/components/auth/EmailVerificationForm";
import Loading from "@/components/Loading";
import { api_url, emailName, sessionName } from "@/lib/config";
import { EmailVerificationRequest, User } from "@/types";
import { CapacitorHttp } from "@capacitor/core";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [verificationRequest, setVerificationRequest] =
    useState<EmailVerificationRequest | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const history = useHistory();
  const loadingData = useRef(false);

  const fetchData = async () => {
    try {
      // Check rate limit
      let token = null;
      let emailRequestId = null;
      try {
        const keys = await SecureStoragePlugin.keys();
        token = keys.value.includes(sessionName)
          ? await SecureStoragePlugin.get({ key: sessionName })
          : null;
        emailRequestId = keys.value.includes(emailName)
          ? await SecureStoragePlugin.get({ key: emailName })
          : null;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      const settings = await CapacitorHttp.request({
        method: "GET",
        url: `${api_url}/api/auth/verify-email`,
        headers: {
          "Content-Type": "application/json",
          "Authorization-Session": token?.value ?? "",
          "Authorization-Email": emailRequestId?.value ?? "",
        },
      });
      console.log(settings.data);
      const settingsRes = await settings.data;
      if (!settingsRes.success) {
        if (settingsRes?.error === "UNAUTHORIZED") {
          await SecureStoragePlugin.clear();
          return history.push("/auth/login");
        }
        if (settingsRes?.error === "EXPIRED_CODE") {
          await SecureStoragePlugin.set({
            key: emailName,
            value: settingsRes.emailRequestId,
          });
          return history.push("/auth/verify-email");
        }
        if (settingsRes?.error === "EMAIL_ALREADY_VERIFIED") {
          return history.push("/auth/settings");
        }
        if (settingsRes.redirect) return history.push(settingsRes.redirect);
      }

      // Get data
      setVerificationRequest(settingsRes.verificationRequest);
      try {
        const keys = await SecureStoragePlugin.keys();
        keys.value.includes(emailName) &&
          (await SecureStoragePlugin.remove({ key: emailName }));
        await SecureStoragePlugin.set({
          key: emailName,
          value: settingsRes.emailRequestId,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setUser(settingsRes.user);

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
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="flex gap-4 flex-col justify-center dark:bg-background bg-background py-16 pt-96 items-center p-4 h-96 w-full">
      <h1 className="text-3xl font-bold mb-4 dark:text-white text-">
        Verify your email address
      </h1>
      <p>
        We sent an 8-digit code to {verificationRequest?.email ?? user?.email}.
      </p>
      <div className="max-w-md w-full">
        <EmailVerificationForm />
      </div>
      <Link className="text-md hover:underline m-2" to="/auth/settings">
        Change your email
      </Link>
    </div>
  );
}
