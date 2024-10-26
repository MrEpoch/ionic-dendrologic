import { api_url } from "@/lib/config";
import { CapacitorHttp } from "@capacitor/core";
import React, { useState } from "react";
import { useHistory } from "react-router";

export function EmailVerificationForm() {
  const [code, setCode] = useState("");

  const history = useHistory();

  async function onSubmit(e) {
    e.preventDefault();
    console.log("sending", code);
    const response = await CapacitorHttp.request({
      method: "POST",
      url: `${api_url}/api/auth/verify-email`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        code: code,
      })
    });

    const data = await response.data;
    if (data.redirect) {
      history.push(data.redirect ? data.redirect : "/");
    }
    history.push("/auth/settings");
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

  async function onSubmit() {
    const response = await CapacitorHttp.request({
      method: "POST",
      url: `${api_url}/api/auth/verify-email/resend`,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.data;
    if (data.redirect) {
      history.push(data.redirect ? data.redirect : "/");
    }
    if (data.success) history.push("/");
  }

  return (
    <form onSubmit={onSubmit}>
      <button>Resend code</button>
    </form>
  );
}
