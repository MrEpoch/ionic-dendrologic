import LoginPage from "@/pages/auth/Login";
import RegisterPage from "@/pages/auth/Register";
import TwoFactorSetup from "@/pages/auth/TwoFactorSetup";
import TwoFactorReset from "@/pages/auth/TwoFactorReset";
import TwoFactorVerify from "@/pages/auth/TwoFactor";
import SettingsPage from "@/pages/auth/Settings";
import { IonRouterOutlet } from "@ionic/react";
import { Route } from "react-router";

export default function AuthRouting() {
  return (
    <IonRouterOutlet>
      <Route exact path="/auth/login">
        <LoginPage />
      </Route>
      <Route exact path="/auth/register">
        <RegisterPage />
      </Route>
      <Route exact path="/auth/settings">
        <SettingsPage />
      </Route>
      <Route exact path="/auth/verify-email">
      </Route>
      <Route exact path="/auth/reset-password">
      </Route>
      <Route exact path="/auth/reset-password/2fa">
      </Route>
      <Route exact path="/auth/reset-password/verify-email">
      </Route>
      <Route exact path="/auth/forgot-password">
      </Route>
      <Route exact path="/auth/2fa">
        <TwoFactorVerify />
      </Route>
      <Route exact path="/auth/2fa/setup">
        <TwoFactorSetup />
      </Route>
      <Route exact path="/auth/2fa/reset">
        <TwoFactorReset />
      </Route>
    </IonRouterOutlet>
  );
}
