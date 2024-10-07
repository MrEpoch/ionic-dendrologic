import { IonPage } from "@ionic/react";
import "./Tab1.css";
import DendrologicRequests from "../components/DendrologicRequests";
import { RouteComponentProps } from "react-router";

const Tab1: React.FC<RouteComponentProps> = ({ match }) => {
  console.log(match);
  return (
    <IonPage>
      <DendrologicRequests match={match} />
    </IonPage>
  );
};

export default Tab1;
