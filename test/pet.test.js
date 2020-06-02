const request = require('supertest');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const app = require('../app');
const expect = chai.expect;

chai.use(chaiAsPromised);

const pet = {
  name: 'cat',
  age: 1,
  colour: 'white',
};

describe('functional - pet', () => {
  
  it('should fail to create a pet without name', async () => {
    const pet = {
      age: 1,
      colour: 'white',
    };
    const res = await request(app).post('/pets').send(pet);
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('"name" is required');
  });

  it('should fail to create a pet without age', async () => {
    const pet = {
      name: 'cat',
      colour: 'white',
    };
    const res = await request(app).post('/pets').send(pet);
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('"age" is required');
  });

  it('should fail to create a pet without colour', async () => {
    const pet = {
      name: 'cat',
      age: 1,
    };
    const res = await request(app).post('/pets').send(pet);
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('"colour" is required');
  });

  it('Should fail to create a pet with string type of age', async () => {
    const res = await request(app).post('/pets').send({
      name: "cat",
      age: "1",
      colour: 'white',
    });
    expect(res.status).to.equal(200);
  });


  it('should create a pet', async () => {    
    const res = await request(app).post('/pets').send(pet);
    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal(pet.name);
    expect(res.body.age).to.equal(pet.age);
    expect(res.body.colour).to.equal(pet.colour);
  });


  it('should fetch all pets', async () => {
    const pet = {
      name: 'mew',
      age: 2,
      colour: 'golden',
    };
    // Create the pet
    const result = await request(app).post('/pets').send(pet);
    //check if it is success
    expect(result.status).to.equal(200);
    expect(result.body.name).to.equal(pet.name);

    // Fetch all pets
    const res = await request(app).get('/pets').send();
    expect(res.status).to.equal(200);
    expect(res.body.length).to.greaterThan(0);
  });


  it('should fail to fetch pet details without valid id', async () => {
    
    const pet = {
      name: 'Max',
      age: 9,
      colour: 'Black',
    };
    // Create the pet
    const result = await request(app).post('/pets').send(pet);
    //check if it is success
    expect(result.status).to.equal(200);
    expect(result.body.name).to.equal(pet.name);

    // Fetch by id
    const petId = 'test';
    const res = await request(app).get('/pets/'+petId).send();
    expect(res.status).to.equal(500);
    expect(res.body.message).to.equal('No pets found');
  });


  it('should fetch pet by valid id', async () => {

    const pet = {
      name: 'Max',
      age: 9,
      colour: 'Black',
    };
    // Create the pet
    const result = await request(app).post('/pets').send(pet);
    //check if it is success
    expect(result.status).to.equal(200);
    expect(result.body.name).to.equal(pet.name);

    // Fetch by id
    const petId = result.body._id;
    const res = await request(app).get('/pets/'+petId).send();
    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal(pet.name);
    expect(res.body.age).to.equal(pet.age);
    expect(res.body.colour).to.equal(pet.colour);
  });
  

  it('should fail to delete pet by wrong id', async () => {
    const pet = {
      name: 'Max',
      age: 9,
      colour: 'Black',
    };
    // Create the pet
    const result = await request(app).post('/pets').send(pet);
    //check if it is success
    expect(result.status).to.equal(200);
    expect(result.body.name).to.equal(pet.name);

    // Fetch by wrong id
    const id = 'test';
    const res = await request(app).delete('/pets/'+id).send();
    expect(res.status).to.equal(500);
    expect(res.body.message).to.equal('Not a valid pet');
  });


  it('should delete pet by valid id', async () => {
    const pet = {
      name: 'Max',
      age: 9,
      colour: 'Black',
    };
    // Create the pet
    const result = await request(app).post('/pets').send(pet);
    //check if it is success
    expect(result.status).to.equal(200);
    expect(result.body.name).to.equal(pet.name);

    // Fetch by wrong id
    const petId = result.body._id;
    const res = await request(app).delete('/pets/'+petId).send();
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Pet Succesfully Deleted');
  });
  
});