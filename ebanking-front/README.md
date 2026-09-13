# Ebanking — Front Angular

Front-office Angular (v18, composants standalone) pour le backend Spring Boot `ebanking-backend`.

## Démarrage

```bash
npm install
npm start
```

L'application est servie sur `http://localhost:4200`.

## Connexion à l'API

L'URL de l'API est définie dans `src/environments/environment.ts` :

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8085'
};
```

Assurez-vous que le backend Spring Boot tourne sur ce port (`server.port=8085` dans `application.properties`) avant de lancer le front.

## Pages

- `/customers` — registre des clients (recherche, création, accès à la fiche client)
- `/customers/:id` — fiche client : coordonnées, comptes ouverts, édition, suppression
- `/customers/:id/new-account` — ouverture d'un compte courant ou épargne
- `/accounts` — registre de tous les comptes
- `/accounts/:id` — relevé de compte : solde, crédit / débit / virement, historique paginé

## Endpoints backend attendus

En plus des routes déjà exposées par le contrôleur d'origine, le front utilise :

- `POST /accounts/current` `{ initialBalance, rate, customerId }`
- `POST /accounts/saving` `{ initialBalance, rate, customerId }`
- `POST /accounts/credit` `{ accountId, amount, description }`
- `POST /accounts/debit` `{ accountId, amount, description }`
- `POST /accounts/transfer` `{ accountIdSource, accountIdDestination, amount }`

Ces routes ont été ajoutées à `BanckAccountRestController` (le service `BAnkAccountService` les exposait déjà côté métier, elles n'étaient simplement pas branchées au contrôleur REST).
