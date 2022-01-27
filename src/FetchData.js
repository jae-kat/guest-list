import { useEffect, useState } from 'react';

export default function FetchData() {
  const [guests, setGuests] = useState('');
  const baseUrl = 'http://localhost:4000';

  useEffect(() => {
    async function data() {
      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();

      setGuests(allGuests);
      console.log(guests);
    }
    data().catch((error) => console.log(error));
  }, [guests]);

  return (
    <div>
      <p>{guests}</p>
    </div>
  );
}
