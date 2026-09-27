# MalCom Vitrine — Site Officiel & Vitrine Commerciale

Site vitrine haute performance et à fort taux de conversion pour le logiciel de gestion commerciale et de caisse **MalCom** (développé et déployé par **AMD-Service**).

---

## 🎯 Objectifs du Site Vitrine
1. **Conversion Immédiate** : Inciter tout commerçant (quincaillerie, supérette, grossiste, boutique de mode, pièces auto/moto) à appeler ou envoyer un message WhatsApp direct pour réserver une installation immédiate sur site ou à distance.
2. **Téléchargement Démo** : Permettre le téléchargement direct de la version d'essai (Windows & macOS).
3. **Mise en Valeur Authentique** : Intégration des véritables captures d'écran des différents modules du système (Caisse POS, Stocks, Multi-boutiques, Suivi des crédits, Dépenses et Factures normalisées UEMOA).
4. **Zéro Sticker, Zéro Dégradé Criard** : Respect strict du design system épuré et corporate de MalCom (tokens Inter, Indigo `#4f46e5`, Slate sombre `#0b0f19`, fond clean `#f8f9fc`).

---

## 📂 Structure du Projet
```text
m-vitrine/
├── assets/
│   ├── css/
│   │   └── style.css            # Design System officiel MalCom (responsive, variables, typographie)
│   ├── js/
│   │   └── main.js              # Logique interactive (onglets, simulateur de rentabilité, modals, lightbox, FAQ)
│   └── img/
│       ├── app-icon.png         # Icône officielle de l'application MalCom
│       ├── logo.png / logo2.png # Logos officiels
│       ├── capture-pos.png       # Écran de caisse et saisie transactionnelle
│       ├── capture-stock.png     # Écran de suivi des stocks et valorisation FCFA
│       ├── capture-boutiques.png # Écran de pilotage du réseau multi-boutiques
│       ├── capture-credit.png    # Écran de gestion des ventes à crédit et paiements
│       ├── capture-dashboard.png # Écran de suivi des dépenses et graphiques financiers
│       ├── capture-facture.png   # Facture commerciale normalisée A4 UEMOA
│       └── icon.ico             # Favicon
├── favicon.ico
├── index.html                   # Page d'atterrissage complète et optimisée SEO
└── README.md
```

---

## 🚀 Comment Visualiser Localement

Le site fonctionne directement sans dépendance lourde :

```bash
# Avec Python :
python3 -m http.server 8085 --directory .

# Ou avec npx :
npx serve .
```

Puis ouvrez votre navigateur à l'adresse : **`http://localhost:8085`**

---

## 📞 Informations de Contact Intégrées
- **Entreprise** : AMD-Service
- **Zone** : Bamako, Mali (Zone UEMOA - FCFA)
- **Téléphone / WhatsApp** : `+223 82 20 07 66`
- **Lien WhatsApp direct** : `https://wa.me/22382200766`
