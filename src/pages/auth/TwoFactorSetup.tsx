import { api_url, sessionName } from "@/lib/config";
import { CapacitorHttp } from "@capacitor/core";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { TwoFactorSetUpForm } from "@/components/auth/TwoFactorSetUpForm";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import Copy2FACodeToClipboard from "@/components/auth/Copy2FACodeToClipboard";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const history = useHistory();
  const [keyURI, setKeyURI] = useState<string>("");
  const [qrCode, setQRCode] = useState<string | null>(null);
  const [encodedTOTPKey, setEncodedTOTPKey] = useState<string>("");
  const loadingData = useRef(false);

  const fetchData = async () => {
    try {
        let token = null;
        try {
          const keys = await SecureStoragePlugin.keys();
          token = keys.value.includes(sessionName) ? await SecureStoragePlugin.get({ key: sessionName }) : null;
        } catch (error) {
          console.error('Error fetching data:', error);
        }
        const twoFactor = await CapacitorHttp.request({
          method: "GET",
          url: `${api_url}/api/auth/2fa/setup`,
          headers: {
            "Content-Type": "application/json",
            "Authorization-Session": token?.value ?? "",
          },
        });
        console.log(twoFactor.data);
        const twoFactorRes = await twoFactor.data;
        if (!twoFactorRes.success) {
          if (twoFactorRes?.error === "UNAUTHORIZED") await SecureStoragePlugin.clear();
          if (twoFactorRes.redirect) return history.push(twoFactorRes.redirect);
          return history.push('/');
        }

        // Get data

        setKeyURI(twoFactorRes.keyURI);
        setEncodedTOTPKey(twoFactorRes.encodedTOTPKey);
        setQRCode(twoFactorRes.qrCode);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

  useEffect(() => {
    if (!loadingData.current) {
      loadingData.current = true;
      fetchData();
    }

    return () => {
      loadingData.current = false;
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col justify-center dark:bg-background bg-background items-center h-full w-full">
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
      <Copy2FACodeToClipboard code={keyURI.split("=")[3].split("&")[0]} />
      <TwoFactorSetUpForm encodedTOTPKey={encodedTOTPKey} />
    </div>
  );
}
