import { PasswordResetEmailVerificationForm } from "@/components/auth/PasswordResetForm";
import { api_url, passwordResetSessionName } from "@/lib/config";
import { PasswordResetSession } from "@/types";
import { CapacitorHttp } from "@capacitor/core";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<PasswordResetSession | null>(null);
  const history = useHistory();

  useEffect(() => {
    async function fetchData() {

      try {
        // Check rate limit
        let token = null;
        try {
          token = await SecureStoragePlugin.get({ key: passwordResetSessionName });
        } catch (error) {
          console.error('Error fetching data:', error);
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
          if (resetPasswordRes.redirect) return history.push(resetPasswordRes.redirect);
          return history.push('/');
        }

        // Get data
        setSession(resetPasswordRes.session);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, [history]);

  if (loading) return <div>Loading...</div>;
	return (
		<>
			<h1>Verify your email address</h1>
			<p>We sent an 8-digit code to {session?.email}.</p>
			<PasswordResetEmailVerificationForm />
		</>
	);
}
