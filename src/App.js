import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tablist from "./tablist/Tablist";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <h5 className="app-title">Demo Container</h5>
      <div className="demo-container">
        <Tablist />
      </div>
      <ToastContainer/>
    </div>
  );
}

export default App;
