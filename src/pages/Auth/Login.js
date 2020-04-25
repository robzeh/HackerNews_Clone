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
  IonRouterLink,
  IonLoading,
} from "@ionic/react";
import NavHeader from "../../components/Headers/NavHeader";
import { toast } from "../../helpers/toast";
import useForm from "../../hooks/useForm";
import validateLogin from "../../validators/validateLogin";
import firebase from "../../firebase";

const INITIAL_STATE = {
  email: "",
  password: "",
};

const Login = (props) => {
  const { handleSubmit, handleChange, values, isSubmitting } = useForm(
    INITIAL_STATE,
    validateLogin,
    authenticateUser
  );
  const [busy, setBusy] = useState(false);

  async function authenticateUser() {
    setBusy(true);
    const { email, password } = values;
    try {
      await firebase.login(email, password);
      toast("You have succesfully logged in");
      props.history.push("/");
    } catch (error) {
      console.error("Authentication error", error);
      toast(error.message);
    }
    setBusy(false);
  }

  return (
    <IonPage>
      <NavHeader title="Log In" />
      <IonLoading message={"Please wait..."} isOpen={busy} />
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
        <IonItem lines="full">
          <IonLabel position="floating">Password</IonLabel>
          <IonInput
            name="password"
            type="password"
            value={values.password}
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
              Log In
            </IonButton>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol class="ion-text-center ion-padding-vertical">
            <IonRouterLink routerLink={`/forgot`}>
              Forgot Password?
            </IonRouterLink>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Login;
