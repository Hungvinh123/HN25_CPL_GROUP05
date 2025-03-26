import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function UserList() {
    const [users, setUsers] = useState(null); // Initialize as null
    const [loading, setLoading] = useState(true); // Add a loading state
    const [error, setError] = useState(null); // Add an error state

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/user.json');

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setUsers(data);
                setLoading(false);
            } catch (e) {
                setError(e);
                setLoading(false);
                console.error("Error fetching data:", e);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading user data...</div>; // Loading message
    }

    if (error) {
        return <div>Error: {error.message}</div>; // Error message
    }

    if (!users) {
        return <div>No user data available.</div>; // No data message
    }

    return (
        <div>
            <h2>User List</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <Link to={`/users/${user.id}`}>{user.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserList;
