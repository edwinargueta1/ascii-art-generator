import { useState } from 'react';
import './App.css';
import ImageToASCII from './ImageToASCII';
import Footer from './Components/Footer';
import InfoWindow from './Components/InfoWindow';

function App() {
  const [isInfoWindowHidden , setIsInfoWindowHidden] = useState(false);
  return (
    <div className="App">
      <h1>ASCII Art Generator</h1>
      <ImageToASCII />
      <Footer windowToggle={setIsInfoWindowHidden}/>
      <InfoWindow isHidden={isInfoWindowHidden} windowToggle={setIsInfoWindowHidden}/>
    </div>
  );
}

export default App;