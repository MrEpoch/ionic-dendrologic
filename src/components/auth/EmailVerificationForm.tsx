import { api_url, emailName, sessionName } from "@/lib/config";
import { CapacitorHttp } from "@capacitor/core";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Button } from "../ui/button";

export function EmailVerificationForm() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const history = useHistory();

  async function onSubmit(e) {
    e.preventDefault();
    console.log("sending", code);
    let token = null;
    let emailRequestId = null;
    try {
      const keys = await SecureStoragePlugin.keys();
      token = keys.value.includes(sessionName)
        ? await SecureStoragePlugin.get({ key: sessionName })
        : null;
      emailRequestId = keys.value.includes(emailName)
        ? await SecureStoragePlugin.get({ key: emailName })
        : null;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    console.log(token, emailRequestId);
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
      }),
    });

    const data = await response.data;

    if (data?.error === "UNAUTHORIZED") await SecureStoragePlugin.clear();
    if (data?.error === "EXPIRED_CODE") {
      await SecureStoragePlugin.set({
        key: emailName,
        value: data.emailRequestId,
      });
      console.log("expired");
      setMessage("Code is expired, we send another one.");
      return;
    }
    if (data.success) {
      console.log(data);
      const keys = await SecureStoragePlugin.keys();
      keys.value.includes(emailName) &&
        (await SecureStoragePlugin.remove({ key: emailName }));
      if (data.redirect) return history.push(data.redirect);
      return history.push("/auth/2fa");
    } else {
      if (data.redirect) {
        return history.push(data.redirect);
      }
    }
  }

  return (
    <form
      className="space-y-2 items-center flex w-full flex-col"
      onSubmit={onSubmit}
    >
      <label htmlFor="form-verify.code">Email code</label>
      <InputOTP
        id="form-verify.code"
        required
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        inputMode="text"
        maxLength={8}
        value={code}
        onChange={(value) => setCode(value)}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
          <InputOTPSlot index={6} />
          <InputOTPSlot index={7} />
        </InputOTPGroup>
      </InputOTP>
      <br />
      <div className="flex gap-2">
        <Button className="w-fit self-center">Verify</Button>
      </div>
      <p className="text-red-500">{message}</p>
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
      const keys = await SecureStoragePlugin.keys();
      token = keys.value.includes(sessionName)
        ? await SecureStoragePlugin.get({ key: sessionName })
        : null;
      emailRequestId = keys.value.includes(emailName)
        ? await SecureStoragePlugin.get({ key: emailName })
        : null;
    } catch (error) {
      console.error("Error fetching data:", error);
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
    if (data?.error === "UNAUTHORIZED") await SecureStoragePlugin.clear();
    if (data.success) {
      if (data.emailRequestId) {
        const keys = await SecureStoragePlugin.keys();
        keys.value.includes(emailName) &&
          (await SecureStoragePlugin.remove({ key: emailName }));
        await SecureStoragePlugin.set({
          key: emailName,
          value: data.emailRequestId,
        });
      }
      if (data.redirect) return history.push(data.redirect);
    } else {
      if (data.redirect) {
        return history.push(data.redirect);
      }
      return history.push("/");
    }
  }

  return (
    <form className="" onSubmit={onSubmit}>
      <Button className="w-fit self-start" variant={"secondary"}>
        Resend code
      </Button>
    </form>
  );
}
