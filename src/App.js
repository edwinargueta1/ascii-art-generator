import { useEffect, useState } from 'react';
import './App.css';
import ImageToASCII from './ImageToASCII';

function App() {

  const [image, setImage] = useState();

  useEffect(() => {

  }, [image])

  return (
    <div className="App">
      <h1>ASCII Art Generator</h1>
      <ImageToASCII/>
    </div>
  );
}

export default App;