import React, { useState, useMemo } from 'react';
import ListGrid from './ListGrid';
import CreateListModal from './CreateListModal';

const CURRENT_USER_ID = 'user-1';

const MOCK_LISTS = [
  { id: 'list-1', name: 'Víkendový nákup', ownerId: 'user-1', archived: false },
  { id: 'list-2', name: 'Párty Oslava', ownerId: 'user-2', archived: false },
  { id: 'list-3', name: 'Grilovačka', ownerId: 'user-1', archived: false },
  { id: 'list-4', name: 'Starý nákup', ownerId: 'user-1', archived: true },
];

const ShoppingListOverview = () => {
  // --- STAVY ---
  const [lists, setLists] = useState(MOCK_LISTS);
  const [filter, setFilter] = useState('active');
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleCreateList = (name) => {
    if (!name) return;

    const newList = {
      id: `list-${Date.now()}`,
      name: name,
      ownerId: CURRENT_USER_ID,
      archived: false,
    };

    setLists(prevLists => [...prevLists, newList]);
    setIsModalOpen(false);
  };

  const handleDeleteList = (listId, listName) => {
    const listToDelete = lists.find(list => list.id === listId);

    if (listToDelete.ownerId !== CURRENT_USER_ID) {
      alert("Nemáte oprávnění smazat tento seznam, nejste jeho vlastníkem.");
      return;
    }

    const isConfirmed = window.confirm(`Opravdu chcete smazat seznam "${listName}"?`);

    if (isConfirmed) {
      setLists(prevLists => prevLists.filter(list => list.id !== listId));
    }
  };

  const filteredLists = useMemo(() => {
    if (filter === 'all') {
      return lists;
    }
    return lists.filter(list => !list.archived);
  }, [lists, filter]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Přehled nákupních seznamů</h1>
        <div style={styles.controls}>
          <div>
            Zobrazit:
            <button onClick={() => setFilter('active')} disabled={filter === 'active'}>
              Ne-archivované
            </button>
            <button onClick={() => setFilter('all')} disabled={filter === 'all'}>
              Včetně archivovaných
            </button>
          </div>
          <button onClick={() => setIsModalOpen(true)} style={styles.createButton}>
            + Vytvořit nový seznam
          </button>
        </div>
      </header>

      <ListGrid
        lists={filteredLists}
        onDelete={handleDeleteList}
        currentUserId={CURRENT_USER_ID}
      />

      <CreateListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateList}
      />
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '0 20px',
  },
  header: {
    borderBottom: '2px solid #eee',
    paddingBottom: '15px',
    marginBottom: '20px',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
  },
  createButton: {
    background: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
  }
};

export default ShoppingListOverview;