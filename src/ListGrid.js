import React from 'react';
import ListTile from './ListTile';

const ListGrid = ({ lists, onDelete, currentUserId }) => {
  if (lists.length === 0) {
    return <p style={styles.emptyState}>Žádné seznamy k zobrazení.</p>;
  }

  return (
    <div style={styles.grid}>
      {lists.map(list => (
        <ListTile
          key={list.id}
          list={list}
          onDelete={onDelete}
          isOwner={list.ownerId === currentUserId}
        />
      ))}
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  emptyState: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    padding: '40px',
  }
};

export default ListGrid;