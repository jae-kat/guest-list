import './App.scss';
import { useEffect, useRef, useState } from 'react';

export default function Guestlist() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestList, setGuestList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [attendingOnly, setAttendingOnly] = useState(false);
  const [notAttendingOnly, setNotAttendingOnly] = useState(false);
  const firstNameIsFocused = useRef(null);
  const lastNameIsFocused = useRef(null);

  // const baseUrl = 'http://localhost:4000';
  const baseUrl = 'https://react-guestlist.herokuapp.com';

  // getting all guests (GET)
  useEffect(() => {
    async function getGuests() {
      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();
      setGuestList([...allGuests]);
    }
    getGuests().catch((error) => console.log('get all guests error:' + error));
    setIsLoading(false);
  }, []);

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
      setGuestList([...guestList, createdGuest]);
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
    const newList = guestList.filter((guest) => guest.id !== deletedGuest.id);
    setGuestList([...newList]);
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
    setHasError(false);
    const updatedGuest = await response.json();
    const newList = guestList.map((guest) => {
      if (guest.id === id) {
        return updatedGuest;
      } else {
        return guest;
      }
    });
    setGuestList([...newList]);
  }

  // change firstName of existing guest (Update)
  async function handleUpdateFirstName(id) {
    const newFirstName = prompt('Change the first name:');

    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName: newFirstName }),
    });
    setHasError(false);
    const updatedGuest = await response.json();
    const newList = guestList.map((guest) => {
      if (guest.id === id) {
        return updatedGuest;
      } else {
        return guest;
      }
    });
    setGuestList([...newList]);
  }

  // change lastName of existing guest (Update)
  async function handleUpdateLastName(id) {
    const newLastName = prompt('Change the last name:');

    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lastName: newLastName }),
    });
    setHasError(false);
    const updatedGuest = await response.json();
    const newList = guestList.map((guest) => {
      if (guest.id === id) {
        return updatedGuest;
      } else {
        return guest;
      }
    });
    setGuestList([...newList]);
  }

  // delete all guest entries
  async function handleDeleteAll() {
    for (const guest of guestList) {
      await fetch(`${baseUrl}/guests/${guest.id}`, {
        method: 'DELETE',
      });
    }
    firstNameIsFocused.current.focus();
    setHasError(false);
    setGuestList([]);
  }

  // map over the saved list: callback function to create a div for each individual guest
  function mapOverGuestList(guest) {
    return (
      <div
        key={`guest-${guest.lastName}-${guest.id}`}
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
          ) : guestList.length === 0 ? (
            <p>
              <i>
                Use the input fields below to begin keeping track of your
                guestlist
              </i>
            </p>
          ) : attendingOnly ? (
            guestList
              .filter((guest) => guest.attending)
              .map((guest) => mapOverGuestList(guest))
          ) : notAttendingOnly ? (
            guestList
              .filter((guest) => !guest.attending)
              .map((guest) => mapOverGuestList(guest))
          ) : (
            guestList.map((guest) => mapOverGuestList(guest))
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

        <div className="addGuest">
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
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    lastNameIsFocused.current.focus();
                  }
                }}
              />
            </label>
            <label>
              Last name:
              <input
                onChange={(event) => setLastName(event.target.value)}
                value={lastName}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    handleAddGuest().catch((error) => console.log(error));
                  }
                }}
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
          </div>
        </div>
        <div className="deleteAll">
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
