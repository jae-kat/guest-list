import { useEffect, useState } from 'react';

export default function Guestlist() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [savedList, setSavedList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const baseUrl = 'http://localhost:4000';

  // getting all guests (GET)
  useEffect(() => {
    async function getGuests() {
      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();
      setSavedList(Object.values(allGuests));
      setIsLoading(false);
    }
    getGuests().catch((error) => console.log('get all guests error:' + error));
  }, [savedList]);

  // creating a new guest (POST)
  async function handleAddGuest() {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName: firstName, lastName: lastName }),
    });
    const createdGuest = await response.json();
    console.log(createdGuest);

    // clear the input fields
    setFirstName('');
    setLastName('');
  }

  // deleting a guest
  async function handleRemoveGuest(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    console.log(deletedGuest);
  }

  // change attending status (UPDATE)
  async function handleUpdateGuest(id, attending) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: !attending }),
    });
    const updatedGuest = await response.json();
    console.log(updatedGuest);
  }

  // delete all guest entries
  async function handleDeleteAll() {
    for (const guest of savedList) {
      const response = await fetch(`${baseUrl}/guests/${guest.id}`, {
        method: 'DELETE',
      });
      const deletedGuest = await response.json();
    }
    console.log('guestlist cleared');
  }

  return (
    <div className="display">
      <div className="content">
        <div className="list">
          {isLoading ? (
            <h1>Loading...</h1>
          ) : (
            savedList.map((guest) => (
              <div
                key={guest.lastName + guest.id}
                data-test-id="guest"
                className="guest"
              >
                <p className="guestName">
                  {guest.firstName + ' ' + guest.lastName}
                </p>
                <div className="status">
                  <label>
                    <input
                      type="checkbox"
                      aria-label={
                        'change attending status for ' + guest.firstName
                      }
                      checked={guest.attending}
                      onChange={() => {
                        handleUpdateGuest(guest.id, guest.attending).catch(
                          (error) => console.log('update guest: ' + error),
                        );
                      }}
                    />
                    {guest.attending ? 'Attending' : 'Not attending'}
                  </label>
                </div>
                <button
                  onClick={() =>
                    handleRemoveGuest(guest.id).catch((error) =>
                      console.log('remove guest: ' + error),
                    )
                  }
                >
                  Remove guest
                </button>
              </div>
            ))
          )}
        </div>
        <div className="inputs">
          <label>
            First name:
            <input
              onChange={(event) => setFirstName(event.target.value)}
              value={firstName}
              disabled={isLoading ? true : false}
            />
          </label>
          <label>
            Last name:
            <input
              onChange={(event) => setLastName(event.target.value)}
              value={lastName}
              onKeyPress={(event) =>
                event.key === 'Enter' ? handleAddGuest() : null
              }
              disabled={isLoading ? true : false}
            />
          </label>
        </div>
        <div className="buttons">
          <button
            disabled={isLoading ? true : false}
            onClick={() => handleAddGuest()}
          >
            Add guest
          </button>
          <button
            className="delete"
            onClick={() =>
              handleDeleteAll().catch((error) =>
                console.log('delete all: ' + error),
              )
            }
          >
            Delete all guest entries
          </button>
        </div>
      </div>
    </div>
  );
}
