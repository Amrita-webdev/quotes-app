import './App.css';
import CreateQuote from './components/CreateQuote';
import Login from './components/Login';
import QuotesComponent from './components/QuotesComponent';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  const token = localStorage.getItem('authToken')
  return (
    <div className="App">
      <Router>
          <Routes>
            <Route path="/" element={token ? <QuotesComponent /> : <Login />} />
            <Route path="/quotes" element={<QuotesComponent />} />
            <Route path="/create-quotes" element={<CreateQuote />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;
