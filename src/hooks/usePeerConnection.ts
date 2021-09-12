import * as React from "react";
import { WebsocketResponse } from "./useWebsocket";

interface IUsePeerConnectionProps {
  clientId?: string;
  shouldStartChat: boolean;
  localStream: MediaStream | null;
  addRemoteStream: (stream: MediaStream) => void;
  onSendMessage: (data: WebsocketResponse) => void;
}

interface IUsePeerConnectionReturn {
  peerConnection: RTCPeerConnection;
}

const peerConnection = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});

const usePeerConnection = (
  props: IUsePeerConnectionProps
): IUsePeerConnectionReturn => {
  const addTrack = async () => {
    if (!props.localStream) {
      return;
    }

    const tracks = await props.localStream.getTracks();
    tracks.forEach((track) => peerConnection.addTrack(track));
  };

  const handleNegotiationNeeded = async () => {
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      props.onSendMessage({
        type: "OFFER",
        clientId: props.clientId,
        body: JSON.stringify(peerConnection.localDescription),
      });
    } catch (error) {
      console.error("handleNegotiationNeeded error:", error);
    }
  };

  const handleIceCandidate = (event: RTCPeerConnectionIceEvent) => {
    if (!event.candidate) {
      return;
    }

    props.onSendMessage({
      type: "ICE_CANDIDATE",
      clientId: props.clientId,
      body: JSON.stringify(event.candidate),
    });
  };

  const handleTrack = (event: RTCTrackEvent) => {
    const remoteStream = new MediaStream([event.track]);
    props.addRemoteStream(remoteStream);
  };

  React.useEffect(() => {
    if (!props.clientId) {
      return;
    }

    peerConnection.onnegotiationneeded = handleNegotiationNeeded;
    peerConnection.onicecandidate = handleIceCandidate;
    peerConnection.ontrack = handleTrack;
  }, [props.clientId]);

  React.useEffect(() => {
    if (props.shouldStartChat) {
      addTrack();
    }
  }, [props.shouldStartChat]);

  return { peerConnection };
};

export default usePeerConnection;
