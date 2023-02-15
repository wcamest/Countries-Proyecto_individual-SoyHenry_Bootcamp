/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Country, conn } = require('../../src/db.js');

const agent = session(app);
const Montserrat = {
  name: 'Montserrat',
  id: "MSR",
  flag_icon: "https://flagcdn.com/ms.svg",
  continent: "North America",
  capital: "Plymouth",
  sub_region: "Caribbean",
  area: "102",
  population: "4922"
};

describe('Country routes', () => {

  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));

  beforeEach(() => Country.sync({ force: true })
    .then(() => {
      Country.create(Montserrat)
    }
    ));

  describe('GET all countries', () => {
    it('should get 200', () => {
      agent.get('/countries').expect(200)
    }
    );
  });

  describe('GET country by name', () => {
    it('should get 200', () => {
      agent.get('/countries?name=Montserrat').expect(200)
    });

    it('should get 404', () => {
      agent.get('/countries?name=Colombia').expect(404)
    })
  });

  describe('GET country by id', () => {
    it('should get 200', () => {
      agent.get('/countries/MSR').expect(200)
    });

    it('should get 404', () => {
      agent.get('/countries/COL').expect(404)
    })
  });
});
