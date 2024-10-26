import { RecoveryCodeForm } from "@/components/auth/RecoveryCodeForm";
import { EmailUpdateForm, PasswordUpdateForm } from "@/components/auth/UpdateForm";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Session, User } from "@/types";
import { CapacitorHttp } from "@capacitor/core";
import { api_url, tokenCookieName } from "@/lib/config";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    async function fetchData() {

      try {
        // Check rate limit
        const settings = await CapacitorHttp.request({
          method: "GET",
          url: `${api_url}/api/auth/settings`,
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
        setSession(settingsRes.session);
        setUser(settingsRes.user);
        setRecoveryCode(settingsRes.recoveryCode);

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
    <div>
			<header>
				<Link to="/">Home</Link>
        <Link to="/auth/settings">Settings</Link>
			</header>
			<main>
				<h1>Settings</h1>
				<section>
					<h2>Update email</h2>
					<p>Your email: {user?.email}</p>
					<EmailUpdateForm />
				</section>
				<section>
					<h2>Update password</h2>
					<PasswordUpdateForm />
				</section>
				{user?.registered2FA && (
					<section>
						<h2>Update two-factor authentication</h2>
            <Link to="/auth/2fa/setup">Update</Link>
					</section>
				)}
				{recoveryCode !== null && <RecoveryCodeForm recoveryCode={recoveryCode} />}
      </main>  
    </div>
  );
}
