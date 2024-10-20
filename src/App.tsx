import { Redirect, Route, RouteComponentProps } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import DendrologicRequestDetailPage from "./pages/DendrologicDetailPage";
import Tabs from "./components/MainTabs";
import GeoTabs from "./components/GeoTabs";
import AuthRouting from "./components/AuthRouting";
import { SuperTokensProvider } from "./components/ui/superTokenProvider";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <SuperTokensProvider>
          <Route exact path="/">
            <Redirect to="/main/requests" />
          </Route>
          <Route path="/main" component={Tabs} />
          <Route path="/map-requests" component={GeoTabs} />
          <Route
            path={"/map-request/:id"}
            component={DendrologicRequestDetailPage}
          />
          <Route
            path={"/auth"}
            component={AuthRouting}
          />
        </SuperTokensProvider>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
