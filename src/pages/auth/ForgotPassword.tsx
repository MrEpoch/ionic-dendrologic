import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Link } from "react-router-dom";

export default function Page() {
	return (
		<>
			<h1>Forgot your password?</h1>
			<ForgotPasswordForm />
      <Link to="/auth/login">Sign in</Link>
		</>
	);
}
