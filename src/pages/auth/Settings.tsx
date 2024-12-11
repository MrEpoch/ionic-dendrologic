import { RecoveryCodeForm } from "@/components/auth/RecoveryCodeForm";
import {
  EmailUpdateForm,
  PasswordUpdateForm,
} from "@/components/auth/UpdateForm";
import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { User } from "@/types";
import { CapacitorHttp } from "@capacitor/core";
import { api_url, sessionName } from "@/lib/config";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { Cog, House } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);
  const history = useHistory();
  const loadingData = useRef(false);

  const fetchData = async () => {
    try {
      // Check rate limit
      let token = null;
      try {
        const keys = await SecureStoragePlugin.keys();
        token = keys.value.includes(sessionName)
          ? await SecureStoragePlugin.get({ key: sessionName })
          : null;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      const settings = await CapacitorHttp.request({
        method: "GET",
        url: `${api_url}/api/auth/settings`,
        headers: {
          "Content-Type": "application/json",
          "Authorization-Session": token?.value ?? "",
        },
      });
      console.log(settings.data);
      const settingsRes = await settings.data;
      if (!settingsRes.success) {
        if (settingsRes?.error === "UNAUTHORIZED")
          await SecureStoragePlugin.clear();
        if (settingsRes.redirect) return history.push(settingsRes.redirect);
        return history.push("/");
      }

      // Get data
      setUser(settingsRes.user);
      setRecoveryCode(settingsRes.recoveryCode);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loadingData.current) {
      loadingData.current = true;
      fetchData();
    }
  }, [history]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="h-full flex gap-4 flex-col justify-center dark:bg-background bg-background py-16 pt-96 items-center p-4 w-full">
      <main className="min-h-screen w-full items-center flex flex-col gap-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <section className="flex flex-col gap-4 max-w-md w-full">
          <div className="bg-gray-600 rounded w-full h-1" />
          <h2 className="text-2xl font-semibold">Update email</h2>
          <p>Your email: {user?.email}</p>
          <EmailUpdateForm />
        </section>
        <section className="flex flex-col gap-4 max-w-md w-full">
          <div className="bg-gray-600 rounded w-full h-1" />
          <h2 className="text-2xl font-semibold">Update password</h2>
          <PasswordUpdateForm />
        </section>
        {user?.registered2FA && (
          <section className="flex flex-col gap-4 max-w-md w-full">
            <div className="bg-gray-600 rounded w-full h-1" />
            <Link to="/auth/2fa/setup">
              <Button>Update two-factor auth</Button>
            </Link>
          </section>
        )}
        <div className="bg-gray-600 rounded max-w-md w-full h-1" />
        {recoveryCode !== null && (
          <RecoveryCodeForm recoveryCode={recoveryCode} />
        )}
        <footer className="flex gap-2 w-full justify-between items-center">
          <Link className="justify-self flex p-4 gap-2 hover:underline" to="/">
            <House />
            <span>Home</span>
          </Link>
          <Link
            className="justify-self flex p-4 gap-2 hover:underline"
            to="/auth/settings"
          >
            <Cog />
            <span>Settings</span>
          </Link>
        </footer>
      </main>
    </div>
  );
}
