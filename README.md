## Description
A test assignment from **Perago Information Systems**.
A medium level organization management structure with different level of positions/roles Hierarchy. At the top of the Hierarch there is CEO and every position below a given hierarchy will answer/Report to the immediate position in the organization's position structure hierarchy

More detail about the API is the [Question](https://github.com/gitdeme/perago-nestjs-api)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Routes
Get All Users
    **GET /api/**
Get User
    **GET /api/:id**
Get Children
    **GET /api/:id/child**
Get All Children *Children and Children's Children*
    **GET /api/all-children/:parentId**
Get Parent
    **GET /api/:id/parent**

Add Parent
    **POST /api/parent/:userId/:parentId**
Add Child
    **POST /api/child/:userId/:parentId**

Update Role
    **POST /api/update-role/:userId**
Remove Position
    **POST /api/remove-position/:userId**
Remove User
    **POST /remove-user/:userId**



