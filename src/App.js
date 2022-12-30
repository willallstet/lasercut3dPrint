import { animate, changeMesh } from "./lightbox"
import "./App.css"
import React, { useState } from "react"

function App() {
  function addListner() {
    console.log("??")
    const inputElement = document.getElementById("input")
    console.log(inputElement)
    if (inputElement !== null) {
      inputElement.addEventListener("change", handleFiles, false)
    }
  }

  function handleFiles() {
    const selectedFile = document.getElementById("input").files[0]
    changeMesh(selectedFile)
    setHideDownload(false)
  }
  const [hideDownload, setHideDownload] = useState(true)
  return (
    <div>
      <div className="uploadText"> laser print an OBJ file</div>
      <div className="fullWidth">
        <input
          class="custom-file-input"
          id="input"
          type="file"
          accept=".obj"
          onClick={addListner}
        />
      </div>
      <a className="downlaodButton" hidden={hideDownload}>
        <button>download vector paths</button>
      </a>
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
//https://cdn.glitch.com/fcf3c007-b4eb-4250-ba6b-653fdab94ce3%2Fjapanese_temple.obj?1558792651869

export default App
