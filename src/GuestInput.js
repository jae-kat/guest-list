import { useState } from 'react';

export default function GuestInput() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestList, setGuestList] = useState([]);

  const guest = firstName + lastName;

  function handleAddGuest() {
    // needs to: - setGuestList to current first and last name values
    //           - setFirstName and setLastName to empty
  }

  return (
    <div>
      <div>Display the guestlist here</div>

      <div data-test-id="guest">
        <label>
          First name
          <input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </label>

        <label>
          Last name
          <input
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </label>
      </div>

      <button onClick={handleAddGuest}>Add guest</button>
      <button>Remove guest</button>
    </div>
  );
}
