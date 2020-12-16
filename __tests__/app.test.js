const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/recipe');

describe('recipe-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        ingredients: [
          { amount: '123' },
          { measurements: 'Gallons' },
          { name: 'flour' }
        ],
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          ingredients: [
            { amount: '123' },
            { measurements: 'Gallons' },
            { name: 'flour' }
          ],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });

  it('gets all recipes', async () => {
    const recipes = await Promise.all([
      {
        name: 'cookies', directions: [], ingredients: [
          { amount: '555' },
          { measurements: 'Pints' },
          { name: 'Salt' }
        ],
      },
      {
        name: 'cake', directions: [], ingredients: [
          { amount: '999' },
          { measurements: 'oz' },
          { name: 'water' }
        ],
      },
      {
        name: 'pie', directions: [], ingredients: [
          { amount: '777' },
          { measurements: 'grams' },
          { name: 'meat' }
        ],
      }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  it('gets by id for recipes', async () => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      ingredients: [
        { amount: '100000' },
        { measurements: 'Tons' },
        { name: 'gummy bears' }
      ],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const res = await request(app)
      .get(`/api/v1/recipes/${recipe.id}`);
    expect(res.body).toEqual({
      id: expect.any(String),
      name: 'cookies',
      ingredients: [
        { amount: '100000' },
        { measurements: 'Tons' },
        { name: 'gummy bears' }
      ],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });
  });

  it('updates a recipe by id', async () => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      ingredients: [
        { amount: '4' },
        { measurements: 'suns' },
        { name: 'earths' }
      ],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    return request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        name: 'good cookies',
        ingredients: [
          { amount: '864123451616112312' },
          { measurements: 'freedom units' },
          { name: 'football fields' }
        ],
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: '1',
          name: 'good cookies',
          ingredients: [
            { amount: '864123451616112312' },
            { measurements: 'freedom units' },
            { name: 'football fields' }
          ],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });

  it('delete a recipe by id', async () => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      ingredients: [
        { amount: '1' },
        { measurements: 'black hole sized' },
        { name: 'duck' }
      ],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const res = await request(app)
      .delete(`/api/v1/recipes/${recipe.id}`);

    expect(res.body).toEqual({
      id: expect.any(String),
      name: 'cookies',
      ingredients: [
        { amount: '1' },
        { measurements: 'black hole sized' },
        { name: 'duck' }
      ],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });
  });
});
