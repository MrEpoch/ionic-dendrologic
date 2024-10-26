import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CustomFieldEmail, CustomFieldPassword } from "./CustomField";
import { useHistory } from "react-router";
import { CapacitorHttp } from "@capacitor/core";
import { api_url } from "@/lib/config";

export const formSchemaEmail = z
  .object({
    email: z.string().email(),
  })
export const formSchemaPassword = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Musí být 8 nebože písmen dlouhé" })
      .max(255, { message: "Musí být méně než 255 písmen dlouhé" }),
    password: z.string().min(8, { message: "Musi být nejkratě 8 znaků" }).max(255, { message: "Musi být měně než 255 znaků" }),
  })

export function PasswordUpdateForm() {
  const form = useForm<z.infer<typeof formSchemaPassword>>({
    resolver: zodResolver(formSchemaPassword),
    defaultValues: {
      password: "",
      newPassword: "",
    },
  });

  const history = useHistory();


  async function onSubmit(values: z.infer<typeof formSchemaPassword>) {
    console.log(values);
      const password = await CapacitorHttp.request({
        method: "POST",
        url: `${api_url}/api/auth/settings/update-password`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          password: values.password,
          newPassword: values.newPassword,
        }),
      });
      const passwordResponse = await password.data;
      if (passwordResponse.redirect) history.push(passwordResponse.redirect);
      if (passwordResponse.success) {
        console.log("Success", passwordResponse);
        history.push("/auth/settings");
      }
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
          formLabel={"New Password"}
          render={({ field }) => (
            <Input type="password" value={field.value} {...field} />
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
export function EmailUpdateForm() {
  const form = useForm<z.infer<typeof formSchemaEmail>>({
    resolver: zodResolver(formSchemaEmail),
    defaultValues: {
      email: "",      
    },
  });

  const history = useHistory();

  async function onSubmit(values: z.infer<typeof formSchemaEmail>) {
    console.log(values);
      const email = await CapacitorHttp.request({
        method: "POST",
        url: `${api_url}/api/auth/settings/update-email`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          email: values.email,
        }),
      });
      const emailResponse = await email.data;
      if (emailResponse.redirect) history.push(emailResponse.redirect);
      if (emailResponse.success) {
        console.log("Success", emailResponse);
        history.push("/auth/settings");
      }
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
