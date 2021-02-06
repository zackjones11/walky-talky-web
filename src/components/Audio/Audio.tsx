import * as React from "react";

interface IAudioProps {
  mediaStream: MediaStream | null;
  muted?: boolean;
}

const Audio: React.FC<IAudioProps> = (props) => {
  const ref = React.useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    if (props.mediaStream && ref.current) {
      ref.current.srcObject = props.mediaStream;
    }
  }, [props.mediaStream]);

  return <audio autoPlay controls ref={ref} muted={props.muted}></audio>;
};

export default Audio;
