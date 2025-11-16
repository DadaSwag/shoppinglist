import React, { useState } from 'react';

const MemberManager = ({ 
  owner, 
  members, 
  isOwner, 
  currentUserId, 
  onAddMember, 
  onRemoveMember, 
  onLeaveList 
}) => {
  const [newMemberName, setNewMemberName] = useState('');

  const handleAdd = () => {
    onAddMember(newMemberName);
    setNewMemberName('');
  };

  return (
    <div style={styles.container}>
      <h3>Správa seznamu</h3>
      
      <p>
        <strong>Vlastník:</strong> {owner.name}
      </p>

      <strong>Členové:</strong>
      <ul style={styles.ul}>
        {members.map(member => (
          <li key={member.id} style={styles.memberItem}>
            {member.name}
            {isOwner && member.id !== owner.id && (
              <button onClick={() => onRemoveMember(member.id)} style={styles.removeButton}>
                Odebrat
              </button>
            )}
          </li>
        ))}
      </ul>

    
      {isOwner && (
        <div style={styles.actionBlock}>
          <h4>Přidat člena</h4>
          <input
            type="text"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            placeholder="Jméno člena"
            style={styles.input}
          />
          <button onClick={handleAdd}>Přidat</button>
        </div>
      )}

    
      {!isOwner && (
        <div style={styles.actionBlock}>
          <button onClick={onLeaveList} style={styles.leaveButton}>
            Opustit seznam
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontSize: '0.9em',
  },
  ul: {
    listStyleType: 'none',
    padding: 0,
    margin: '5px 0 15px 0',
  },
  memberItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4px',
    background: '#f9f9f9',
    marginBottom: '4px',
    borderRadius: '4px',
  },
  removeButton: {
    background: 'none',
    border: '1px solid #ccc',
    color: '#b00',
    fontSize: '0.8em',
    cursor: 'pointer',
  },
  actionBlock: {
    marginTop: '20px',
    paddingTop: '10px',
    borderTop: '1px solid #eee',
  },
  input: {
    display: 'block',
    width: '90%',
    padding: '6px',
    marginBottom: '8px',
  },
  leaveButton: {
    width: '100%',
    padding: '8px',
    background: '#fbeaea',
    color: '#c00',
    border: '1px solid #c00',
    cursor: 'pointer',
  }
};

export default MemberManager;