import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ItemList from './ItemList';
import MemberManager from './MemberManager';


const MOCK_DATA = {
  'list-1': {
    id: 'list-1',
    name: 'Víkendový nákup',
    owner: { id: 'user-1', name: 'Petr (Vlastník)' },
    members: [
      { id: 'user-2', name: 'Jana' },
      { id: 'user-3', name: 'Karel' },
    ],
    items: [
      { id: 'item-1', name: 'Mléko', solved: false },
      { id: 'item-2', name: 'Chleba', solved: true },
      { id: 'item-3', name: 'Vejce', solved: false },
    ],
  },
};


const CURRENT_USER_ID = 'user-1'; 

const ShoppingListDetail = () => {
  const { listId } = useParams(); 
  const initialList = MOCK_DATA[listId];


  const [list, setList] = useState(initialList);
  const [listNameInput, setListNameInput] = useState(initialList.name);

  if (!list) {
    return <div>Nákupní seznam nenalezen.</div>;
  }


  const isOwner = list.owner.id === CURRENT_USER_ID;
  const isMember = isOwner || list.members.some(m => m.id === CURRENT_USER_ID);

  if (!isMember) {
    return <div>K tomuto seznamu nemáte přístup.</div>;
  }




  const handleNameSave = () => {
    setList(prevList => ({ ...prevList, name: listNameInput }));
  };


  const handleAddMember = (name) => {
    if (name && isOwner) {
      const newMember = { id: `user-${Date.now()}`, name };
      setList(prevList => ({
        ...prevList,
        members: [...prevList.members, newMember],
      }));
    }
  };


  const handleRemoveMember = (memberId) => {
    if (isOwner) {
      setList(prevList => ({
        ...prevList,
        members: prevList.members.filter(m => m.id !== memberId),
      }));
    }
  };


  const handleLeaveList = () => {
    if (!isOwner) { 
      setList(prevList => ({
        ...prevList,
        members: prevList.members.filter(m => m.id !== CURRENT_USER_ID),
      }));
    }
  };


  const handleAddItem = (itemName) => {
    if (itemName) {
      const newItem = { id: `item-${Date.now()}`, name: itemName, solved: false };
      setList(prevList => ({
        ...prevList,
        items: [...prevList.items, newItem],
      }));
    }
  };


  const handleRemoveItem = (itemId) => {
    setList(prevList => ({
      ...prevList,
      items: prevList.items.filter(i => i.id !== itemId),
    }));
  };


  const handleToggleItem = (itemId) => {
    setList(prevList => ({
      ...prevList,
      items: prevList.items.map(item =>
        item.id === itemId ? { ...item, solved: !item.solved } : item
      ),
    }));
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
            <button onClick={handleNameSave}>Uložit název</button>
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
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr', 
    gap: '30px',
  },
};

export default ShoppingListDetail;