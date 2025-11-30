export const INITIAL_DATA = [
  {
    id: 'list-1',
    name: 'Víkendový nákup',
    owner: { id: 'user-1', name: 'Petr (Vlastník)' },
    archived: false,
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
  {
    id: 'list-2',
    name: 'Párty Oslava',
    owner: { id: 'user-2', name: 'Jana (Vlastník)' },
    archived: false,
    members: [{ id: 'user-1', name: 'Petr' }],
    items: [
      { id: 'item-4', name: 'Brambůrky', solved: false },
      { id: 'item-5', name: 'Pivo', solved: false },
    ],
  },
  {
    id: 'list-3',
    name: 'Grilovačka',
    owner: { id: 'user-1', name: 'Petr (Vlastník)' },
    archived: false,
    members: [{ id: 'user-3', name: 'Karel' }],
    items: [
      { id: 'item-6', name: 'Maso', solved: false },
      { id: 'item-7', name: 'Pivo', solved: false },
    ],
  },
  {
    id: 'list-4',
    name: 'Starý nákup',
    owner: { id: 'user-1', name: 'Petr (Vlastník)' },
    archived: true,
    members: [],
    items: [{ id: 'item-9', name: 'Rohlíky', solved: true }],
  },
];