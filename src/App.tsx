import { Redirect, Route } from "react-router-dom";
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
import "@ionic/react/css/palettes/dark.class.css";
/* import "@ionic/react/css/palettes/dark.system.css"; */

/* Theme variables */
import "./theme/variables.css";
import DendRequestPage from "./pages/dendrologic/RequestPage";
import MainTabs from "./components/navigation/MainTabs";
import GeoTabs from "./components/navigation/GeoTabs";
import AuthRouting from "./components/navigation/AuthRouting";

setupIonicReact();

const App: React.FC = () => (
  <IonApp className="font-mono">
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/">
          <Redirect to="/main/global-requests" />
        </Route>
        <Route path="/main" component={MainTabs} />
        <Route path="/map-requests" component={GeoTabs} />
        <Route path={"/map-request/:id"} component={DendRequestPage} />
        <Route path={"/auth"} component={AuthRouting} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
