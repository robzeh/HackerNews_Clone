import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonRow,
  IonCol,
  IonButton,
  IonLoading,
} from "@ionic/react";
import NavHeader from "../../components/Headers/NavHeader";
import { toast } from "../../helpers/toast";
import useForm from "../../hooks/useForm";
import firebase from "../../firebase";
import validatePasswordReset from "../../validators/validatePasswordReset";

const INITIAL_STATE = {
  email: "",
};

const Forgot = (props) => {
  const { handleSubmit, handleChange, values, isSubmitting } = useForm(
    INITIAL_STATE,
    validatePasswordReset,
    handleResetPassword
  );
  const [busy, setBusy] = useState(false);

  async function handleResetPassword() {
    setBusy(true);
    const { email } = values;
    try {
      await firebase.resetPassword(email);
      toast("Check your email to reset your password");
      props.history.push("/login");
    } catch (error) {
      console.error("Password reset error", error);
      toast(error.messsage);
    }
    setBusy(false);
  }

  return (
    <IonPage>
      <NavHeader title="Password Reset" />
      <IonLoading messsage={"Please wait..."} isOpen={busy} />
      <IonContent>
        <IonItem lines="full">
          <IonLabel position="floating">Email</IonLabel>
          <IonInput
            name="email"
            type="text"
            value={values.email}
            onIonChange={handleChange}
            required
          ></IonInput>
        </IonItem>
        <IonRow>
          <IonCol>
            <IonButton
              type="submit"
              color="primary"
              expand="block"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Get Reset Link
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Forgot;
