import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomField from "./CustomField";
import { useHistory } from "react-router";
import { api_url } from "@/lib/config";
import { CapacitorHttp } from "@capacitor/core";

export const formSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: "Musi být nejkratě 1 znak" })
    .max(255, { message: "Musi být měně než 255 znaků" })
    .optional(),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Musí být 8 nebo více písmen dlouhé" })
      .max(200, { message: "Musí být méně než 250 písmen dlouhé" }),
    passwordConfirm: z.string().optional(),
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (typeof passwordConfirm === "string" && password !== passwordConfirm) {
      ctx.addIssue({
        code: "custom",
        message: "Hesla se neschodují",
        path: ["passwordConfirm"],
      });
    }
  });

export function AuthForm({
  authType = "login",
}: {
  authType?: "login" | "register";
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: authType === "register" ? {
      email: "",
      password: "",
      passwordConfirm: "",
      username: "",
    } : { email: "", password: "" },
  });

  const history = useHistory();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    if (authType === "register") {
      const user = await CapacitorHttp.request({
        method: "POST",
        url: `${api_url}/api/auth/register`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        })
      });
      console.log(user.data);

      const userResponse = await user.data;

      if (userResponse.redirect) history.push(userResponse.redirect);

      if (userResponse.success) {
        console.log("Success", userResponse);
        history.push("/auth/2fa/setup");
      }
    } else {
      const user = await CapacitorHttp.request({
        method: "POST",
        url: `${api_url}/api/auth/login`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          email: values.email,
          password: values.password,
        })
      });
      const userResponse = await user.data;
      if (userResponse.redirect) history.push(userResponse.redirect);
      if (userResponse.success) {
        console.log("Success", userResponse);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {authType === "register" && (
          <CustomField
            control={form.control}
            name="username"
            formLabel={"Username"}
            render={({ field }) => (
              <Input type="text" value={field.value} {...field} />
            )}
          />
        )}
        <CustomField
          control={form.control}
          name="email"
          formLabel={"Email"}
          render={({ field }) => (
            <Input type="email" value={field.value} {...field} />
          )}
        />
        <CustomField
          control={form.control}
          name="password"
          formLabel={"password"}
          render={({ field }) => (
            <Input type="password" value={field.value} {...field} />
          )}
        />
        {authType === "register" && (
          <CustomField
            control={form.control}
            name="passwordConfirm"
            formLabel={"password confirm"}
            render={({ field }) => (
              <Input type="password" value={field.value} {...field} />
            )}
          />
        )}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
