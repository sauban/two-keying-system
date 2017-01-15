var Sails = require('sails');


before(function(done) {

  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(5000);

  Sails.lift({
      port: 1338,
      connections: {
          'default': 'localTestDiskDb'
      },
      models: {
          'connection': 'localTestDiskDb'
      }
  }, (err, sails) => {
      if (err) return done(err);
    //   User.create(users[0])
    //   .then(user => {
        //   console.log(user);
          done(err, sails);
    //   })
    //   .catch(done);
  });
});

after(done => {
  // here you can clear fixtures, etc.
  Sails.lower(done);
});
