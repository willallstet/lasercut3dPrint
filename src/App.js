import { animate } from "./lightbox"
import "./App.css"

function App() {
  return (
    <div>
      <div className="uploadText">3D laser print an STL file</div>
      <div className="fullWidth">
        <button>upload</button>
      </div>
      <div className="footer">
        Made by{" "}
        <a
          href="https://www.willallstetter.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Will Allstetter
        </a>
      </div>
      {animate()}
    </div>
  )
}

export default App
