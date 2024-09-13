<template>
    <div class="sidebar">
      <ul>
        <li>
          <router-link to="/notice/noticeMain">공지사항</router-link>
          <router-link to="/notice/noticeFAQ">FAQ</router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .sidebar {
    width: 130px; /* 사이드바 너비 */
    background-color: #f4f4f4; /* 배경색 */
    padding: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }
  
  .sidebar ul {
    list-style: none;
    padding: 0;
  }
  
  .sidebar ul li {
    margin: 15px 0;
    transition: background-color 0.3s, border-radius 0.3s, box-shadow 0.3s;
    line-height: 3.5;
  }
  
  .sidebar ul li a {
    text-decoration: none;
    color: #333;
    font-weight: bold;
    display: block;
    padding: 10px;
    border-radius: 5px;
    transition: color 0.3s;
  }
  
  .sidebar ul li a:hover {
    background-color: #bcdef7;
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }
  </style>
  