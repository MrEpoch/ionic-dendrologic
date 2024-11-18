import { IonContent, IonList } from "@ionic/react";
import "./Geolocation.css";

export default function DendrologicDetailInfo({ shown }) {
  return (
    <>
      {shown && (
        <IonContent color="light">
          <IonList inset={true}></IonList>
        </IonContent>
      )}
    </>
  );
}
