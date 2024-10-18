import {
  IonRouterOutlet,
} from "@ionic/react";
import React from "react";
import { Route } from "react-router";
import { LoginComponent } from "../components/auth/Login";
import { RegisterComponent } from "../components/auth/Register";

export default function AuthRouting() {
  return (
    <IonRouterOutlet>
      <Route exact path="/auth/login">
        <LoginComponent />
      </Route>
      <Route exact path="/auth/register">
        <RegisterComponent />
      </Route>
    </IonRouterOutlet>
  );
}
