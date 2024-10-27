import { IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { AuthForm } from "../../components/auth/AuthForm";

export default function Page() {
  return (
    <IonPage>
      <IonContent fullscreen>
        <AuthForm />
      </IonContent>
    </IonPage>
  );
}
