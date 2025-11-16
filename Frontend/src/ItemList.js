import React, { useState, useMemo } from 'react';

const ItemList = ({ items, onAddItem, onRemoveItem, onToggleItem }) => {
  const [newItemName, setNewItemName] = useState('');

  const [filter, setFilter] = useState('all');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddItem(newItemName);
    setNewItemName(''); 
  };


  const filteredItems = useMemo(() => {
    switch (filter) {
      case 'pending':
        return items.filter(item => !item.solved);
      case 'solved':
        return items.filter(item => item.solved);
      case 'all':
      default:
        return items;
    }
  }, [items, filter]);

  return (
    <div style={styles.itemListContainer}>
      <h2>Položky seznamu</h2>


      <form onSubmit={handleSubmit} style={styles.addForm}>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Nová položka..."
          style={styles.addItemInput}
        />
        <button type="submit">Přidat</button>
      </form>


      <div style={styles.filterContainer}>
        Filtrovat:
        <button onClick={() => setFilter('all')} disabled={filter === 'all'}>Vše</button>
        <button onClick={() => setFilter('pending')} disabled={filter === 'pending'}>Jen nevyřešené</button>
        <button onClick={() => setFilter('solved')} disabled={filter === 'solved'}>Jen vyřešené</button>
      </div>


      <ul style={styles.ul}>
        {filteredItems.length === 0 && (
          <li style={styles.noItems}>Žádné položky k zobrazení.</li>
        )}
        {filteredItems.map(item => (
          <li key={item.id} style={styles.item}>
            <input
              type="checkbox"
              checked={item.solved}
              onChange={() => onToggleItem(item.id)}
            />
            <span style={item.solved ? styles.itemSolved : {}}>
              {item.name}
            </span>
            <button onClick={() => onRemoveItem(item.id)} style={styles.removeButton}>
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  itemListContainer: {
    paddingLeft: '20px',
    borderLeft: '1px solid #eee',
  },
  addForm: {
    display: 'flex',
    marginBottom: '15px',
  },
  addItemInput: {
    flex: 1,
    padding: '8px',
    marginRight: '10px',
  },
  filterContainer: {
    marginBottom: '15px',
  },
  ul: {
    listStyleType: 'none',
    padding: 0,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #f4f4f4',
  },
  itemSolved: {
    textDecoration: 'line-through',
    color: '#999',
  },
  removeButton: {
    marginLeft: 'auto',
    background: '#ff4d4d',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
  },
  noItems: {
    color: '#888',
    fontStyle: 'italic',
  }
};

export default ItemList;