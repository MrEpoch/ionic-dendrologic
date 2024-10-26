import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { formSchemaCode } from "./PasswordResetForm";
import { CustomFieldCode } from "./CustomField";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { z } from "zod";
import { useHistory } from "react-router";
import { api_url, tokenCookieName } from "@/lib/config";
import { CapacitorHttp } from "@capacitor/core";

export function TwoFactorSetUpForm({ encodedTOTPKey }) {
  const [recoveryCode, setRecoveryCode] = useState("");
  const form = useForm<z.infer<typeof formSchemaCode>>({
    resolver: zodResolver(formSchemaCode),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchemaCode>) {
    console.log(values);
    const twoFactor = await CapacitorHttp.request({
      method: "POST",
      url: `${api_url}/api/auth/2fa/setup`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        code: values.code,
        key: encodedTOTPKey,
      })
    });

    const twoFactorRes = await twoFactor.data;
    console.log(twoFactorRes);
    if (twoFactorRes.success) {
      console.log("Success", twoFactorRes);
      setRecoveryCode(twoFactorRes.recoveryCode);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomFieldCode
          control={form.control}
          name="code"
          formLabel={"Code"}
          render={({ field }) => (
            <Input type="text" value={field.value} {...field} />
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
      {recoveryCode && <p>Recovery code: {recoveryCode}</p>}
    </Form>
  );
}

export function TwoFactorVerificationForm() {
  const form = useForm<z.infer<typeof formSchemaCode>>({
    resolver: zodResolver(formSchemaCode),
    defaultValues: {
      code: "",
    },
  });

  const history = useHistory();

  async function onSubmit(values: z.infer<typeof formSchemaCode>) {
    console.log(values);
    const twoFactor = await CapacitorHttp.request({
      method: "POST",
      url: `${api_url}/api/auth/2fa`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        code: values.code
      }),
    });
    const twoFactorRes = await twoFactor.data;
    if (twoFactorRes.success) {
      history.push("/");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomFieldCode
          control={form.control}
          name="code"
          formLabel={"Code"}
          render={({ field }) => (
            <Input autoComplete="one-time-code" id="form-totp.code" type="text" value={field.value} {...field} />
          )}
        />
        <Button type="submit">Verify</Button>
      </form>
    </Form>
  );
}

export function TwoFactorResetForm() {
  const form = useForm<z.infer<typeof formSchemaCode>>({
    resolver: zodResolver(formSchemaCode),
    defaultValues: {
      code: "",
    },
  });

  const history = useHistory();

  async function onSubmit(values: z.infer<typeof formSchemaCode>) {
    console.log(values);
    const twoFactor = await CapacitorHttp.request({
      method: "POST",
      url: `${api_url}/api/auth/2fa/reset`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        code: values.code
      }),
    });
    const twoFactorRes = await twoFactor.data;
    if (twoFactorRes.success) {
      history.push("/auth/2fa/setup");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomFieldCode
          control={form.control}
          name="code"
          formLabel={"Recovery Code"}
          render={({ field }) => (
            <Input autoComplete="one-time-code" id="form-totp.code" type="text" value={field.value} {...field} />
          )}
        />
        <Button type="submit">Verify</Button>
      </form>
    </Form>
  );
}
