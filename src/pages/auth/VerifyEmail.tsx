import { EmailVerificationForm, ResendEmailVerificationForm } from "@/components/auth/EmailVerificationForm";
import { api_url, tokenCookieName } from "@/lib/config";
import { EmailVerificationRequest, User } from "@/types";
import { CapacitorHttp } from "@capacitor/core";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

export default async function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [verificationRequest, setVerificationRequest] = useState<EmailVerificationRequest | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const history = useHistory();

  useEffect(() => {
    async function fetchData() {

      try {
        // Check rate limit
        const settings = await CapacitorHttp.request({
          method: "GET",
          url: `${api_url}/api/auth/verify-email`,
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
        setVerificationRequest(settingsRes.verificationRequest);
        setUser(settingsRes.user);

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
      <p>
        We sent an 8-digit code to {verificationRequest?.email ?? user?.email}.
      </p>
      <EmailVerificationForm />
      <ResendEmailVerificationForm />
      <Link to="/auth/settings">Change your email</Link>
    </>
  );
}
