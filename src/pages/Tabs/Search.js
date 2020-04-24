import React from "react";
import { IonPage, IonContent } from "@ionic/react";
import LargeHeader from "../../components/Headers/LargeHeader";
import SmallHeader from "../../components/Headers/SmallHeader";

const Search = () => {
  return (
    <IonPage>
      <SmallHeader title="Search" />
      <IonContent fullscreen>
        <LargeHeader title="Search" />
      </IonContent>
    </IonPage>
  );
};

export default Search;
