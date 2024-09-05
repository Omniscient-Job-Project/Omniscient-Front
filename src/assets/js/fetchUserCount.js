// src/assets/js/fetchUserCount.js
import axios from 'axios';

export async function fetchUserCount(userCountRef) {
    try {
        const response = await axios.get('/api/user-count'); // Ensure the correct API endpoint is used
        userCountRef.value = response.data;
    } catch (error) {
        console.error('Error fetching user count:', error);
    }
}
