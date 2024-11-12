import { AuthForm } from "@/components/auth/AuthForm";
import { IonBackButton, IonButtons, IonHeader, IonToolbar } from "@ionic/react";
import { Link } from "react-router-dom";

export default function Page() {
  return (
    <div className="flex gap-4 flex-col justify-center dark:bg-background bg-background items-center h-full w-full">

      <AuthForm authType="register" />
      <Link className="justify-self" to="/auth/login">Have account? Log In</Link>
    </div>
  );
}
