import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import DendrologicRequests from "../components/DendrologicRequests";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";

const RequestsTab: React.FC<RouteComponentProps> = ({ match }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Dendrologic requests
          </IonTitle>
          <Link to="/auth/login">Login</Link>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <DendrologicRequests match={match} />
      </IonContent>
    </IonPage>
  );
};

export default RequestsTab;
