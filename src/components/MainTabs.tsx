import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import React from "react";
import { ellipse, square, triangle } from "ionicons/icons";
import { Redirect, Route } from "react-router";
import Tab2 from "../pages/Tab2";
import Tab3 from "../pages/Tab3";
import RequestsTab from "../pages/RequestsTab";

export default function MainTabs() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/main/requests">
          <RequestsTab />
        </Route>
        <Route exact path="/main/tab2">
          <Tab2 />
        </Route>
        <Route exact path="/main/account">
          <Tab3 />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/main/requests">
          <IonIcon aria-hidden="true" icon={triangle} />
          <IonLabel>Requests</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/main/tab2">
          <IonIcon aria-hidden="true" icon={ellipse} />
          <IonLabel>Global main</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/main/account">
          <IonIcon aria-hidden="true" icon={square} />
          <IonLabel>Account</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
