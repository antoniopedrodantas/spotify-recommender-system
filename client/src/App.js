import './App.css';

// require('dotenv').config();

function App() {
  return (
    <div className="App">
      <p>{process.env.REACT_APP_CLIENT_ID}</p>
      <p>{process.env.REACT_APP_CLIENT_SECRET}</p>
    </div>
  );
}

export default App;
