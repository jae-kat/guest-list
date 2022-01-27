import { useState } from 'react';

export default function GuestInput() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestList, setGuestList] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  const guest = `${firstName} ${lastName}`;

  function handleAddGuest() {
    // setGuestList to current first and last name values
    setGuestList([...guestList, guest]);
    // empty the input fields
    setFirstName('');
    setLastName('');
  }

  function handleRemoveGuest() {
    const currentList = [...guestList];
    currentList.pop();
    setGuestList([...currentList]);
  }

  return (
    <div className="display">
      <h1>Guestlist</h1>
      <div className="content">
        <div>
          <div className="list">
            {guestList.map((singleGuest) => {
              return (
                <div key={singleGuest} data-test-id="guest">
                  <p>{singleGuest}</p>
                  <label>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => setIsChecked(isChecked ? false : true)}
                    />
                    {isChecked ? 'Attending ' : 'Not attending '}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <div data-test-id="guest" className="inputs">
          <label className="first">
            First name
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </label>

          <label className="last">
            Last name
            <input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </label>
        </div>
        <div className="buttons">
          <button onClick={handleAddGuest}>Add guest</button>
          <button onClick={handleRemoveGuest}>Remove last guest</button>
        </div>
      </div>
    </div>
  );
}
