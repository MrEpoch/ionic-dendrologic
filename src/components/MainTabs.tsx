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
        <Route exact path="/map/requests">
          <RequestsTab />
        </Route>
        <Route exact path="/tab/tab2">
          <Tab2 />
        </Route>
        <Route exact path="/tab/tab3">
          <Tab3 />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/map/requests">
          <IonIcon aria-hidden="true" icon={triangle} />
          <IonLabel>Requests</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/tab/tab2">
          <IonIcon aria-hidden="true" icon={ellipse} />
          <IonLabel>Global map</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/tab/tab3">
          <IonIcon aria-hidden="true" icon={square} />
          <IonLabel>Processed</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
