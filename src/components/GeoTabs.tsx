import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react'
import React from 'react'
import { ellipse, square, triangle } from "ionicons/icons";
import { Redirect, Route } from 'react-router';
import Tab2 from '../pages/Tab2';
import Tab3 from '../pages/Tab3';
import Tab1 from '../pages/Tab1';

export default function GeoTabs(props) {
  return (
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/geo/:id/map">
            <Tab2 />
          </Route>
          <Route exact path="/geo/:id/info">
            <Tab3 />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab2" href=">
            <IonIcon aria-hidden="true" icon={ellipse} />
            <IonLabel>Tab 2</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/geo/info">
            <IonIcon aria-hidden="true" icon={square} />
            <IonLabel>Tab 3</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>  )
}

