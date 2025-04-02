//ImageProcessor.js

import { useState, useEffect, useRef } from "react";

// const image = document.getElementById('file');

export default function ImageToASCII() {
  const [ASCIIMap, setASCIIMap] = useState(".:-=+*?#%@");
  const [customMap, setCustomMap] = useState("");
  const [asciiImage, setAsciiImage] = useState("");
  const [scaledAsciiImage ,setScaledAsciiImage]  = useState("");
  const canvasRef = useRef();
  const [scale, setScale] = useState(4);

  //Rerender Image if controls change
  useEffect((event) => {
    processImage(event);
  }, [scale])

  function processImage(event) {
    const file = event.target.files[0];
    
    if (file) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const image = document.createElement("img");

      image.onload = () => {
        //Setting canvas size
        canvas.width = image.width;
        canvas.height = image.height;
        
        ctx.drawImage(image, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        const lightValues = [];
        //Getting the average light value of the rgb
        for(let i = 2; i < pixels.length; i+=4){
          const red = pixels[i-2];
          const green = pixels[i-1];
          const blue = pixels[i];
          const average = ((red + green + blue)/3)/255;
          lightValues.push(average);
        }
        /**
         * Create a 2d Matrix of the average light values
         * @param {Array} data 
         * @param {Number} width 
         * @param {Number} height 
         * @returns 2D Array
         */
        function create2dMatrixOfLightValues(data, width, height){
          const pixelData = new Array(height);
          for(let i = 0; i < height; i++){
            const rowData = new Array(width)
            for(let j = 0; j < width; j++){
              rowData[j] = data[i*width + j];
            }
            pixelData[i] = rowData;
          }
          return pixelData;
        }
        const lightData = create2dMatrixOfLightValues(lightValues, canvas.width, canvas.height);

        //Cut the image down to scale
        function getAveragePixelBlockLightValue(lightData, x, y, scale){ 

          let sum = 0;
          
          for(let i = 0; i < scale; i++){
            for(let j = 0; j < scale; j++){
              //inbounds
              if(lightData[y+i] && lightData[y+i][x+j] !== undefined){
                sum += lightData[y+i][j+x];
              }
            }
          }
          return sum/(scale*scale);
        }

        function scaleASCII(lightData, scale){
          let newLightData = [];

          for(let i  = 0; i < lightData.length; i+= scale){
            const rowData = [];
            for(let j = 0; j < lightData[0].length; j+= scale){
              rowData.push(getAveragePixelBlockLightValue(lightData, j, i, scale));
            }
            newLightData.push(rowData);
          }
          return newLightData;
        }
        const scaledLightData = scaleASCII(lightData, scale); //Error here
        setScaledAsciiImage(scaledLightData);

        //Map data to chars
        const res = createASCIIImage(scaledLightData, scaledLightData.length, scaledLightData[0].length);
        setAsciiImage(res);

      };
      const reader = new FileReader();
      reader.onload = (e) => {image.src = e.target.result};
      reader.readAsDataURL(file);
    }
  }

  // ASCII MAP: .:-=+*?#%@
  function createASCIIImage(scaledLightData, height, width){
    const image = new Array(width);
    for(let i = 1; i < height; i+=2){
      const row = new Array(width+1);
      for(let j = 0; j < width; j++){
        const twoRowAverage = (scaledLightData[i][j] + scaledLightData[i-1][j]) /2;
        row[j]= calculateASCII(twoRowAverage);
      }
      row[width+1] = "\n";
      image[i] = row.join('');
    }
    return image.join('');
  }
  function calculateASCII(lightValue){
    const mapIndex = Math.floor(lightValue * (ASCIIMap.length-1));
    return ASCIIMap[mapIndex];
  }

  function pasteToClipboard(){
    navigator.clipboard.writeText(asciiImage).then(()=>{
      console.log("Copied to Clipboard");
    }).catch(() => {
      console.log("Failed to Copy.")
    })
  }
  function handleCustomMap(event){
    const mapValue = event.target.value;
    function isValidMap(map){

      //Map is too long
      if(map.length > 20){
        return false;
      }

      return true;
    }
    if(isValidMap(mapValue)){
      setCustomMap(mapValue);
    }
  }
  
  return (
    <div className="image-to-ascii">
      <input className="file" type="file" onChange={processImage}></input>
      <p>Image</p>
      <canvas ref={canvasRef} id="photoView"></canvas>
      <div className="controls">
        <p>States:</p>
        <p>ASCII Map: {ASCIIMap}</p>
        <p>Custom Map: {customMap}</p>
        <p>Scale: {scale}</p>
        <select defaultValue={".:-=+*?#%@"} onChange={(event) => {setASCIIMap(event.target.value)}}>
          <option value={".:-=+*?#%@"}>Default</option>
          <option value={"@%#?*+=-:."}>Inverted</option>
          <option value={"1273456980"}>Numerical</option>
          <option value={"0896543721"}>Numerical Inverted</option>
          <option value={"custom"}>Custom</option>
        </select>
        {ASCIIMap === "custom" ? (<input value={customMap} onChange={handleCustomMap}/>) : ""}
        <select defaultValue={4} onChange={(event) => setScale(event.target.value)}>
          <option value={1}>1x</option>
          <option value={2}>2x</option>
          <option value={3}>3x</option>
          <option value={4}>4x</option>
        </select>
      </div>
      <p>ASCII Art</p>
      <div>
        <pre className="asciiImage">{asciiImage}</pre>
      </div>
      <button onClick={pasteToClipboard}>Clipboard</button>
    </div>
  );
}