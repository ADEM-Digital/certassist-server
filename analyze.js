let json = require("./tmp/database.json");

let topics = {
  Anatomy: [],
  "Behavioral Sciences": [],
  Biochemistry: [],
  Microbiology: [],
  Immunology: [],
};

json.questions.forEach((question) =>
  topics[question.topic].push(question.subtopic)
);

Object.keys(topics).forEach((key) => {
  let uniqueArray = [...new Set(topics[key])];
  topics[key] = uniqueArray;
});

console.log(topics);
