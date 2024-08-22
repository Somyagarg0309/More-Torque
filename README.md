# More-Torque

PostMan Requests :-PORT 5000

1. GET /vehicles/decode/
    http://localhost:5000/vehicles/decode/1HGCM82633A123456

2.POST /vehicles
  http://localhost:5000/vehicles

3. GET/vehicles/:vin
   http://localhost:5000/vehicles/1HGCM82633890A1234
   
4.POST /Orgs
  http://localhost:5000/orgs
  
5.GET /orgs
  http://localhost:5000/orgs

6. /orgs/:id
   http://localhost:5000/orgs/{id} :- Add id here

<---SCHEMAS--->
1. Organization

_id: The unique identifier for each organization.
name: The name of the organization (required).
account: Account details of the organization.
website: Website URL of the organization.
fuelReimbursementPolicy: Policy related to fuel reimbursement (defaults to '1000').
speedLimitPolicy: Policy related to speed limits.
parent: A reference to another Org document, indicating a parent organization (optional)

2. Vehicle Schema

_id: The unique identifier for each vehicle.
vin: Vehicle Identification Number, which must be unique and is required.
org: A reference to an Org document indicating which organization the vehicle belongs to (required).
manufacturer: Manufacturer of the vehicle.
model: Model of the vehicle.
year: Year of manufacture of the vehicle.
