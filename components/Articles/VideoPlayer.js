import ReactPlayer from "react-player/lazy"
import baseUrl from "../../utils/baseUrl"

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
          config={{
            youtube: {
              playerVars: {
                origin: baseUrl
              }
            }
          }}
        />
      </div>
    </>
  )
}
 
export default VideoPlayer