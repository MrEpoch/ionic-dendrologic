import { useForm } from "react-hook-form";
import { formSchemaEmail } from "./UpdateForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "../ui/form";
import { CustomFieldEmail } from "./CustomField";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useHistory } from "react-router-dom";
import { CapacitorHttp } from "@capacitor/core";
import { api_url, passwordResetSessionName } from "@/lib/config";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";

export function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof formSchemaEmail>>({
    resolver: zodResolver(formSchemaEmail),
    defaultValues: {
      email: "",      
    },
  });

  const history = useHistory();

  async function onSubmit(values: z.infer<typeof formSchemaEmail>) {
      const email = await CapacitorHttp.request({
        method: "POST",
        url: `${api_url}/api/auth/forgot-password`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          email: values.email
        }),
      });

      const emailResponse = await email.data;
      if (emailResponse.success) {
        await SecureStoragePlugin.set({ key: passwordResetSessionName, value: emailResponse.sessionToken });
        if (emailResponse.redirect) return history.push(emailResponse.redirect);
        console.log("Success", emailResponse);
        return history.push("/auth/reset-password/verify-email");
      }
      if (emailResponse.redirect) return history.push(emailResponse.redirect);
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CustomFieldEmail
            control={form.control}
            name="email"
            formLabel={"Email"}
            render={({ field }) => (
              <Input type="email" value={field.value} {...field} />
            )}
          />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
