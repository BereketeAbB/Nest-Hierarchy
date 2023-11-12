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
*Add User*   
    **POST http://localhost/api/user**    
*Get All Users*  
    **GET http://localhost/api/user/**  
*Get User*  
    **GET http://localhost/api/user/:id**  
*Remove User*   
    **POST http://localhost/api/user/remove-user/:userId**   



*Get Children*  
    **GET http://localhost/api/user/role/:id/child**  

Get All Children *Children and Children's Children*   
    **GET http://localhost/api/user/role/all-children/:parentId**   

*Get Parent*   
    **GET http://localhost/api/user/role/:id/parent**   

*Add Parent*   
    **POST http://localhost/api/user/role/parent/:userId/:parentId** 

*Add Child*   
    **POST http://localhost/api/user/role/child/:userId/:parentId**   

*Update Role*   
    **POST http://localhost/api/user/role/update-role/:userId**  

*Remove Position *   
    **POST http://localhost/api/user/role/remove-position/:userId**   
