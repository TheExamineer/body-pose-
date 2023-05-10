
import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
// import { Content } from "./components/Content";
import { FeedbackForm } from "./components/FeedbackForm";
import {Footer} from "./components/Footer"
import {WebcamCapture} from "./components/camera"

import './App.css';

function App() {
  return (
    <>
      <NavBar/>
      <Banner />
      {/* <Content /> */}
      {/* <FeedbackForm/> */}
      <WebcamCapture/>
      {/* <Footer/> */}
      
    </>
  );
}

export default App;
