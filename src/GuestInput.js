import { useState } from 'react';

export default function GuestInput() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestList, setGuestList] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  const guest = `${firstName} ${lastName}`;

  function handleAddGuest() {
    // needs to: - setGuestList to current first and last name values
    setGuestList([...guestList, guest]);
    //           - setFirstName and setLastName to empty
    setFirstName('');
    setLastName('');
  }

  function handleRemoveGuest() {
    const currentList = [...guestList];
    currentList.pop();
    setGuestList([...currentList]);
  }

  return (
    <div>
      <div>
        Display the guestlist here
        <div>
          {guestList.map((singleGuest) => {
            return (
              <div key={singleGuest}>
                <p>{singleGuest}</p>
                <label>
                  {' '}
                  {isChecked ? 'Attending' : 'Not attending'}
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setIsChecked(isChecked ? false : true)}
                  />
                </label>
              </div>
            );
          })}
        </div>
      </div>

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
      <button onClick={handleRemoveGuest}>Remove last guest</button>
    </div>
  );
}
