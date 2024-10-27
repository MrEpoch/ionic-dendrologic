import { EmailVerificationForm, ResendEmailVerificationForm } from "@/components/auth/EmailVerificationForm";
import { api_url, emailName, sessionName } from "@/lib/config";
import { EmailVerificationRequest, User } from "@/types";
import { CapacitorHttp } from "@capacitor/core";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [verificationRequest, setVerificationRequest] = useState<EmailVerificationRequest | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const history = useHistory();

  const fetchData = useCallback(async () => {
    try {
      // Check rate limit
      let token = null;
      let emailRequestId = null;
      try {
        token = await SecureStoragePlugin.get({ key: sessionName });
        emailRequestId = await SecureStoragePlugin.get({ key: emailName });
      } catch (error) {
        console.error('Error fetching data:', error);
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
        if (settingsRes.redirect) return history.push(settingsRes.redirect);
        return history.push('/');
      }

      // Get data
      setVerificationRequest(settingsRes.verificationRequest);
      try {
        await SecureStoragePlugin.set({ key: emailName, value: settingsRes.emailRequestId });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setUser(settingsRes.user);

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
      <h1>Verify your email address</h1>
      <p>
        We sent an 8-digit code to {verificationRequest?.email ?? user?.email}.
      </p>
      <EmailVerificationForm />
      <ResendEmailVerificationForm />
      <Link to="/auth/settings">Change your email</Link>
    </>
  );
}
