import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ItemList from './ItemList';
import MemberManager from './MemberManager';
import { ShoppingListApi } from './api/ShoppingListApi';

const CURRENT_USER_ID = 'user-1';

const ShoppingListDetail = () => {
  const { listId } = useParams();

  const [list, setList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [listNameInput, setListNameInput] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await ShoppingListApi.getListDetail(listId);
        setList(data);
        if (data) {
          setListNameInput(data.name);
        }
      } catch (error) {
        console.error("Chyba při načítání detailu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [listId]);


  if (isLoading) {
    return <div style={{ padding: 20 }}>Načítám detail seznamu...</div>;
  }

  if (!list) {
    return <div style={{ padding: 20 }}>Seznam nenalezen.</div>;
  }

  const isOwner = list.owner.id === CURRENT_USER_ID;
  const isMember = isOwner || list.members.some(m => m.id === CURRENT_USER_ID);

  if (!isMember) {
    return <div style={{ padding: 20 }}>K tomuto seznamu nemáte přístup.</div>;
  }

  const handleNameSave = async () => {
    await ShoppingListApi.updateListName(list.id, listNameInput);
    setList(prev => ({ ...prev, name: listNameInput }));
  };

  const handleAddItem = async (itemName) => {
    if (itemName) {
      const newItem = await ShoppingListApi.addItem(list.id, itemName);
      if (newItem) {
        setList(prev => ({
          ...prev,
          items: [...prev.items, newItem],
        }));
      }
    }
  };

  const handleRemoveItem = async (itemId) => {
    await ShoppingListApi.removeItem(list.id, itemId);

    setList(prev => ({
      ...prev,
      items: prev.items.filter(i => i.id !== itemId),
    }));
  };

  const handleToggleItem = async (itemId) => {
    await ShoppingListApi.toggleItem(list.id, itemId);

    setList(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, solved: !item.solved } : item
      ),
    }));
  };

  const handleAddMember = (name) => {
    console.log("Přidání člena zatím není napojeno na API:", name);
  };

  const handleRemoveMember = (memberId) => {
    console.log("Odebrání člena zatím není napojeno na API:", memberId);
  };

  const handleLeaveList = () => {
    console.log("Opuštění seznamu zatím není napojeno na API");
    setList(null);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        {isOwner ? (
          <div>
            <input
              type="text"
              value={listNameInput}
              onChange={(e) => setListNameInput(e.target.value)}
              style={styles.listNameInput}
            />
            <button onClick={handleNameSave} style={styles.button}>Uložit název</button>
          </div>
        ) : (
          <h1>{list.name}</h1>
        )}
      </header>

      <div style={styles.content}>
        <MemberManager
          owner={list.owner}
          members={list.members}
          isOwner={isOwner}
          currentUserId={CURRENT_USER_ID}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          onLeaveList={handleLeaveList}
        />

        <ItemList
          items={list.items}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          onToggleItem={handleToggleItem}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  },
  header: {
    borderBottom: '2px solid #eee',
    paddingBottom: '15px',
    marginBottom: '20px',
  },
  listNameInput: {
    fontSize: '1.5em',
    fontWeight: 'bold',
    border: '1px solid #ddd',
    padding: '5px',
    marginRight: '10px',
    borderRadius: '4px',
  },
  button: {
    padding: '8px 12px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1em',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '30px',
  },
};

export default ShoppingListDetail;