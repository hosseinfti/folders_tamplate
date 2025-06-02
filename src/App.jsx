import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Content from './components/Content';

export default function App() {
  return (
    <div className="wrapper">
      <Sidebar />
      <Content />
    </div>
  );
}
