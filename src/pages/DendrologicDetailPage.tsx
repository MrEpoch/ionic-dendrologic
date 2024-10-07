import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab1.css";
import { RouteComponentProps } from "react-router";
import DendrologicRequestDetail from "../components/DendrologicRequestDetail";

const DendrologicDetailPage: React.FC<RouteComponentProps> = (routeProps) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" />
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
