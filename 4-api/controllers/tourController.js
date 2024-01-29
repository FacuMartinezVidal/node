const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  if (req.params.id * 1 > tours.length) {
    //status 404 significa que no se encontro
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  console.log(req.body);
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  //status 200 significa que todo esta bien
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

exports.createTour = (req, res) => {
  // console.log(req.body);
  const new_id = tours[tours.length - 1].id + 1;
  //permite crear un nuevo objeto con los datos de req.body y agregarle el id
  const new_tour = Object.assign({ id: new_id }, req.body);
  //agregamos el nuevo tour al arreglo de tours
  tours.push(new_tour);
  //no usamos el sincronico porque bloquea el event loop, usamos el asincronico
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      //status 201 significa que algo fue creado
      res.status(201).json({
        status: 'success',
        data: { tour: new_tour },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

exports.deleteTour = (req, res) => {
  //status 204 significa que no hay contenido
  res.status(204).json({
    status: 'success',
    //null porque no hay contenido ya que se borro el tour
    data: null,
  });
};
