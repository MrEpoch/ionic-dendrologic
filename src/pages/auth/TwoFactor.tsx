import { PasswordResetRecoveryCodeForm, PasswordResetTOTPForm } from "@/components/auth/PasswordResetForm";
import { TwoFactorVerificationForm } from "@/components/auth/TwoFactorSetUpForm";
import { api_url, sessionName } from "@/lib/config";
import { CapacitorHttp } from "@capacitor/core";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const history = useHistory();

  useEffect(() => {
    async function fetchData() {

      try {
        // Check rate limit
        let token = null;
        try {
          token = await SecureStoragePlugin.get({ key: sessionName });
        } catch (error) {
          console.error('Error fetching data:', error);
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
          if (twoFactorRes.redirect) return history.push(twoFactorRes.redirect);
          return history.push('/');
        }

        // Get data
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
			<h1>Two-factor authentication</h1>
			<p>Enter the code from your authenticator app.</p>
			<TwoFactorVerificationForm />
      <Link to="/auth/2fa/reset">Use recovery code</Link>
		</>
	);
}
