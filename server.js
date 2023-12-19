const jsonServer = require('json-server');
var _ = require('lodash');
const server = jsonServer.create();
const router = jsonServer.router('database.json');
const middlewares = jsonServer.defaults();

// Use default middlewares
server.use(middlewares);

// Custom route to return posts by category and author
server.get('/questions/ids', (req, res) => {
    const { topic, selectedSubtopics, questionCount } = req.query;
    
    console.log(req.query)
    let questions = router.db.get('questions')
                         .filter(question => selectedSubtopics.findIndex((subtopic) => question.subtopic.toLowerCase() === subtopic.toLowerCase()) > -1)
                         .value();
    
    questions = _.sampleSize(questions, Number(questionCount.value)).map((question) => question.id);
    res.jsonp(questions);
});

// Grade tests
server.put('/gradetests/:id', (req, res) => {
    let {id} = req.params;
    let test = router.db.get('tests').find({ id: id }).value();

    if (!test) {
        res.status(404).send('Test not found');
        return;
    }

    test.testStatus = "completed";

    test.questions.forEach((question, index) => {
        let questionData = router.db.get('questions').find((questionData) => questionData.id === question.id).value();
        test.questions[index].correct = questionData.correct_answer  === question.answer ? 1 : 0
    })

    test.grade = test.questions.reduce((acc, currVal) => acc + currVal.correct, 0) / test.questionCount * 100;
    
    router.db.get('tests').find({ id: id }).assign(test).write();

    res.status(200).jsonp(test);
});

// Use default router
server.use(router);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`JSON Server is running on http://localhost:${PORT}`);
});