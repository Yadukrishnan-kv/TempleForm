import './App.css';
import Dom from './RouterDom/Dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <div className="App">
    <Dom/>
    <ToastContainer />
    </div>
  );
}

export default App;
