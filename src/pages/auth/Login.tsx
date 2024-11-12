import { Link } from "react-router-dom";
import { AuthForm } from "../../components/auth/AuthForm";

export default function Page() {
  return (
    <div className="flex gap-4 flex-col justify-center dark:bg-background bg-background items-center h-full w-full">
      <AuthForm />
      <Link className="justify-self" to="/auth/register">Need account?</Link>
    </div>
  );
}
