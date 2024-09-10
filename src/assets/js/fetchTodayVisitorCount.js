// src/assets/js/fetchTodayVisitorCount.js

import axios from 'axios';

export const fetchTodayVisitorCount = async (visitorCountRef) => {
  try {
    const response = await axios.get('http://localhost:8090/api/v1/todayVisitor');
    visitorCountRef.value = response.data.todayVisitorCount;
  } catch (error) {
    console.error('Failed to fetch today\'s visitor count:', error);
  }
};
