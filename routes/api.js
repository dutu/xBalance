
export let api = {};

api.getBalances = function getBalances(req, res) {
	let response = {
    name: 'Boooob',
    "firstName": "joe",
    "kids": [{alfa:{name: "2"}}, {omega:{name: "4"}}]
  };

  res.json(response);
};