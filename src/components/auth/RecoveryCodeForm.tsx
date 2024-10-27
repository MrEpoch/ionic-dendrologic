import { Button } from "@/components/ui/button";
import { api_url, sessionName } from "@/lib/config";
import { CapacitorHttp } from "@capacitor/core";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import React, { useState } from "react";

export function RecoveryCodeForm({ recoveryCode }) {
  const [recoveryCodeState, setRecoveryCodeState] = useState(recoveryCode);

  async function onSubmit(e) {
    e.preventDefault();
    let token = null;
    try {
      token = await SecureStoragePlugin.get({ key: sessionName });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    const recoveryCodeApi = await CapacitorHttp.request({
      method: "POST",
      url: `${api_url}/api/auth/settings/regenerate-recovery-code`,
      headers: {
        "Content-Type": "application/json",
        "Authorization-Session": token?.value ?? "",
      },
      data: JSON.stringify({}),
    });
    const codeResponse = await recoveryCodeApi.data;
    if (codeResponse.success && codeResponse.recoveryCode) {
      console.log("Success", codeResponse);
      setRecoveryCodeState(codeResponse.recoveryCode);
    }
  }

  return (
    <>
      <h2>Recovery code</h2>
      <p>{recoveryCodeState}</p>
      <form className="space-y-8">
        <Button onClick={onSubmit} type="button">Generate new recovery code</Button>
      </form>
    </>
  );
}
