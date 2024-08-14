import * as React from "react";
import videojs from "video.js";
// import Player from "video.js/dist/types/player";

// Styles
import "video.js/dist/video-js.css";

type PlayerOptions = any;

type Player = any;

interface IVideoPlayerProps {
  options: PlayerOptions;
}

const initialOptions: PlayerOptions = {
  controls: true,
  fluid: true,
  controlBar: {
    volumePanel: {
      inline: false,
    },
  },
};

const VideoPlayer: React.FC<IVideoPlayerProps> = ({ options }) => {
  const videoNode = React.useRef<HTMLVideoElement>(null);
  const player = React.useRef<Player>();

  React.useEffect(() => {
    if (videoNode.current !== null)
    player.current = videojs(videoNode.current, {
      ...initialOptions,
      ...options,
    }).ready(function () {
      // Player is ready
    });
    return () => {
      if (player.current) {
        player.current.dispose();
      }
    };
  }, [options]);

  return (
    <div style={{ width: "100%" }}>
      <video
        ref={videoNode}
        className="video-js vjs-fluid"
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default VideoPlayer;