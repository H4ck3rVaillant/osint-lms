# Image minimale et maintenue
FROM node:20-alpine

# Création d'un utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Dossier de travail
WORKDIR /app

# Copie uniquement des dépendances en premier (cache Docker)
COPY package*.json ./

# Installation en mode production uniquement
RUN npm install --omit=dev && npm cache clean --force

# Copie du reste du projet
COPY . .

# Permissions sécurisées
RUN chown -R appuser:appgroup /app

# Passage à l'utilisateur non-root
USER appuser

# Port exposé
EXPOSE 3000

# Lancement sécurisé
CMD ["node", "server.js"]
