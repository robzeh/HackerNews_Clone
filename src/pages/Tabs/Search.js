import React, { useState, useEffect } from "react";
import { IonPage, IonContent, IonSearchbar } from "@ionic/react";
import LargeHeader from "../../components/Headers/LargeHeader";
import SmallHeader from "../../components/Headers/SmallHeader";
import firebase from "../../firebase";
import LinkItem from "../../components/Link/LinkItem";

const Search = () => {
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [links, setLinks] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    getInitialLinks();
  }, []);

  useEffect(() => {
    handleSearch();
    //eslint-disable-next-line
  }, [filter]);

  function getInitialLinks() {
    firebase.db
      .collection("links")
      .get()
      .then((snapshot) => {
        const links = snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setLinks(links);
      });
  }

  function handleSearch() {
    const query = filter.toLowerCase();
    const matchLinks = links.filter((link) => {
      return (
        link.description.toLowerCase().includes(query) ||
        link.url.toLowerCase().includes(query) ||
        link.postedBy.name.toLowerCase().includes(query)
      );
    });
    setFilteredLinks(matchLinks);
  }

  function handleChange(e) {
    if (e.key === "Enter") {
      setFilter(e.target.value);
    }
  }

  return (
    <IonPage>
      <SmallHeader title="Search" />
      <IonContent fullscreen>
        <LargeHeader title="Search" />
        <IonSearchbar
          placeholder="Search"
          spellcheck="false"
          type="url"
          value={filter}
          onKeyPress={handleChange}
          animated
        />
        {filteredLinks.map((filteredLink, index) => (
          <LinkItem
            key={filteredLink.id}
            showCount={false}
            link={filteredLink}
            index={index}
            url={`/link/${filteredLink.id}`}
          />
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Search;
