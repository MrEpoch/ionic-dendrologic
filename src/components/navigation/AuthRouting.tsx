import LoginPage from "@/pages/auth/Login";
import RegisterPage from "@/pages/auth/Register";
import TwoFactorSetup from "@/pages/auth/TwoFactorSetup";
import TwoFactorReset from "@/pages/auth/TwoFactorReset";
import TwoFactorVerify from "@/pages/auth/TwoFactor";
import SettingsPage from "@/pages/auth/Settings";
import VerifyEmailPage from "@/pages/auth/VerifyEmail";
import ResetPasswordPage from "@/pages/auth/ResetPassword";
import ResetPassword2faPage from "@/pages/auth/ResetPassword2fa";
import ResetPasswordVerifyEmailPage from "@/pages/auth/ResetPasswordVerifyEmail";
import ForgotPasswordPage from "@/pages/auth/ForgotPassword";
import {
  IonButtons,
  IonHeader,
  IonPage,
  IonRouterOutlet,
  IonToolbar,
} from "@ionic/react";
import { Route } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuthRouting() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <Link to="/main/requests">
              <ArrowLeft />
            </Link>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonRouterOutlet>
        <Route key={Math.random() * Math.random()} exact path="/auth/login">
          <LoginPage />
        </Route>
        <Route key={Math.random() * Math.random()} exact path="/auth/register">
          <RegisterPage />
        </Route>
        <Route key={Math.random() * Math.random()} exact path="/auth/settings">
          <SettingsPage />
        </Route>
        <Route
          key={Math.random() * Math.random()}
          exact
          path="/auth/verify-email"
        >
          <VerifyEmailPage />
        </Route>
        <Route
          key={Math.random() * Math.random()}
          exact
          path="/auth/reset-password"
        >
          <ResetPasswordPage />
        </Route>
        <Route
          key={Math.random() * Math.random()}
          exact
          path="/auth/reset-password/2fa"
        >
          <ResetPassword2faPage />
        </Route>
        <Route
          key={Math.random() * Math.random()}
          exact
          path="/auth/reset-password/verify-email"
        >
          <ResetPasswordVerifyEmailPage />
        </Route>
        <Route
          key={Math.random() * Math.random()}
          exact
          path="/auth/forgot-password"
        >
          <ForgotPasswordPage />
        </Route>
        <Route key={Math.random() * Math.random()} exact path="/auth/2fa">
          <TwoFactorVerify />
        </Route>
        <Route key={Math.random() * Math.random()} exact path="/auth/2fa/setup">
          <TwoFactorSetup />
        </Route>
        <Route key={Math.random() * Math.random()} exact path="/auth/2fa/reset">
          <TwoFactorReset />
        </Route>
      </IonRouterOutlet>
    </IonPage>
  );
}
