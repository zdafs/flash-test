# Getting Started

Install node, yarn, docker and docker-compose.

Run docker-compose:

```shell
docker-compose up
```

It will run a local mongodb on port 27017 and populate the collection 'companies' on the database 'flash'

Use your favorite GUI client to check it out, like Robo3T, NoSQLBooster or MongoDB Compass.

Install the dependencies and run the server:

```shell
yarn
yarn server
```

The server will start on `http://localhost:3000`

Open another terminal and run the client:

```shell
yarn client
```

The client will start on `http://localhost:1234`

# Exercises

## Exercise 01

This exercise consists on finding 8 bugs spread across the client and the server. The following potential bugs were found:

- Wrong port to access api - .env - line 2
- Missing React import - client/app.jsx - line 1
- Missing `"app"` id on app index - client/index.html - line 8
- Inexistent employees field on client query - client/graphql/queries.js - line 12
- Server never called on companies query - client/pages/companies/companies.page.jsx - line 47
- Misspelled `onCLick` property - client/pages/companies/companies.page.jsx - line 75
- Wrong regex on cnpj field validator - server/company/company.model.js - line 17
- Required `chosenBenefits` field was not required on DB model - server/company/company.model.js - line 26
- Query schema permits array with null values - server/graphql/schema.js - line 26
