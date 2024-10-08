import "./ExploreContainer.css";
import requests from "../temp.json";
import { IonItem, IonLabel } from "@ionic/react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";

interface ContainerProps {
  match: RouteComponentProps["match"];
}

const DendrologicRequests: React.FC<ContainerProps> = ({ match }) => {
  return (
    <>
      {requests.georequests.map((request) => (
        <Link key={request.id} to={`/geo/${request.id}`}>
          {request.name}
        </Link>
      ))}
    </>
  );
};

export default DendrologicRequests;
