import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import { RouteComponentProps } from "react-router";
import DendrologicRequestDetail from "../components/DendrologicRequestDetail";

const DendrologicDetailPage: React.FC<RouteComponentProps> = (routeProps) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <DendrologicRequestDetail {...routeProps} />
      </IonContent>
    </IonPage>
  );
};

export default DendrologicDetailPage;
