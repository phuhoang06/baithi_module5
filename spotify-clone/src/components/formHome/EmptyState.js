import React from 'react';

const EmptyState = ({ isLoading }) => {
  if (isLoading) return null;
  return (
    <div className="text-center mt-4">
      <p>Không tìm thấy bài hát nào.</p>
    </div>
  );
};

export default EmptyState;