import { Link } from "react-router-dom";
import { AuthForm } from "../../components/auth/AuthForm";

export default function Page() {
  return (
    <div className="flex gap-4 flex-col justify-center dark:bg-background bg-background py-16 pt-96 items-center p-4 h-96 w-full">
      <AuthForm />
      <Link className="justify-self py-4" to="/auth/register">
        Need account?
      </Link>
    </div>
  );
}
