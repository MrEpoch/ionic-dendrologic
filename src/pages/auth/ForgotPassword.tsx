import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { IonContent } from "@ionic/react";
import { Link } from "react-router-dom";

export default function Page() {
	return (
    <div className="flex gap-4 flex-col justify-center dark:bg-background bg-background items-center h-full w-full">
			<h1>Forgot your password?</h1>
			<ForgotPasswordForm />
      <Link to="/auth/login">Sign in</Link>
		</div>
	);
}
