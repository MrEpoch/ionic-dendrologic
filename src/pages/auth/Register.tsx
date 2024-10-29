import { AuthForm } from "@/components/auth/AuthForm";

export default function Page() {
  return (
    <div className="flex gap-4 flex-col justify-center dark:bg-background bg-background items-center h-full w-full">
      <AuthForm authType="register" />
    </div>
  );
}
