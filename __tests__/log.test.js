const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Log = require('../lib/models/log');
const Recipe = require('../lib/models/recipe');

describe('log tests', () => {

  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a log', async () => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const res = await request(app)
      .post('/api/v1/logs')
      .send({
        recipeId: recipe.id,
        dateOfEvent: 'Today',
        notes: 'Note for create logs',
        rating: 5
      });

    expect(res.body).toEqual({
      id: '1',
      recipeId: recipe.id,
      dateOfEvent: 'Today',
      notes: 'Note for create logs',
      rating: 5
    });
  });

  it('get all logs', async () => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });
    await Promise.all([{
      recipeId: recipe.id,
      dateOfEvent: 'TomorrowAint',
      notes: 'Note for get all logs 1',
      rating: 5
    }].map(log => Log.insert(log)));

    const res = await request(app)
      .get('/api/v1/logs');

    expect(res.body).toEqual([{
      id: '1',
      recipeId: recipe.id,
      dateOfEvent: 'TomorrowAint',
      notes: 'Note for get all logs 1',
      rating: 5
    }]);
  });

  it('Get log by using get id', async () => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const log = await Log.insert({
      recipeId: recipe.id,
      dateOfEvent: 'Tomorrowisnt',
      notes: 'Note for get logs by id',
      rating: 9
    });

    const res = await request(app)
      .get(`/api/v1/logs/${log.id}`);

    expect(res.body).toEqual(log);
  });
});
