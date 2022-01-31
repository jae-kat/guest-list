import { useEffect, useRef, useState } from 'react';

export default function Guestlist() {
  const [updateDisplay, setUpdateDisplay] = useState('empty');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [savedList, setSavedList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [attendingOnly, setAttendingOnly] = useState(false);
  const [notAttendingOnly, setNotAttendingOnly] = useState(false);
  const firstNameIsFocused = useRef(null);
  const lastNameIsFocused = useRef(null);

  const baseUrl = 'https://react-guestlist.herokuapp.com/';
  // const baseUrl = 'http://localhost:4000';

  // getting all guests (GET)
  useEffect(() => {
    async function getGuests() {
      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();
      setSavedList(allGuests);
      console.log(allGuests);
      setIsLoading(false);
    }
    getGuests().catch((error) => console.log('get all guests error:' + error));
  }, [updateDisplay]);

  // creating a new guest (POST)
  async function handleAddGuest() {
    // check if both input fields have been filled out
    if (firstName.length === 0 || lastName.length === 0) {
      setHasError(true);
    } else {
      // add the guest data to the list
      await fetch(`${baseUrl}/guests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName: firstName, lastName: lastName }),
      });
      setUpdateDisplay(`guest ${firstName} ${lastName} added`);
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
    await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    setHasError(false);
    setUpdateDisplay(`guest with id ${id} deleted`);
  }

  // change attending status (UPDATE)
  async function handleUpdateGuest(id, attending) {
    await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: !attending }),
    });
    setHasError(false);
    setUpdateDisplay(`status of guest with id ${id} changed to ${!attending}`);
  }

  // change firstName of existing guest (Update)
  async function handleUpdateFirstName(id) {
    const newFirstName = prompt('Change the first name:');

    await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName: newFirstName }),
    });
    setHasError(false);
    setUpdateDisplay(
      `first name of guest with id ${id} was changed to ${newFirstName}`,
    );
  }

  // change lastName of existing guest (Update)
  async function handleUpdateLastName(id) {
    const newLastName = prompt('Change the last name:');

    await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lastName: newLastName }),
    });
    setHasError(false);
    setUpdateDisplay(
      `last name of guest with id ${id} was changed to ${newLastName}`,
    );
  }

  // delete all guest entries
  async function handleDeleteAll() {
    for (const guest of savedList) {
      await fetch(`${baseUrl}/guests/${guest.id}`, {
        method: 'DELETE',
      });
    }
    firstNameIsFocused.current.focus();
    setHasError(false);
    setUpdateDisplay('all guests have been deleted');
  }

  // map over the saved list: callback function to create a div for each individual guest
  function mapOverSavedList(guest) {
    return (
      <div
        key={guest.lastName + guest.id}
        data-test-id="guest"
        className="guest"
      >
        <div className="guestName" title="double-click to edit name">
          <p onDoubleClick={() => handleUpdateFirstName(guest.id)}>
            {`${guest.firstName} `}
          </p>
          <p onDoubleClick={() => handleUpdateLastName(guest.id)}>
            {guest.lastName}
          </p>
        </div>
        <div className="status">
          <label>
            <input
              type="checkbox"
              aria-label={'change attending status for ' + guest.firstName}
              checked={guest.attending}
              onChange={() => {
                handleUpdateGuest(guest.id, guest.attending).catch((error) =>
                  console.log('update guest: ' + error),
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
    );
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
          ) : attendingOnly ? (
            savedList
              .filter((guest) => guest.attending)
              .map((guest) => mapOverSavedList(guest))
          ) : notAttendingOnly ? (
            savedList
              .filter((guest) => !guest.attending)
              .map((guest) => mapOverSavedList(guest))
          ) : (
            savedList.map((guest) => mapOverSavedList(guest))
          )}
        </div>

        <div className="filters">
          <button
            className={attendingOnly ? 'active' : 'inactive'}
            onClick={() => {
              setAttendingOnly(true);
              setNotAttendingOnly(false);
            }}
          >
            Show attending only
          </button>
          <button
            className={notAttendingOnly ? 'active' : 'inactive'}
            onClick={() => {
              setNotAttendingOnly(true);
              setAttendingOnly(false);
            }}
          >
            Show not attending only
          </button>
          <button
            className={
              !attendingOnly && !notAttendingOnly ? 'active' : 'inactive'
            }
            onClick={() => {
              setAttendingOnly(false);
              setNotAttendingOnly(false);
            }}
          >
            Show all guests
          </button>
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
            className="add"
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
