import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "app_title": "Shopping List App",
      "shopping_lists": "Shopping Lists",
      "items_overview": "Items Overview",
      "solved": "Solved",
      "unsolved": "Unsolved",
      "toggle_theme": "Switch Theme",
      "switch_lang": "CZ",
      "view_detail": "View Detail",
      "back": "Back to List",
      "total_items": "Total Items",
      "create_new": "Create New List",
      "delete": "Delete",
      "item_name": "Item Name",
      "add_item": "Add Item"
    }
  },
  cs: {
    translation: {
      "app_title": "Nákupní Seznamy",
      "shopping_lists": "Moje Seznamy",
      "items_overview": "Přehled Položek",
      "solved": "Vyřešené",
      "unsolved": "Nevyřešené",
      "toggle_theme": "Přepnout Téma",
      "switch_lang": "EN",
      "view_detail": "Zobrazit Detail",
      "back": "Zpět na přehled",
      "total_items": "Celkem položek",
      "create_new": "Vytvořit nový seznam",
      "delete": "Smazat",
      "item_name": "Název položky",
      "add_item": "Přidat položku"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "cs",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;