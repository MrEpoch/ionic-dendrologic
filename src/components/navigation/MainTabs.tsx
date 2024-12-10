import React from "react";
import {
    IonContent,
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { triangle } from "ionicons/icons";
import { Route } from "react-router";
import RequestsTab from "@/pages/dendrologic/RequestsTab";
import AccountTab from "@/pages/auth/AccountTab";
import GlobalMapPage from "@/pages/dendrologic/GlobalMapPage";
import { Globe, User } from "lucide-react";
import Page from "@/pages/auth/Settings";

export default function MainTabs() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/main/requests">
          <RequestsTab />
        </Route>
        <Route exact path="/main/global-requests">
          <GlobalMapPage />
        </Route>
        <Route exact path="/main/account">
          <IonPage>
            <IonContent>
              <Page />
            </IonContent>
          </IonPage>
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/main/requests">
          <IonIcon aria-hidden="true" icon={triangle} />
          <IonLabel className="font-mono">Requests</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/main/global-requests">
          <Globe aria-hidden="true" />
          <IonLabel className="font-mono">Global main</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/main/account">
          <User />
          <IonLabel className="font-mono">Account</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
