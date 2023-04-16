
import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
import { Content } from "./components/Content";
import { FeedbackForm } from "./components/FeedbackForm";
import {Footer} from "./components/Footer"
import './App.css';

function App() {
  return (
    <>
      <NavBar/>
      <Banner />
      <Content />
      <FeedbackForm/>
      <Footer/>
      
    </>
  );
}

export default App;
