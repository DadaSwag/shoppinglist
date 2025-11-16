import React, { useState } from 'react';

const CreateListModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(name);
    setName('');
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Vytvořit nový seznam</h2>
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>
            Název seznamu:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              autoFocus
            />
          </label>
          <div style={styles.buttonGroup}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Zrušit
            </button>
            <button type="submit" disabled={!name} style={styles.createButton}>
              Vytvořit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    padding: '20px 30px',
    borderRadius: '8px',
    minWidth: '300px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    fontSize: '0.9em',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '1em',
    marginTop: '5px',
    boxSizing: 'border-box',
  },
  buttonGroup: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    marginRight: '10px',
  },
  createButton: {
    background: '#007bff',
    color: 'white',
    border: 'none',
  }
};

export default CreateListModal;