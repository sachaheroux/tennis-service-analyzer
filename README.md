# 🎾 Tennis Service Analyzer

Une application web complète pour analyser les services au tennis avec une interface interactive et une API backend.

## 🚀 Fonctionnalités

- **Interface interactive** : Cliquez sur le terrain de tennis pour placer la balle
- **Analyse en temps réel** : Détection automatique des zones de service
- **Calcul de précision** : Score de précision basé sur la position
- **Statistiques** : Suivi des performances et distribution des zones
- **API REST** : Backend pour l'analyse et les statistiques
- **Design responsive** : Interface adaptée à tous les écrans

## 📁 Structure du projet

```
tennis-service-analyzer/
├── frontend/                 # Application React avec Vite
│   ├── src/
│   │   ├── App.tsx          # Composant principal
│   │   ├── App.css          # Styles du terrain
│   │   ├── main.tsx         # Point d'entrée
│   │   └── index.css        # Styles globaux
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # API Express avec TypeScript
│   ├── src/
│   │   ├── server.ts        # Serveur principal
│   │   ├── routes/
│   │   │   └── serviceRoutes.ts
│   │   └── services/
│   │       └── ServiceAnalyzer.ts
│   ├── package.json
│   └── tsconfig.json
├── package.json             # Scripts globaux
└── README.md
```

## 🛠️ Installation

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation complète

1. **Cloner le projet**
   ```bash
   git clone <votre-repo>
   cd tennis-service-analyzer
   ```

2. **Installer toutes les dépendances**
   ```bash
   npm run install:all
   ```

### Installation manuelle

Si la commande automatique ne fonctionne pas :

1. **Installer les dépendances du projet principal**
   ```bash
   npm install
   ```

2. **Installer les dépendances du frontend**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Installer les dépendances du backend**
   ```bash
   cd backend
   npm install
   cd ..
   ```

## 🚀 Démarrage

### Démarrage complet (recommandé)
```bash
npm run dev
```
Cette commande lance simultanément :
- Frontend sur http://localhost:5173
- Backend sur http://localhost:3001

### Démarrage séparé

**Frontend uniquement :**
```bash
npm run dev:frontend
```

**Backend uniquement :**
```bash
npm run dev:backend
```

## 🎮 Utilisation

1. **Ouvrez votre navigateur** sur http://localhost:5173
2. **Cliquez sur le terrain** pour placer la balle
3. **Analysez le résultat** :
   - ✅ Service valide (dans la zone)
   - ❌ Service faute (hors zone)
   - Score de précision
   - Zone touchée (T ou large)
4. **Utilisez le bouton "Effacer"** pour recommencer

## 🔧 API Endpoints

### Analyser un service
```http
POST /api/service/analyze
Content-Type: application/json

{
  "x": 300,
  "y": 150,
  "courtWidth": 600,
  "courtHeight": 400
}
```

### Obtenir les statistiques
```http
GET /api/service/stats
```

### Réinitialiser les statistiques
```http
DELETE /api/service/stats
```

### Health check
```http
GET /api/health
```

## 🎨 Zones de service

Le terrain est divisé en zones :
- **Service T (haut)** : Zone proche du filet
- **Service large (bas)** : Zone proche de la ligne de fond
- **Hors service** : En dehors des zones valides

## 📊 Calcul de précision

La précision est calculée selon :
- **Distance de la zone optimale** (50% du score)
- **Distance horizontale du centre** (20% du score)
- **Type de service** (T vs large)

## 🛠️ Développement

### Scripts disponibles

**Projet principal :**
- `npm run dev` - Lance frontend + backend
- `npm run dev:frontend` - Lance uniquement le frontend
- `npm run dev:backend` - Lance uniquement le backend
- `npm run install:all` - Installe toutes les dépendances
- `npm run build` - Build le frontend

**Frontend :**
- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Aperçu du build

**Backend :**
- `npm run dev` - Serveur de développement avec nodemon
- `npm run build` - Compilation TypeScript
- `npm run start` - Démarrage en production

## 🔧 Configuration

### Frontend (Vite)
- Port par défaut : 5173
- Proxy API configuré vers le backend
- Hot reload activé

### Backend (Express)
- Port par défaut : 3001
- CORS configuré pour le frontend
- Logging avec Morgan
- Sécurité avec Helmet

## 🚀 Déploiement

### Frontend
```bash
cd frontend
npm run build
# Déployer le dossier dist/
```

### Backend
```bash
cd backend
npm run build
npm start
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📝 License

Ce projet est sous licence MIT.

## 🐛 Problèmes connus

- Les erreurs TypeScript dans l'éditeur disparaîtront après l'installation des dépendances
- Assurez-vous que les ports 3001 et 5173 sont libres

## 📞 Support

Pour toute question ou problème, ouvrez une issue sur GitHub. 