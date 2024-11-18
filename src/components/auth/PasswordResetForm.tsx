import { z } from "zod";
import { formSchemaPassword } from "./UpdateForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { CustomFieldPassword, CustomFieldCode } from "./CustomField";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useHistory } from "react-router-dom";
import { CapacitorHttp } from "@capacitor/core";
import { api_url, passwordResetSessionName, sessionName } from "@/lib/config";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";

export function PasswordResetForm() {
  const history = useHistory();
  const form = useForm<z.infer<typeof formSchemaPassword>>({
    resolver: zodResolver(formSchemaPassword),
    defaultValues: {
      password: "",
      newPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchemaPassword>) {
    let token = null;
    try {
      const keys = await SecureStoragePlugin.keys();
      token = keys.value.includes(passwordResetSessionName)
        ? await SecureStoragePlugin.get({ key: passwordResetSessionName })
        : null;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    const password = await CapacitorHttp.request({
      method: "POST",
      url: `${api_url}/api/auth/reset-password`,
      headers: {
        "Content-Type": "application/json",
        "Authorization-Password-Session": token?.value ?? "",
      },
      data: JSON.stringify({
        password: values.password,
        newPassword: values.newPassword,
      }),
    });

    const passwordResponse = await password.data;
    if (passwordResponse?.error === "UNAUTHORIZED")
      await SecureStoragePlugin.clear();
    if (passwordResponse.success) {
      console.log("Success", passwordResponse);
      const keys = await SecureStoragePlugin.keys();
      keys.value.includes(passwordResetSessionName) &&
        (await SecureStoragePlugin.remove({ key: passwordResetSessionName }));
      keys.value.includes(sessionName) &&
        (await SecureStoragePlugin.remove({ key: sessionName }));
      await SecureStoragePlugin.set({
        key: sessionName,
        value: passwordResponse.sessionToken,
      });
      if (passwordResponse.redirect)
        return history.push(passwordResponse.redirect);
      return history.push("/auth/settings");
    }
    if (passwordResponse.redirect)
      return history.push(passwordResponse.redirect);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomFieldPassword
          control={form.control}
          name="password"
          formLabel={"Password"}
          render={({ field }) => (
            <Input type="password" value={field.value} {...field} />
          )}
        />
        <CustomFieldPassword
          control={form.control}
          name="newPassword"
          formLabel={"New password"}
          render={({ field }) => (
            <Input type="password" value={field.value} {...field} />
          )}
        />
        <Button type="submit">Reset password</Button>
      </form>
    </Form>
  );
}

export const formSchemaCode = z
  .object({
    code: z
      .string()
      .min(6, { message: "Code must be 6 characters or more" })
      .max(28, { message: "Code must be 28 characters or less" }),
  })
  .required();

export function PasswordResetTOTPForm() {
  const history = useHistory();

  const form = useForm<z.infer<typeof formSchemaCode>>({
    resolver: zodResolver(formSchemaCode),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchemaCode>) {
    console.log(values);
    let token = null;
    try {
      const keys = await SecureStoragePlugin.keys();
      token = keys.value.includes(passwordResetSessionName)
        ? await SecureStoragePlugin.get({ key: passwordResetSessionName })
        : null;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    const password = await CapacitorHttp.request({
      method: "POST",
      url: `${api_url}/api/auth/reset-password/2fa/totp-reset`,
      headers: {
        "Content-Type": "application/json",
        "Authorization-Password-Session": token?.value ?? "",
      },
      data: JSON.stringify({
        code: values.code,
      }),
    });
    const twoFactorRes = await password.data;
    if (twoFactorRes?.error === "UNAUTHORIZED")
      await SecureStoragePlugin.clear();
    if (twoFactorRes.redirect) return history.push(twoFactorRes.redirect);
    {
      if (twoFactorRes.success) {
        console.log("Success", twoFactorRes);
        return history.push("/auth/reset-password");
      }
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
    </Form>
  );
}

export function PasswordResetRecoveryCodeForm() {
  const history = useHistory();

  const form = useForm<z.infer<typeof formSchemaCode>>({
    resolver: zodResolver(formSchemaCode),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchemaCode>) {
    console.log(values);
    let token = null;
    try {
      const keys = await SecureStoragePlugin.keys();
      token = keys.value.includes(passwordResetSessionName)
        ? await SecureStoragePlugin.get({ key: passwordResetSessionName })
        : null;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    const password = await CapacitorHttp.request({
      method: "POST",
      url: `${api_url}/api/auth/reset-password/2fa/2fa-with-recovery-code`,
      headers: {
        "Content-Type": "application/json",
        "Authorization-Password-Session": token?.value ?? "",
      },
      data: JSON.stringify({
        code: values.code,
      }),
    });
    const twoFactorRes = await password.data;
    if (twoFactorRes?.error === "UNAUTHORIZED")
      await SecureStoragePlugin.clear();
    if (twoFactorRes.redirect) return history.push(twoFactorRes.redirect);
    {
      if (twoFactorRes.success) {
        console.log("Success", twoFactorRes);
        return history.push("/auth/reset-password");
      }
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
            <Input type="text" value={field.value} {...field} />
          )}
        />
        <Button type="submit">Verify</Button>
      </form>
    </Form>
  );
}

export function PasswordResetEmailVerificationForm() {
  const history = useHistory();

  const form = useForm<z.infer<typeof formSchemaCode>>({
    resolver: zodResolver(formSchemaCode),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchemaCode>) {
    console.log(values);
    let token = null;
    try {
      const keys = await SecureStoragePlugin.keys();
      token = keys.value.includes(passwordResetSessionName)
        ? await SecureStoragePlugin.get({ key: passwordResetSessionName })
        : null;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    const password = await CapacitorHttp.request({
      method: "POST",
      url: `${api_url}/api/auth/reset-password/verify-email`,
      headers: {
        "Content-Type": "application/json",
        "Authorization-Password-Session": token?.value ?? "",
      },
      data: JSON.stringify({
        code: values.code,
      }),
    });
    const twoFactorRes = await password.data;
    console.log(twoFactorRes);
    if (twoFactorRes?.error === "UNAUTHORIZED")
      await SecureStoragePlugin.clear();
    if (twoFactorRes.redirect) return history.push(twoFactorRes.redirect);
    if (twoFactorRes.success) {
      console.log("Success", twoFactorRes);
      return history.push("/auth/reset-password");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomFieldCode
          control={form.control}
          name="code"
          formLabel={"Email Code"}
          render={({ field }) => (
            <Input type="text" value={field.value} {...field} />
          )}
        />
        <Button type="submit">Verify</Button>
      </form>
    </Form>
  );
}
