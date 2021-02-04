(function () {
  'use strict';
  var assert = require("assert");
  const mongoose = require('mongoose');
  var NotesModels = require('../models/notes.model');
  const Notes = NotesModels.Notes;
  const chai = require('chai');
  const chaiHttp = require('chai-http');
  const app = require('../app');
  const should = chai.should();
  chai.use(chaiHttp);

  //Get All Notes UnitTest Case
  //test Get/getAllNotes/ route
  describe(' Notes', () => {
      describe('/getAllNotes/', () => {
          it('it should GET all the Notes', (done) => {
              chai.request(app)
                  .get('/getallNotes/')
                  .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      done();
                  });
          });
      });
      // post Notes UnitTest Case 
      //test post/postNotes/ route
      describe('/postNotes/', () => {
          it('it  should POST a Notes', (done) => {
              let notes = ({
                  title: "notes",
                  description: "tdg",
                 
              });
              chai.request(app)
                  .post('/postNotes/')
                  .send(notes)
                  .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object')
                      done();

                  });
              // Test the /GET/:id route
              //test Notes get by ID
              describe('/allNotes/:id Notes', () => {
                  it('it should GET a contact by the given id', (done) => {
                      let notes = new Notes({
                          title: "notes",
                          description: "tdg",
                        
      
                      });
                      notes.save((err, notes) => {
                          chai.request(app)
                              .get('/allNotes/' + notes._id)
                              .send(notes)
                              .end((err, res) => {
                                  res.should.have.status(200);
                                  res.body.should.be.a('object');
                                  done();
                              });
                      });
                  });
              });
          
          });
      });
  });
})();
