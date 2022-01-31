import { useEffect, useRef, useState } from 'react';

export default function Guestlist() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [savedList, setSavedList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [attendingOnly, setAttendingOnly] = useState(false);
  const [notAttendingOnly, setNotAttendingOnly] = useState(false);
  const firstNameIsFocused = useRef(null);
  const lastNameIsFocused = useRef(null);

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
    // check if both input fields have been filled out
    if (firstName.length === 0 || lastName.length === 0) {
      setHasError(true);
    } else {
      // add the guest data to the list
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
      // set focus on the firstName input field
      firstNameIsFocused.current.focus();
      setHasError(false);
    }
  }

  // deleting a guest
  async function handleRemoveGuest(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    console.log(deletedGuest);
    setHasError(false);
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
    setHasError(false);
  }

  // delete all guest entries
  async function handleDeleteAll() {
    let response;
    let deletedGuest;
    for (const guest of savedList) {
      response = await fetch(`${baseUrl}/guests/${guest.id}`, {
        method: 'DELETE',
      });
      deletedGuest = await response.json();
      console.log(deletedGuest);
    }
    console.log('guestlist cleared');
    isFocused.current.focus();
  }

  return (
    <div className="display">
      <h1>Guestlist</h1>
      <div className="content">
        <div className="list">
          {isLoading ? (
            <h1>Loading...</h1>
          ) : savedList.length === 0 ? (
            <p>
              <i>
                Use the input fields below to begin keeping track of your
                guestlist
              </i>
            </p>
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
        <div className={hasError ? 'error inputs' : 'inputs'}>
          {hasError ? (
            <p>Please submit both a first name and a last name!</p>
          ) : null}
          <label>
            First name:
            <input
              onChange={(event) => setFirstName(event.target.value)}
              value={firstName}
              disabled={isLoading ? true : false}
              ref={firstNameIsFocused}
              onKeyPress={(event) =>
                event.key === 'Enter' ? lastNameIsFocused.current.focus() : null
              }
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
              ref={lastNameIsFocused}
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
