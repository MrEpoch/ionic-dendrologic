import { PasswordResetForm } from "@/components/auth/PasswordResetForm";
import { api_url, passwordResetSessionName } from "@/lib/config";
import { CapacitorHttp } from "@capacitor/core";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const history = useHistory();


  const fetchData = useCallback(async () => {
    try {
      let token = null;
      try {
        token = await SecureStoragePlugin.get({ key: passwordResetSessionName });
      } catch (error) {
        console.error('Error fetching data:', error);
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
        if (resetPasswordRes.redirect) return history.push(resetPasswordRes.redirect);
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
			<h1>Enter your new password</h1>
			<PasswordResetForm />
		</>
	);
}
