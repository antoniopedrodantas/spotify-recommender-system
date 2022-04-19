import "./App.css";

// scenes
import Home from "./scenes/Home/Home";
import Feed from "./scenes/Feed/Feed";
import Results from "./scenes/Results/Results";

// dependencies
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="feed" element={<Feed />} />
        <Route path="results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
