import "./App.css";

// scenes
import Home from "./scenes/Home/Home";
import Feed from "./scenes/Feed/Feed";

// dependencies
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="feed" element={<Feed />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
