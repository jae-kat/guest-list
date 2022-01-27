import './App.scss';
import FetchData from './FetchData';
import GuestInput from './GuestInput';

function App() {
  return (
    <div>
      <h1>Guestlist</h1>
      <GuestInput />
      <FetchData />
    </div>
  );
}

export default App;
