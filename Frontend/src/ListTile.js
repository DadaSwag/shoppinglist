import React from 'react';
import { Link } from 'react-router-dom';

const ListTile = ({ list, onDelete, isOwner }) => {
  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(list.id, list.name);
  };

  const tileStyle = {
    ...styles.tile,
    background: list.archived ? '#f9f9f9' : '#ffffff',
    borderColor: list.archived ? '#eee' : '#ddd',
  };

  return (
    <Link to={`/list/${list.id}`} style={styles.tileLink}>
      <div style={tileStyle}>
        <h3 style={styles.tileTitle}>{list.name}</h3>

        {list.archived && <span style={styles.archivedBadge}>Archivováno</span>}

        {isOwner && (
          <button onClick={handleDeleteClick} style={styles.deleteButton}>
            Smazat
          </button>
        )}
      </div>
    </Link>
  );
};

const styles = {
  tileLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  tile: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    minHeight: '100px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'box-shadow 0.2s ease',
    position: 'relative',
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    }
  },
  tileTitle: {
    marginTop: 0,
    marginBottom: '10px',
  },
  archivedBadge: {
    fontSize: '0.8em',
    color: '#777',
    fontStyle: 'italic',
  },
  deleteButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: '#ff4d4d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '5px 8px',
    cursor: 'pointer',
    fontSize: '0.8em',
    opacity: 0.8,
    transition: 'opacity 0.2s',
    '&:hover': {
      opacity: 1,
    }
  }
};

export default ListTile;