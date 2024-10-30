import {
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import DendrologicRequests from "@/components/dendrologic/DendRequests";

const RequestsTab = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Dendrologic requests
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <div className="flex gap-4 flex-col dark:bg-background bg-background h-full w-full">
        <DendrologicRequests />
      </div>
    </IonPage>
  );
};

export default RequestsTab;
