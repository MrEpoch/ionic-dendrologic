import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import { RouteComponentProps } from "react-router";
import DendrologicRequestDetail from "@/components/DendrologicRequestDetail";

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
      <div className="flex gap-4 flex-col justify-center bg-main-background-200 items-center h-full w-full">
        <DendrologicRequestDetail {...routeProps} />
      </div>
    </IonPage>
  );
};

export default DendrologicDetailPage;
