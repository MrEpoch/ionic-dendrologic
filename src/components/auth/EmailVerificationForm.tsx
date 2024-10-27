import { api_url, emailName, sessionName } from "@/lib/config";
import { CapacitorHttp } from "@capacitor/core";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export function EmailVerificationForm() {
  const [code, setCode] = useState("");

  const history = useHistory();

  async function onSubmit(e) {
    e.preventDefault();
    console.log("sending", code);
    let token = null;
    let emailRequestId = null;
    try {
      token = await SecureStoragePlugin.get({ key: sessionName });
      emailRequestId = await SecureStoragePlugin.get({ key: emailName });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    const response = await CapacitorHttp.request({
      method: "POST",
      url: `${api_url}/api/auth/verify-email`,
      headers: {
        "Content-Type": "application/json",
        "Authorization-Session": token?.value ?? "",
        "Authorization-Email": emailRequestId?.value ?? "",
      },
      data: JSON.stringify({
        code: code,
      })
    });

    const data = await response.data;
    if (data.success) {
      console.log(data);
      if (data.emailRequestId) await SecureStoragePlugin.set({ key: emailName, value: data.emailRequestId });
      if (data.redirect) return history.push(data.redirect);
      return history.push("/auth/settings");
    } else {
      if (data.redirect) {
        return history.push(data.redirect);
      }
      return history.push("/");
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="form-verify.code">Email code</label>
      <input
        id="form-verify.code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        name="code"
        required
      />
      <br />
      <button>Verify</button>
    </form>
  );
}

export function ResendEmailVerificationForm() {
  const history = useHistory();

  async function onSubmit(e) {
    e.preventDefault();
    let token = null;
    let emailRequestId = null;
    try {
      token = await SecureStoragePlugin.get({ key: sessionName });
      emailRequestId = await SecureStoragePlugin.get({ key: emailName });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    const response = await CapacitorHttp.request({
      method: "POST",
      url: `${api_url}/api/auth/verify-email/resend`,
      headers: {
        "Content-Type": "application/json",
        "Authorization-Session": token?.value ?? "",
        "Authorization-Email": emailRequestId?.value ?? "",
      },
    });

    const data = await response.data;
    if (data.success) {
      if (data.emailRequestId) await SecureStoragePlugin.set({ key: emailName, value: data.emailRequestId });
      if (data.redirect) return history.push(data.redirect);
    } else {
      if (data.redirect) {
        return history.push(data.redirect);
      }
      return history.push("/");
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <button>Resend code</button>
    </form>
  );
}
