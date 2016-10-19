Parse.Cloud.job("removeInvalidLogin", function (request, status) {
  var date = new Date();
  var timeNow = date.getTime();
  var intervalOfTime = 3*24*60*60*1000; // 3 days in milliseconds
  var timeThen = timeNow - intervalOfTime;

  // Limit date
  var queryDate = new Date();
  queryDate.setTime(timeThen);

  // The query object
  var query = new Parse.Query(Parse.User);

  // Query the logins that still unverified after 3 days
  query.equalTo("emailVerified", false);
  query.lessThanOrEqualTo("createdAt", queryDate);

  query.find({
    success: function (results) {
      console.log("Successfully retrivied " + results.length + " invalid logins.");

      // Destroying the invalid users
      query.each(function (object, err) {
        object.destroy({
          success: function (object) {
            console.log("Successfully destroyed object " + object.objectId);
          },
          error: function (error) {
            console.log("Error: " + error.code + " - " + error.message);
          },
          useMasterKey: true // VERY IMPORTANT!!
        })
      })
    },
    error: function (error) {
      console.log("Error: " + error.code + " - " + error.message);
    }
  })
});
