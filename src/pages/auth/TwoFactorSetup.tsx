import { api_url, tokenCookieName } from "@/lib/config";
import { CapacitorHttp } from "@capacitor/core";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { TwoFactorSetUpForm } from "@/components/auth/TwoFactorSetUpForm";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const history = useHistory();
  const [keyURI, setKeyURI] = useState<string>("");
  const [qrCode, setQRCode] = useState<string | null>(null);
  const [encodedTOTPKey, setEncodedTOTPKey] = useState<string>("");


  useEffect(() => {
    async function fetchData() {

      try {
        // Check rate limit
        const settings = await CapacitorHttp.request({
          method: "GET",
          url: `${api_url}/api/auth/2fa/setup`,
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

        setKeyURI(settingsRes.keyURI);
        setEncodedTOTPKey(settingsRes.encodedTOTPKey);
        setQRCode(settingsRes.qrCode);

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
      <h1>Set up two-factor authentication</h1>
      <div
        style={{
          width: "200px",
          height: "200px",
        }}
        dangerouslySetInnerHTML={{
          __html: qrCode,
        }}
      ></div>
      <TwoFactorSetUpForm encodedTOTPKey={encodedTOTPKey} />
    </>
  );
}
