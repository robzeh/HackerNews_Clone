import React, { useState, useEffect } from "react";
import firebase from "../../firebase";
import LinkItem from "./LinkItem";

const LinkList = (props) => {
  const [links, setLinks] = useState([]);
  const isTrending = props.location.pathname.includes("trending");

  useEffect(() => {
    const unsubscribe = getLinks();
    return () => unsubscribe();
  }, [isTrending]);

  function getLinks() {
    if (isTrending) {
      return firebase.db
        .collection("links")
        .orderBy("voteCount", "desc")
        .onSnapshot(handleSnapshot);
    }
    return firebase.db
      .collection("links")
      .orderBy("created", "desc")
      .onSnapshot(handleSnapshot);
  }

  function handleSnapshot(snapshot) {
    const links = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    setLinks(links);
  }

  return (
    <>
      {links.map((link, index) => (
        <LinkItem
          key={link.id}
          showCount={true}
          url={`/link/${link.id}`}
          link={link}
          index={index + 1}
        />
      ))}
    </>
  );
};

export default LinkList;
