import "./ExploreContainer.css";
import requests from "../temp.json";
import { IonItem, IonLabel, IonList } from "@ionic/react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";

interface ContainerProps {
  match: RouteComponentProps["match"];
}

const DendrologicRequests: React.FC<ContainerProps> = ({ match }) => {
  return (
    <>
      <IonList inset={true}>
        {requests.georequests.map((request) => (
          <IonItem>
            <Link key={request.id} to={`/map-request/${request.id}`}>
              {request.name}
            </Link>
          </IonItem>
        ))}
      </IonList>
    </>
  );
};

export default DendrologicRequests;
