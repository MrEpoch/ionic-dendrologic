import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Link } from "react-router-dom";

export default function Page() {
  return (
    <div className="flex gap-4 flex-col justify-center dark:bg-background bg-background py-16 pt-96 items-center p-4 h-96 w-full">
      <h1>Forgot your password?</h1>
      <ForgotPasswordForm />
      <Link to="/auth/login">Sign in</Link>
    </div>
  );
}
