import React, { useState, useContext, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
} from "@ionic/react";
import { closeCircleOutline } from "ionicons/icons";
import { Plugins } from "@capacitor/core";
import firebase from "../firebase";
import UserContext from "../contexts/UserContext";
import NavHeader from "../components/Headers/NavHeader";
import LinkItem from "../components/Link/LinkItem";
import LinkComment from "../components/Link/LinkComment";
import CommentModal from "../components/Link/CommentModal";

const { Browser } = Plugins;

const Link = (props) => {
  const [link, setLink] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(UserContext);
  const linkId = props.match.params.linkId;
  const linkRef = firebase.db.collection("links").doc(linkId);

  useEffect(() => {
    getLink();
    // eslint-disable-next-line
  }, [linkId]);

  function getLink() {
    linkRef.get().then((doc) => {
      setLink({ ...doc.data(), id: doc.id });
    });
  }

  function handleOpenModal() {
    if (!user) {
      props.history.push("/login");
    } else {
      setShowModal(true);
    }
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  function handleAddVote() {
    if (!user) {
      props.history.push("/login");
    } else {
      linkRef.get().then((doc) => {
        if (doc.exists) {
          const previousVotes = doc.data().votes;
          const vote = { votedBy: { id: user.uid, name: user.displayName } };
          const updatedVotes = [...previousVotes, vote];
          const voteCount = updatedVotes.length;
          linkRef.update({ votes: updatedVotes, voteCount });
          setLink((prevState) => ({
            ...prevState,
            votes: updatedVotes,
            voteCount: voteCount,
          }));
        }
      });
    }
  }

  function handleAddComment(commentText) {
    if (!user) {
      props.history.push("/login");
    } else {
      linkRef.get().then((doc) => {
        if (doc.exists) {
          const previousComments = doc.data().comments;
          const newComment = {
            postedBy: { id: user.uid, name: user.displayName },
            created: Date.now(),
            text: commentText,
          };
          const updatedComments = [...previousComments, newComment];
          linkRef.update({ comments: updatedComments });
          setLink((prevState) => ({
            ...prevState,
            comments: updatedComments,
          }));
        }
      });
      setShowModal(false);
    }
  }

  function handleDeleteLink() {
    linkRef
      .delete()
      .then(() => {
        console.log(`Document with ID ${link.id} deleted`);
      })
      .catch((error) => {
        console.error("Error deleting document:", error);
      });
    props.history.push("/");
  }

  function postedByAuthUser(link) {
    return user && user.uid === link.postedBy.id;
  }

  async function openBrowser() {
    await Browser.open({
      url: link.url,
    });
  }

  return (
    <IonPage>
      <NavHeader
        title={link && link.description}
        option={link && postedByAuthUser(link)}
        icon={closeCircleOutline}
        action={handleDeleteLink}
      />
      <IonContent>
        <CommentModal
          isOpen={showModal}
          title="New Comment"
          sendAction={handleAddComment}
          closeAction={handleCloseModal}
        />
        {link && (
          <>
            <IonGrid>
              <IonRow>
                <IonCol class="ion-text-center">
                  <LinkItem link={link} browser={openBrowser} />
                  <IonButton onClick={() => handleAddVote()} size="small">
                    Upvote
                  </IonButton>
                  <IonButton onClick={() => handleOpenModal()} size="small">
                    Comment
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
            {link.comments.map((comment, index) => (
              <LinkComment
                key={index}
                comment={comment}
                link={link}
                setLink={setLink}
              />
            ))}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Link;
