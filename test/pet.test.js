const request = require('supertest');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const app = require('../app');
const expect = chai.expect;

chai.use(chaiAsPromised);

const mongoose = require('mongoose');

const petId = mongoose.Types.ObjectId();
const pet = {
  _id: petId,
  name: 'cat',
  age: 1,
  colour: 'white',
};

describe('functional - pet', () => {


  it('should fail to create a pet without name', async () => {
    const res = await request(app).post('/pets').send({
      _id: petId,
      age: '1',
      colour: 'white',
    });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('"name" is required');
  });


  it('should create a pet', async () => {
    
    const res = await request(app).post('/pets').send(pet);
    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal(pet.name);
    expect(res.body.age).to.equal(pet.age);
    expect(res.body.colour).to.equal(pet.colour);
  });


  it('should fetch all pets', async () => {
    const res = await request(app).get('/pets').send();
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an.instanceof(Array);
  });


  it('should fail to fetch pet details without valid id', async () => {
    const petId = 'test';
    const res = await request(app).get('/pets/'+petId).send();
    expect(res.status).to.equal(500);
    expect(res.body.message).to.equal('No pets found');
  });


  it('should fetch pet by valid id', async () => {
    const res = await request(app).get('/pets/'+petId).send();
    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal(pet.name);
    expect(res.body.age).to.equal(pet.age);
    expect(res.body.colour).to.equal(pet.colour);
  });


  it('should fail to delete pet by wrong id', async () => {
    const id = 'test';
    const res = await request(app).delete('/pets/'+id).send();
    expect(res.status).to.equal(500);
    expect(res.body.message).to.equal('Not a valid pet');
  });


  it('should delete pet by valid id', async () => {
    const res = await request(app).delete('/pets/'+petId).send();
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Pet Succesfully Deleted');
  });

  
});