// src/components/UserList.js

import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const UserList = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')

      if (error) {
        console.error('Error fetching users:', error.message)
      } else {
        setUsers(data)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.full_name}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserList