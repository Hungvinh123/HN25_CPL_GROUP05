import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

 // In UserDetail.jsx
useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/user.json'); // Corrected path
        const data = await response.json();
        const foundUser = data.find((u) => u.id === parseInt(id, 10));
  
        setUser(foundUser || null);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    }
    fetchData();
  }, [id]);
  

  if (!user) {
    return <div>User not found or loading...</div>;
  }

  return (
    <div>
      <h2>User Detail</h2>
      <p>ID: {user.id}</p>
      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>
      <p>Gender: {user.gender}</p>
    </div>
  );
}

export default UserDetail;
