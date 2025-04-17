export default function InfoWindow(props){
    function handleWindowClose(e) {
        if (e.target.classList.contains("infoWindowWrapper") ||
            e.target.id === "close") {
          props.windowToggle(true);
        }
    }
    return(
        <div className={`infoWindowWrapper ${props.isHidden ? "hidden" : ""}`} onClick={handleWindowClose}>
            <div className="infoWindow">
                <div className="closeSection"><div id="close"
                onClick={handleWindowClose}>x</div></div>
                <h1>Welcome to the ASCII Art Generator!</h1>
                <h2>How to Use:</h2>
                <ul>
                    <li>
                        <h3>Upload Your Image to Browser</h3>
                        <ul className="dotted">
                            <li>
                                <p>Drag and drop a <span className="bubble">.png</span> or <span className="bubble">.jpeg</span>, or click to browse your files.</p>
                                
                            </li>
                        </ul>
                        <div className="leftBorder">
                            <p>Your image <span className="bold">stays in your browser</span> — it's never uploaded to a server.</p>
                        </div>
                    </li>
                    <li>
                        <h3>Adjust the Detail Level</h3>
                        <ul className="dotted">
                            <li>
                                <p>Use the <span className="bold">detail dropdown</span> to control how sharp or abstract the ASCII art looks:</p>
                                <ul className="dotted">
                                    <li><p><span className="bubble">1x</span> = highest detail (sharpest image)</p></li>
                                    <li><p><span className="bubble">128x</span> = lowest detail (most abstract)</p></li>
                                </ul>
                            </li>
                            <li>
                                <p>The ASCII updates instantly as you make changes.</p>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <h3>Customize Character Mapping</h3>
                        <ul className="dotted">
                            <li>
                                <p>Choose from several built-in character mapping that determine how brightness maps to characters or <span className="bold">create</span> your own.</p>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <h3>Copy to Clipboard</h3>
                        <ul className="dotted">
                            <li>
                                <p>Click Copy to Clipboard to grab the formatted ASCII image.</p>
                            </li>
                            <li>
                                <p>You can now paste it anywhere — text files, posts, code, or messages!</p>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <h3>Tips: </h3>
                        <ul className="dotted">
                            <li>
                                <p>Shorter character mappings create a bolder.</p>
                            </li>
                            <li>
                                <p>Longer mappings offer more shading range and smoother image reproduction.</p>
                            </li>
                        </ul>
                    </li>
                </ul>
                
            </div>
        </div>
    )
}