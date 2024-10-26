import { CapacitorHttp } from "@capacitor/core";
import requests from "../temp.json";
import { IonItem, IonLabel, IonList } from "@ionic/react";
import { useEffect } from "react";
import { RouteComponentProps, useHistory } from "react-router";
import { Link } from "react-router-dom";

interface ContainerProps {
  match: RouteComponentProps["match"];
}

const DendrologicRequests: React.FC<ContainerProps> = ({ match }) => {

  const history = useHistory();

  useEffect(() => {
      (async () => {

      try {
      const res = await CapacitorHttp.request({
        method: "GET",
        // url: "https://dendrologic-web.stencukpage.com/api/images",
        url: "http://localhost:3752/api/images",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res);
    } catch (e) {
      console.error(e);
    }
    })();
  }, [])
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
