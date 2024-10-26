import { api_url, tokenCookieName } from "@/lib/config";
import { CapacitorHttp } from "@capacitor/core";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { TwoFactorResetForm } from "@/components/auth/TwoFactorSetUpForm";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const history = useHistory();

  useEffect(() => {
    async function fetchData() {

      try {
        // Check rate limit
        const settings = await CapacitorHttp.request({
          method: "GET",
          url: `${api_url}/api/auth/2fa/reset`,
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(settings.data);
        const settingsRes = await settings.data;
        if (!settingsRes.success) {
          if (settingsRes.redirect) history.push(settingsRes.redirect);
          history.push('/');
          return;
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
			<h1>Recover your account</h1>
			<TwoFactorResetForm />
    </>
  );
}
