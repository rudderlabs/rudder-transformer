const process = async (event) => {
  const response = [
    { message: { a: 'babel', status: 200 } },
    { message: { a: 'babel', status: 200 } },
  ];
  return response;
};

exports.process = process;
