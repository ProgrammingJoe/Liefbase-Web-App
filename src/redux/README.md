# Front-end data storage
## Drawer
   * Controls which drawer is displayed (Search, Map info, entity info) only one drawer is visible at a time (hope this doesn't bite us too soon)
## Modal
   * Controls which modal is displayed (signup, register, etc). It is architected such that only one modal is visible at a time (Hopefully this doesn't bite us too soon)
## Organization
   * Stores the list of known organizations. Currently only used for the drop down on registration but in the future could be for attribution of entities.
## Registration
   * Holds the contents of the registration fields and sends the registration request.
## User
   * Holds the information of the logged in user (email, organization they belong to etc)
## Maps
   * List of maps accessible to the user
```javascript
[
  {
    mapId,
    mapName,
    ...
  },...
]   
```
## Entities
   * List of features that can be shown on the map
```javascript
[
  {
    id,
    name,
    location: something like a geoJSON feature,
    organization,
    mapId,
    fetchedAt,
    ...other details
  },...
]
```
