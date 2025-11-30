import React, { useState, useMemo, useEffect } from 'react';
import ListGrid from './ListGrid';
import CreateListModal from './CreateListModal';
import { ShoppingListApi } from './api/ShoppingListApi';

const CURRENT_USER_ID = 'user-1';

const ShoppingListOverview = () => {
  const [lists, setLists] = useState([]);
  const [filter, setFilter] = useState('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ShoppingListApi.getLists();
      setLists(data);
    } catch (err) {
      console.error(err);
      setError("Nepodařilo se načíst seznamy.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateList = async (name) => {
    if (!name) return;
    try {
      const newList = await ShoppingListApi.createList(name, CURRENT_USER_ID);
      setLists(prev => [...prev, {
         id: newList.id,
         name: newList.name,
         ownerId: newList.owner.id,
         archived: newList.archived
      }]);
      setIsModalOpen(false);
    } catch (err) {
      alert("Chyba při vytváření seznamu.");
    }
  };

  const handleDeleteList = async (listId, listName) => {
    const listToDelete = lists.find(list => list.id === listId);
    if (listToDelete.ownerId !== CURRENT_USER_ID) {
      alert("Nemáte oprávnění.");
      return;
    }
    const isConfirmed = window.confirm(`Opravdu smazat "${listName}"?`);
    if (isConfirmed) {
      try {
        await ShoppingListApi.deleteList(listId);
        setLists(prev => prev.filter(list => list.id !== listId));
      } catch (err) {
        alert("Chyba při mazání seznamu.");
      }
    }
  };

  const filteredLists = useMemo(() => {
    if (filter === 'all') return lists;
    return lists.filter(list => !list.archived);
  }, [lists, filter]);

  if (isLoading) {
    return <div style={{ padding: 20 }}>Načítám seznamy...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 20, color: 'red' }}>
        Chyba: {error} <br/>
        <button onClick={loadLists}>Zkusit znovu</button>
      </div>
    );
  }

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
  container: { fontFamily: 'Arial', maxWidth: '1200px', margin: '20px auto', padding: '0 20px' },
  header: { borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '20px' },
  controls: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' },
  createButton: { background: '#007bff', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }
};

export default ShoppingListOverview;