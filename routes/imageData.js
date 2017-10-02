
module.exports = function(settings){
	var config= settings.config;
	var app = settings.app;
	var connectionPool = settings.connectionPool;
	var request = settings.request;
	var config = settings.config;
	var base64 = require('node-base64-image');
	console.log(settings.user);

  app.get("/getImageData", function(req, res){
     var url= req.query.imageUrl;
      var options = {string: true};
          base64.encode(url, options, function (err, image) {
              if (err) {
                  res.json({
                          data: null,
                          status: 'fail',
                          message: "could not read image"
                      })
                  return;
              }
              else{
                  image = "data:image/jpeg;base64," + image;
                  res.json({
                          data: image,
                          status: 'success',
                          message: "results fetched successfully"
                      })
                  return;
              }
          })
  });

}
