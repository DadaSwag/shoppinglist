import { INITIAL_DATA } from './mockData';

const USE_MOCK_API = true;

let mockDatabase = JSON.parse(JSON.stringify(INITIAL_DATA));

const simulateNetworkDelay = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 500);
  });
};

export const ShoppingListApi = {
  getLists: async () => {
    if (USE_MOCK_API) {
      const overview = mockDatabase.map(list => ({
        id: list.id,
        name: list.name,
        ownerId: list.owner.id,
        archived: list.archived
      }));
      return simulateNetworkDelay(overview);
    }
  },

  getListDetail: async (listId) => {
    if (USE_MOCK_API) {
      const list = mockDatabase.find(l => l.id === listId);
      return simulateNetworkDelay(list ? { ...list } : null);
    }
  },

  createList: async (name, currentUserId) => {
    if (USE_MOCK_API) {
      const newList = {
        id: `list-${Date.now()}`,
        name: name,
        owner: { id: currentUserId, name: 'Já (Vlastník)' },
        archived: false,
        members: [],
        items: []
      };
      mockDatabase.push(newList);
      return simulateNetworkDelay(newList);
    }
  },

  deleteList: async (listId) => {
    if (USE_MOCK_API) {
      mockDatabase = mockDatabase.filter(l => l.id !== listId);
      return simulateNetworkDelay({ success: true });
    }
  },

  updateListName: async (listId, newName) => {
    if (USE_MOCK_API) {
      const list = mockDatabase.find(l => l.id === listId);
      if (list) list.name = newName;
      return simulateNetworkDelay(list);
    }
  },

  addItem: async (listId, itemName) => {
    if (USE_MOCK_API) {
      const list = mockDatabase.find(l => l.id === listId);
      if (list) {
        const newItem = { id: `item-${Date.now()}`, name: itemName, solved: false };
        list.items.push(newItem);
        return simulateNetworkDelay(newItem);
      }
    }
  },

  removeItem: async (listId, itemId) => {
    if (USE_MOCK_API) {
      const list = mockDatabase.find(l => l.id === listId);
      if (list) {
        list.items = list.items.filter(i => i.id !== itemId);
      }
      return simulateNetworkDelay({ success: true });
    }
  },

  toggleItem: async (listId, itemId) => {
    if (USE_MOCK_API) {
      const list = mockDatabase.find(l => l.id === listId);
      if (list) {
        const item = list.items.find(i => i.id === itemId);
        if (item) item.solved = !item.solved;
      }
      return simulateNetworkDelay({ success: true });
    }
  },
};