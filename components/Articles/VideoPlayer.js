import ReactPlayer from "react-player/lazy"

const VideoPlayer = ({url}) => {
  return (
    <>
      <div className="player-wrapper">
        <ReactPlayer
          url={url}
          className="react-player"
          width="100%"
          height="100%"
          controls
        />
      </div>
    </>
  )
}
 
export default VideoPlayer