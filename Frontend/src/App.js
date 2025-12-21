import React, { useState, useEffect } from "react";
import "./App.css";
import "./i18n";
import { useTranslation } from "react-i18next";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const initialData = [
  { id: 1, name: "Víkendový nákup", items: [
      { id: "i1", name: "Mléko", solved: true },
      { id: "i2", name: "Chleba", solved: false },
      { id: "i3", name: "Máslo", solved: false }
  ]},
  { id: 2, name: "Oslava narozenin", items: [
      { id: "i4", name: "Dort", solved: true },
      { id: "i5", name: "Svíčky", solved: true },
      { id: "i6", name: "Balónky", solved: true },
      { id: "i7", name: "Cola", solved: false }
  ]},
  { id: 3, name: "Drogerie", items: [
      { id: "i8", name: "Šampon", solved: false },
      { id: "i9", name: "Mýdlo", solved: false }
  ]}
];

const COLORS = ["#0088FE", "#FF8042"];

function App() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState("light");
  const [view, setView] = useState("list");
  const [selectedList, setSelectedList] = useState(null);
  const [lists, setLists] = useState(initialData);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-mode" : "";
  }, [theme]);

  const toggleLanguage = () => {
    const newLang = i18n.language === "cs" ? "en" : "cs";
    i18n.changeLanguage(newLang);
  };

  const getOverviewChartData = () => {
    return lists.map(list => ({
      name: list.name,
      total: list.items.length,
      solved: list.items.filter(i => i.solved).length
    }));
  };

  const getDetailChartData = (list) => {
    const solvedCount = list.items.filter(i => i.solved).length;
    const unsolvedCount = list.items.length - solvedCount;
    return [
      { name: t('solved'), value: solvedCount },
      { name: t('unsolved'), value: unsolvedCount }
    ];
  };

  if (view === "detail" && selectedList) {
    const pieData = getDetailChartData(selectedList);

    return (
      <div className="container">
        <header>
          <h1>{selectedList.name}</h1>
          <div className="controls">
            <button onClick={() => setView("list")}>{t('back')}</button>
          </div>
        </header>

        <div className="card">
          <h3>{t('items_overview')}</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="list-items" style={{marginTop: '20px'}}>
            {selectedList.items.map(item => (
                <div key={item.id} className="card" style={{marginBottom: '10px', display:'flex', justifyContent:'space-between'}}>
                    <span>{item.name}</span>
                    <span>{item.solved ? "✅" : "❌"}</span>
                </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <h1>{t('app_title')}</h1>
        <div className="controls">
          <button onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
          <button onClick={toggleLanguage}>
            {t('switch_lang')}
          </button>
        </div>
      </header>

      <div className="card" style={{marginBottom: '30px'}}>
        <h3>{t('shopping_lists')} - {t('total_items')}</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getOverviewChartData()}>
              <XAxis dataKey="name" stroke={theme === 'dark' ? '#fff' : '#000'} />
              <YAxis stroke={theme === 'dark' ? '#fff' : '#000'}/>
              <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#333' : '#fff' }}/>
              <Legend />
              <Bar dataKey="total" fill="#8884d8" name={t('total_items')} />
              <Bar dataKey="solved" fill="#82ca9d" name={t('solved')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="list-grid">
        {lists.map((list) => (
          <div key={list.id} className="card">
            <h3>{list.name}</h3>
            <p>{t('total_items')}: {list.items.length}</p>
            <button onClick={() => { setSelectedList(list); setView("detail"); }}>
              {t('view_detail')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;