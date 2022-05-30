import "./App.css";

// scenes
import Home from "./scenes/Home/Home";
import Feed from "./scenes/Feed/Feed";
import Experiment from "./scenes/Experiment/Experiment";

// dependencies
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="feed" element={<Feed />} />
        <Route path="experiment" element={<Experiment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
