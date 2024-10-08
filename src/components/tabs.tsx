import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react'
import React from 'react'
import { ellipse, square, triangle } from "ionicons/icons";
import { Redirect, Route } from 'react-router';
import Tab2 from '../pages/Tab2';
import Tab3 from '../pages/Tab3';
import Tab1 from '../pages/Tab1';

export default function Tabs() {
  return (
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/tab/tab1">
            <Tab1 />
          </Route>
          <Route exact path="/tab/tab2">
            <Tab2 />
          </Route>
          <Route exact path="/tab/tab3">
            <Tab3 />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tab/tab1">
            <IonIcon aria-hidden="true" icon={triangle} />
            <IonLabel>Tab 1</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/tab/tab2">
            <IonIcon aria-hidden="true" icon={ellipse} />
            <IonLabel>Tab 2</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/tab/tab3">
            <IonIcon aria-hidden="true" icon={square} />
            <IonLabel>Tab 3</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>  )
}


