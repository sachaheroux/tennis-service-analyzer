# 🚀 Guide de Déploiement - Tennis Service Analyzer

## Architecture
- **Frontend**: React + Vite + TypeScript → Déployé sur **Vercel**
- **Backend**: Express + TypeScript → Déployé sur **Render**

## Étapes de Déploiement

### 1. Créer le Repository GitHub

1. Allez sur [GitHub.com](https://github.com) et connectez-vous
2. Cliquez sur **"New repository"**
3. Nommez votre repository : `tennis-service-analyzer`
4. Laissez-le **public**
5. **Ne cochez pas** "Initialize with README"
6. Cliquez sur **"Create repository"**

### 2. Pousser le Code sur GitHub

```bash
# Remplacez YOUR_USERNAME par votre nom d'utilisateur GitHub
git remote set-url origin https://github.com/YOUR_USERNAME/tennis-service-analyzer.git
git branch -M main
git push -u origin main
```

### 3. Déployer le Backend sur Render

1. Allez sur [render.com](https://render.com) et créez un compte
2. Cliquez sur **"New +"** → **"Web Service"**
3. Connectez votre repository GitHub
4. **Configuration du service :**
   - **Name:** `tennis-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (pour commencer)

5. **Variables d'environnement :**
   ```
   NODE_ENV=production
   PORT=10000
   ```

6. Cliquez sur **"Create Web Service"**
7. **Notez l'URL** de votre backend (ex: `https://tennis-backend-abc123.onrender.com`)

### 4. Déployer le Frontend sur Vercel

1. Allez sur [vercel.com](https://vercel.com) et connectez-vous avec GitHub
2. Cliquez sur **"New Project"**
3. Sélectionnez votre repository `tennis-service-analyzer`
4. **Configuration du projet :**
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. **Variables d'environnement :**
   ```
   VITE_API_URL=https://tennis-backend-XXXX.onrender.com
   ```
   ⚠️ **Remplacez par l'URL réelle de votre backend Render**

6. Cliquez sur **"Deploy"**

### 5. Test et Vérification

1. **Backend** : Testez `https://votre-backend.onrender.com/api/health`
2. **Frontend** : Votre app sera disponible sur `https://votre-app.vercel.app`

## URLs Finales

Une fois déployé, vous aurez :
- **Frontend** : `https://tennis-service-analyzer-xxx.vercel.app`
- **Backend API** : `https://tennis-backend-xxx.onrender.com`

## Fonctionnalités

✅ Interface interactive de terrain de tennis  
✅ Analyse en temps réel des services  
✅ Calcul de précision  
✅ Statistiques détaillées  
✅ API REST complète  
✅ Responsive design  

## Commandes Utiles

```bash
# Développement local
npm run dev

# Build frontend
cd frontend && npm run build

# Build backend
cd backend && npm run build

# Test backend
cd backend && npm start
```

## Support

Si vous rencontrez des problèmes :
1. Vérifiez que l'URL du backend est correcte dans les variables d'environnement Vercel
2. Consultez les logs sur Render et Vercel
3. Assurez-vous que les deux services sont bien déployés

## Mise à Jour

Pour mettre à jour votre application :
```bash
git add .
git commit -m "Update: description des changements"
git push origin main
```

Les déploiements se feront automatiquement sur Vercel et Render ! 🎾 