import React from 'react';
import { Table } from 'react-bootstrap';
import SongTableRow from './SongTableRow';

const SongsTable = ({ songs, selectedSong, onSelectSong, onLike, onToggleStatus, onViewDetails }) => {
  return (
    <Table striped bordered hover responsive>
      <thead className="bg-dark text-white">
        <tr>
          <th className="text-center">STT</th>
          <th>Tên bài hát</th>
          <th>Ca sĩ</th>
          <th className="text-center">Thời gian phát</th>
          <th className="text-center">Lượt yêu thích</th>
          <th className="text-center">Trạng thái</th>
          <th className="text-center">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {songs.map((song, index) => (
          <SongTableRow
            key={song.id}
            song={song}
            index={index}
            isSelected={selectedSong && selectedSong.id === song.id}
            onSelectSong={onSelectSong}
            onLike={onLike}
            onToggleStatus={onToggleStatus}
            onViewDetails={onViewDetails}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default SongsTable;