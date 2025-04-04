import React from 'react';
import { Button } from 'react-bootstrap';

const SongTableRow = ({ song, index, isSelected, onSelectSong, onLike, onToggleStatus, onViewDetails }) => {
  return (
    <tr key={song.id} className={isSelected ? 'table-primary' : ''}>
      <td className="text-center">{index + 1}</td>
      <td>
        <span 
          className="text-primary" 
          style={{ cursor: 'pointer' }}
          onClick={() => onSelectSong(song)}
        >
          {song.title}
        </span>
      </td>
      <td>{song.artist}</td>
      <td className="text-center">{song.duration}</td>
      <td className="text-center">
        {song.likes}
        <Button 
          variant="link" 
          onClick={() => onLike(song.id)}
          className="ms-2 p-0"
        >
          <i className="bi bi-heart-fill text-danger"></i>
        </Button>
      </td>
      <td className="text-center">
        <span className={`badge ${song.status === 'Public' ? 'bg-success' : 'bg-secondary'}`}>
          {song.status === 'Public' ? 'Công khai' : 'Lưu trữ'}
        </span>
      </td>
      <td className="text-center">
        <Button 
          variant="primary" 
          size="sm"
          onClick={() => onSelectSong(song)}
          className="me-2"
        >
          <i className="bi bi-play-fill"></i> Phát
        </Button>
        <Button 
          variant={song.status === 'Public' ? 'warning' : 'success'} 
          size="sm"
          onClick={() => onToggleStatus(song)}
          className="me-2"
        >
          {song.status === 'Public' ? 'Lưu trữ' : 'Công khai'}
        </Button>
        <Button 
          variant="info" 
          size="sm"
          onClick={() => onViewDetails(song.id)}
        >
          Chi tiết
        </Button>
      </td>
    </tr>
  );
};

export default SongTableRow;