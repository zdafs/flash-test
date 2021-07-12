# Getting Started

Install node, yarn, docker and docker-compose.

Run docker-compose:

```shell
docker-compose up
```

It will run a local mongodb on port 27017 and populate the collection 'companies' on the database 'flash'

Use your favorite GUI client to check it out, like Robo3T, NoSQLBooster or MongoDB Compass.

Install [nvm](https://github.com/nvm-sh/nvm) and run `nvm use` to use the same node version used during development.

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

These bugs and its fixes can be found on [commit 90624a5c59cea9086dbce6ee826afa0598b18efb](https://github.com/zdafs/flash-test/commit/90624a5c59cea9086dbce6ee826afa0598b18efb).

Another thing worth pointing out is that, while running the server for the first time, the `apollo-server` named imports were breaking (fix [here](https://github.com/zdafs/flash-test/commit/f20a6115c9611c5a9861caa5f039a4f45560a688)). It looks like the problem is related with the `package.json` not having the `"type": "module"` key on this version of the lib.

Finally one change was made to the DB init script in order for the `cnpj` field to conform with the model regex (change can be found [here](https://github.com/zdafs/flash-test/commit/e6db540ec53cce298bf345ec3d88b5fed00860df)).

## Exercise 02

This exercise consists in creating a new employee entity that relates to the existing company entity. This was done by creating a nem mongoose model `employee` and relating it to `company`. Beyond that, in order to allow user interaction with those entities, graphql schemas were created and a employee creation screen was implemented.

To navigate through the pages there is a menu on the top left corner of the application and to check all the employees related to a company you can click the company row on the companies page.

## Extra

As a bonus code split by routes was implemented by following [parcels own instructions](https://parceljs.org/code_splitting.html).

# Tests

Tests were made using [jest](https://jestjs.io/pt-BR/). The integration with the DB was made using [mongodb-memory-server](https://www.npmjs.com/package/mongodb-memory-server). To run the tests, issue the command `yarn test`.
