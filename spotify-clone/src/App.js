import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Layout from './components/Layout';
import SongList from './components/formHome/SongList';
import SongDetail from './components/formSongDetail/SongDetail';
import SongRegistration from './components/formRegistration/SongRegistration';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<SongList />} />
            <Route path="song/:id" element={<SongDetail />} />
            <Route path="add-song" element={<SongRegistration />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
