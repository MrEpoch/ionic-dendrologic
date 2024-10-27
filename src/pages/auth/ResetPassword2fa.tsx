import { PasswordResetRecoveryCodeForm, PasswordResetTOTPForm } from "@/components/auth/PasswordResetForm";
import { api_url, passwordResetSessionName } from "@/lib/config";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { CapacitorHttp } from "@capacitor/core";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const history = useHistory();


  const fetchData = useCallback(async () => {
    try {
      // Check rate limit
      let token = null;
      try {
        token = await SecureStoragePlugin.get({ key: passwordResetSessionName });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      const settings = await CapacitorHttp.request({
        method: "GET",
        url: `${api_url}/api/auth/reset-password/2fa`,
        headers: {
          "Content-Type": "application/json",
          "Authorization-Password-Session": token?.value ?? "",
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
			<h1>Two-factor authentication</h1>
			<p>Enter the code from your authenticator app.</p>
			<PasswordResetTOTPForm />
			<section>
				<h2>Use your recovery code instead</h2>
				<PasswordResetRecoveryCodeForm />
			</section>
		</>
	);
}
