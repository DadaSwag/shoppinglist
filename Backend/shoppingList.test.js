const request = require('supertest');
const app = require('./index');

describe('Shopping List API Tests', () => {

  describe('POST /shoppingList/create', () => {
    it('should create a new list successfully', async () => {
      const res = await request(app)
        .post('/shoppingList/create')
        .send({ name: 'Můj nákupní seznam' });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.dtoIn.name).toBe('Můj nákupní seznam');
      expect(res.body.uuAppErrorMap).toEqual({});
    });

    it('should return validation error when name is missing', async () => {
      const res = await request(app)
        .post('/shoppingList/create')
        .send({});
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.uuAppErrorMap).toHaveProperty('shoppinglist-main/invalidDtoIn');
    });
  });

  describe('POST /shoppingList/get', () => {
    it('should get a list successfully', async () => {
      const res = await request(app)
        .post('/shoppingList/get')
        .send({ id: '12345' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.uuAppErrorMap).toEqual({});
    });

    it('should return error when ID is missing', async () => {
      const res = await request(app)
        .post('/shoppingList/get')
        .send({});

      expect(res.statusCode).toEqual(200);
      expect(res.body.uuAppErrorMap).toHaveProperty('shoppinglist-main/invalidDtoIn');
    });
  });

  describe('POST /shoppingList/list', () => {
    it('should return list of items', async () => {
      const res = await request(app)
        .post('/shoppingList/list')
        .send({ showArchived: true });

      expect(res.statusCode).toEqual(200);
      expect(res.body.uuAppErrorMap).toEqual({});
    });

    it('should return error when input type is wrong', async () => {
      const res = await request(app)
        .post('/shoppingList/list')
        .send({ showArchived: "not-a-boolean" });

      expect(res.statusCode).toEqual(200);
      expect(res.body.uuAppErrorMap).toHaveProperty('shoppinglist-main/invalidDtoIn');
    });
  });

  describe('POST /shoppingList/update', () => {
    it('should update the list', async () => {
      const res = await request(app)
        .post('/shoppingList/update')
        .send({ id: '12345', name: 'Nové jméno' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.uuAppErrorMap).toEqual({});
    });

    it('should fail if name is missing', async () => {
      const res = await request(app)
        .post('/shoppingList/update')
        .send({ id: '12345' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.uuAppErrorMap).toHaveProperty('shoppinglist-main/invalidDtoIn');
    });
  });

  describe('POST /shoppingList/delete', () => {
    it('should delete the list', async () => {
      const res = await request(app)
        .post('/shoppingList/delete')
        .send({ id: '12345' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.uuAppErrorMap).toEqual({});
    });

    it('should fail if ID is missing', async () => {
      const res = await request(app)
        .post('/shoppingList/delete')
        .send({});

      expect(res.statusCode).toEqual(200);
      expect(res.body.uuAppErrorMap).toHaveProperty('shoppinglist-main/invalidDtoIn');
    });
  });

});