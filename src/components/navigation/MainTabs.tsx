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
import { Route } from "react-router";
import RequestsTab from "@/pages/dendrologic/RequestsTab";

export default function MainTabs() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/main/requests">
          <RequestsTab />
        </Route>
        <Route exact path="/main/tab2">
        </Route>
        <Route exact path="/main/account">
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
