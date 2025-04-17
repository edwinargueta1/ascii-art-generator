//ImageProcessor.js

import { useState, useEffect, useRef } from "react";
import FileDropLoader from "./Components/FileDropLoader";
import fontSizeAdjuster from "./Components/FontSizeAdjuster";
import Notification from "./Components/Notification";


export default function ImageToASCII() {
  //ASCII Mapping
  const [ASCIIMap, setASCIIMap] = useState(".:-=+*?#%@");
  const [customMap, setCustomMap] = useState("");

  //Image
  const [imageFile, setImageFile] = useState(null);
  const [pixelLightValues, setPixelLightValues] = useState(null);
  const [asciiImage, setAsciiImage] = useState("");
  const [asciiWidth, setAsciiWidth] = useState();
  const [asciiHeight, setAsciiHeight] = useState();

  //Parameters
  const [scale, setScale] = useState(4);
  const [dynamicFontSize, setDynamicFontSize] = useState("0.25rem");
  const canvasRef = useRef();
  const[notification, setNotification] = useState({
    isVisible: false,
    title:"",
    description:"",
    type:"info"
  });

  //Rerender Image if file changes
  useEffect(() => {
    loadImage();
  }, [imageFile]);

  //Rerenders the ascii image if parameters change
  useEffect(() => {
    renderASCII();
  }, [pixelLightValues, scale, ASCIIMap])

  function verifyFile(event) {
    const file = event.target.files[0];

    //Checking if file is valid format
    if (file) {
      const allowedFileTypes = ["image/png", "image/jpg", "image/jpeg"];
      const allowedExtensions = [".png", ".jpg", ".jpeg"];
      const fileExtension = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf("."));

      if (
        allowedFileTypes.includes(file.type) &&
        allowedExtensions.includes(fileExtension)
      ) {
        setImageFile(file);
      }
    }
  }
  function loadImage(){

    /**
       * Create a 2d Matrix of the average light values
       * @param {Array} data
       * @param {Number} width
       * @param {Number} height
       * @returns 2D Array
       */
    function create2dMatrixOfLightValues(data, width, height) {
      const pixelData = new Array(height);
      for (let i = 0; i < height; i++) {
        const rowData = new Array(width);
        for (let j = 0; j < width; j++) {
          rowData[j] = data[i * width + j];
        }
        pixelData[i] = rowData;
      }
      return pixelData;
    }


    if(imageFile){
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const image = new Image();
  
      image.onload = () => {
        //Setting canvas size
        canvas.width = image.width;
        canvas.height = image.height;
  
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        const lightValues = [];

        //Getting the average light value of the rgb
        for (let i = 2; i < pixels.length; i += 4) {
          const red = pixels[i - 2];
          const green = pixels[i - 1];
          const blue = pixels[i];
          const average = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255;
          if(average > 255) average = 255;
          lightValues.push(average);
        }
        setPixelLightValues(create2dMatrixOfLightValues(lightValues, canvas.width, canvas.height));
      };
  
      image.src = URL.createObjectURL(imageFile);
    }
  }

  function renderASCII() {
    if (!pixelLightValues) return;

    /**
     * Takes a coordinate in the 2D Array of light values and gets and average number based on a scale by scale size square within the lightData Array.
     *
     * @param {Number[][]} lightData Pixel light values normalized to be fixed between 0 - 1.
     * @param {Number} x X Coordinate of the lightData Array.
     * @param {Number} y Y Coordinate of the lightData Array.
     * @param {Number} scale The size of the square to be averaged.
     * @returns {Number} The average of the light values within the localized square.
     */
    function getAveragePixelBlockLightValue(lightData, x, y, scale) {
      let sum = 0;

      for (let i = 0; i < scale; i++) {
        for (let j = 0; j < scale; j++) {
          //inbounds
          if ((lightData[y + i] && lightData[y + i][x + j]) === undefined) {
            return null;
          }
          sum += lightData[y + i][j + x];
        }
      }
      return sum / (scale * scale);
    }
    /**
     * Scales the size of the light value array to a smaller version of it.
     * @param {Number[][]} lightData The 2D array to reduce.
     * @param {Number} scale The scale to reduce the array by.
     * @returns Another 2D Array of light values.
     */
    function scaleASCII(lightData, scale) {
      scale = parseInt(scale);
      if(scale === 1){
        return lightData
      }

      let newLightData = [];

      for (let i = 0; i < lightData.length; i += scale) {
        const rowData = [];
        for (let j = 0; j < lightData[0].length; j += scale) {
          const pixelBlock = getAveragePixelBlockLightValue(lightData, j, i, scale);
          if(pixelBlock){rowData.push(pixelBlock)}
        }
        newLightData.push(rowData);
      }
      return newLightData;
    }

    const scaledLightData = scaleASCII(pixelLightValues, scale);
    fontSizeAdjuster(setDynamicFontSize, scaledLightData[0].length);

    //Map data to chars
    const res = createASCIIImage(scaledLightData);
    setAsciiImage(res);
  }

  /**
   * Creates a string containing the ASCII representation of the image being converted.
   * @param {Number[][]} scaledLightData The 2D array of light values being converted.
   * @returns A String of ASCII characters representing the image.
   */
  function createASCIIImage(scaledLightData) {
    const map = ASCIIMap === "custom" ? customMap : ASCIIMap;
    if(map.length === 0){
      setAsciiImage("");
      return;
    }

    const height = scaledLightData.length;
    const width = scaledLightData[0].length;
    setAsciiWidth(scaledLightData[0].length);
    
    const image = []; 
    for (let i = 1; i < height; i += 2) {
      const row = new Array(width + 1);
      for (let j = 0; j < width; j++) {
        const twoRowAverage =
          (scaledLightData[i][j] + scaledLightData[i - 1][j]) / 2;
        row[j] = calculateASCII(twoRowAverage, map);
      }
      row[width + 1] = "\n";
      image.push(row.join(""));
    }
    setAsciiHeight(image.length);
    return image.join("");
  }

  function calculateASCII(lightValue, currentASCIIMap) {
    const mapIndex = Math.floor(lightValue * (currentASCIIMap.length));
    return currentASCIIMap[mapIndex];
  }

  function pasteToClipboard() {
    navigator.clipboard
      .writeText(asciiImage)
      .then(() => {
        console.log("Copied to Clipboard");
        setNotification({
          title:"Copied!",
          description: "Image was successfully copied to clipboard!",
          type: "success",
          isVisible: true
        });
      })
      .catch(() => {
        console.log("Failed to Copy");
        setNotification({
          title:"Error",
          description: "Something went wrong!",
          type: "error",
          isVisible: true
        });
      });
  }
  function handleCustomMap(event) {
    const mapValue = event.target.value;
    function isValidMap(map) {
      //Map is too long
      if (map.length > 20) {
        return false;
      }

      return true;
    }
    if (isValidMap(mapValue)) {
      setCustomMap(mapValue);
    }
  }

  return (
    <div className="image-to-ascii">
      
      <input id="fileInput" className="hidden" type="file" onChange={verifyFile}></input>
      <FileDropLoader setFile={setImageFile}/>

      {imageFile ? (
        <div>
          <p>Image</p>
          <canvas ref={canvasRef} id="photoView"></canvas>

          <div className="controls">
            <label>ASCII Maps: </label>
            <select
              defaultValue={".:-=+*?#%@"}
              onChange={(event) => {
                setASCIIMap(event.target.value);
              }}
              >
              <option value={".:-=+*?#%@"}>Default</option>
              <option value={"@%#?*+=-:."}>Inverted</option>
              <option value={"1273456980"}>Numerical</option>
              <option value={"0896543721"}>Numerical Inverted</option>
              <option value={"custom"}>Custom</option>
            </select>
            {ASCIIMap === "custom" ? (
              <div>
                <input placeholder="Custom Map" value={customMap} onChange={handleCustomMap} />
                <button onClick={renderASCII}>Render Custom</button>
              </div>
            ) : (
              ""
            )}
            <label>Detail:</label>
            <select
              defaultValue={4}
              onChange={(event) => setScale(event.target.value)}
            >
              <option value={1}>1x (Original Size)</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
              <option value={4}>4x</option>
              <option value={8}>8x</option>
              <option value={16}>16x</option>
              <option value={32}>32x</option>
              <option value={64}>64x</option>
              <option value={128}>128x</option>
            </select>
          </div>
          {asciiImage ? (
            <div>
            <p>ASCII Art</p>
            <pre className="asciiImage" style={{fontSize:dynamicFontSize}}>{asciiImage}</pre>
            <p><span className="bubble">{asciiWidth}</span> X <span className="bubble">{asciiHeight}</span>  Characters</p>
          </div>
          ) : ""}
          <button id="clipboardButton" onClick={pasteToClipboard}>Copy to Clipboard</button>
          <Notification title={notification.title}
                        description={notification.description}
                        type={notification.type}
                        isVisible={notification.isVisible} 
                        setNotification={setNotification}/>
        </div>
      ) :""}
    </div>
  );
}
