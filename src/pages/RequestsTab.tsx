import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Tab1.css";
import DendrologicRequests from "../components/DendrologicRequests";
import { RouteComponentProps } from "react-router";

const RequestsTab: React.FC<RouteComponentProps> = ({ match }) => {
  console.log(match);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dendrologic requests <p className="text-red-500">hello</p></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <DendrologicRequests match={match} />
      </IonContent>
    </IonPage>
  );
};

export default RequestsTab;
