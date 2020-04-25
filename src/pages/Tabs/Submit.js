import React, { useContext } from "react";
import {
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonRow,
  IonCol,
  IonButton,
} from "@ionic/react";
import SmallHeader from "../../components/Headers/SmallHeader";
import LargeHeader from "../../components/Headers/LargeHeader";
import useForm from "../../hooks/useForm";
import validateCreateLink from "../../validators/validateCreateLink";
import firebase from "../../firebase";
import UserContext from "../../contexts/UserContext";

const INITIAL_STATE = {
  description: "",
  url: "",
};

const Submit = (props) => {
  const { user } = useContext(UserContext);
  const { handleSubmit, handleChange, values } = useForm(
    INITIAL_STATE,
    validateCreateLink,
    handleCreateLink
  );

  function handleCreateLink() {
    if (!user) {
      props.history.push("/login");
    } else {
      const { url, description } = values;
      const newLink = {
        url,
        description,
        postedBy: {
          id: user.uid,
          name: user.displayName,
        },
        voteCount: 1,
        votes: [],
        comments: [],
        created: Date.now(),
      };
      firebase.db.collection("links").add(newLink);
      props.history.push("/");
    }
  }

  return (
    <IonPage>
      <SmallHeader title="Submit" />
      <IonContent fullscreen>
        <LargeHeader title="Submit" />
        <IonItem lines="full">
          <IonLabel position="floating">Description</IonLabel>
          <IonInput
            name="description"
            value={values.description}
            type="text"
            onIonChange={handleChange}
            required
          ></IonInput>
        </IonItem>
        <IonItem lines="full">
          <IonLabel position="floating">URL</IonLabel>
          <IonInput
            name="url"
            type="url"
            value={values.url}
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
            >
              Submit
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Submit;
