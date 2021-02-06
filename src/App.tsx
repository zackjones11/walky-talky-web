import * as React from "react";
import { useWebsocket, usePeerConnection } from "./hooks";
import { Audio } from "./components";

const App: React.FC = () => {
  const [clientId, setClientId] = React.useState<number>();
  const [shouldStartChat, setShouldStartChat] = React.useState(false);
  const [localStream, setLocalStream] = React.useState<MediaStream | null>(
    null
  );
  const [remoteStream, setRemoteStream] = React.useState<MediaStream | null>(
    null
  );

  const { lastMessage, sendMessage } = useWebsocket();
  const { peerConnection } = usePeerConnection({
    shouldStartChat,
    clientId,
    localStream,
    addRemoteStream: setRemoteStream,
    onSendMessage: sendMessage,
  });

  const handleNewClient = async (clientId: number) => {
    setClientId(clientId);
    const stream = await getUserMedia();
    stream && setLocalStream(stream);
  };

  const handleStartChat = () => {
    setShouldStartChat(true);
  };

  const getUserMedia = async () => {
    try {
      if (!localStream) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });

        return mediaStream;
      }
    } catch (error) {
      console.error("getUserMedia Error: ", error);
    }
  };

  const handleOffer = async (body: string) => {
    await peerConnection.setRemoteDescription(JSON.parse(body));
    const mediaStream = await getUserMedia();

    handleStartChat();
    mediaStream && setLocalStream(mediaStream);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    sendMessage({
      type: "ANSWER",
      clientId,
      body: JSON.stringify(answer),
    });
  };

  const handleAnswer = async (body: string) => {
    await peerConnection.setRemoteDescription(JSON.parse(body));
  };

  const handleIceCandidate = async (body: string) => {
    await peerConnection.addIceCandidate(JSON.parse(body));
  };

  React.useEffect(() => {
    if (!lastMessage) {
      return;
    }

    const { type, clientId, body } = lastMessage;

    switch (type) {
      case "NEW_USER":
        if (!clientId) {
          throw new Error("No clientId from socket response");
        }
        handleNewClient(clientId);
        break;

      case "START_CHAT":
        handleStartChat();
        break;

      case "OFFER":
        handleOffer(body);
        break;

      case "ANSWER":
        handleAnswer(body);
        break;

      case "ICE_CANDIDATE":
        handleIceCandidate(body);
        break;
    }
  }, [lastMessage]);

  return (
    <>
      <p>clientID: {clientId}</p>
      <Audio mediaStream={localStream} muted />
      <Audio mediaStream={remoteStream} />
    </>
  );
};

export default App;
