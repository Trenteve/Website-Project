import express from 'express'
import sql from 'sqlite3'

const sqlite3 = sql.verbose()

// Create an in memory table to use
const db = new sqlite3.Database(':memory:')

db.run(`CREATE TABLE student1 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comment TEXT NOT NULL)`, function(err){
    if(err){
      console.log(err);
    }
    else{
      addCommentsStudent1()
    }
  })

const app = express()
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  console.log('GET called')
  res.render('index')
})

app.get('/student1', function (req, res) {
  const local = { student1: [] }
  db.each('SELECT id, comment FROM student1', function (err, row) {
    if (err) {
      console.log(err)
    } else {
      local.student1.push({ id: row.id, comment: row.comment })
    }
  }, function (err, numrows) {
    if (!err) {
      res.render('student1', local)
    } else {
      console.log(err)
    }
  })
})

app.post('/addStudent1', function (req, res) {
  const stmt = db.prepare('INSERT INTO student1 (comment) VALUES (?)')
  stmt.run(req.body.comment)
  stmt.finalize()
  res.redirect('/student1')
})

app.post("/deleteStudent1", function (req, res) {
  const stmt = db.prepare('DELETE FROM student1 where id = (?)')
  stmt.run(req.body.id)
  stmt.finalize()
  res.redirect('/student1')
})

const randomCommentsStudent1 = [
  "I am the best swimmer in my family!",
  "Working at my dream job <3",
  "Swimming with the fish is so fun",
  "I love eating fish and now they are so easy to catch!",
  "This sucks! I hate my ugly tail and I want feet again",
  "On the land they don't repremend their daughters",
  "Darling it's better down where it's wetter take it from me",
  "The choirs are beautiful",
  "#beat ursula",
  "Swimming is my favorite hobby"
]

function addCommentsStudent1() {
  const stmt = db.prepare('INSERT INTO student1 (comment) VALUES(?)');
  let index = 0;
  while(index < 10 && randomCommentsStudent1.length > 0){
    let comment = randomCommentsStudent1[index];
    if(comment){
      stmt.run(comment);
      index++;
    }
  }
}

app.post('/editStudent1', function(req, res) {
  const stmt = db.prepare('UPDATE student1 SET comment = (?) WHERE id = (?)')
  stmt.run(req.body.comment, req.body.id)
  stmt.finalize()
  res.redirect('/student1')
})



//student2

const student2Comments = [
    "I love this major",
    "I am now a professional sleeper",
    "This major rocks!",
    "I wish I could take this major again.",
    "Don't take this major if you don't want to be sleepy all the time.",
    "I landed my first sleeping job!",
    "I learned nothing from this major",
    "The professors were always asleep.",
    "We got to sleep in class!",
    "Excellent career choice.",
    "I hated this major",
    "Sleeping is overrated",
    "I did not enjoy this experience",
    "I love this University",
    "I was told to comment for a grade",
    "Best professors ever",
    "Worst professors ever"
]

function randomizedComments(){
  const stmt = db.prepare('INSERT INTO student2 (comment) VALUES(?)');
  let copyComments = student2Comments.slice();
  let count = 0;
  while(count < 10 && copyComments.length > 0){
    let commentNum = Math.floor(Math.random() * copyComments.length - 1);
    let comment = copyComments.splice(commentNum, 1)[0];
    if(comment){
      stmt.run(comment);
      count++;
    }
  }
}

app.get('/student2', function (req, res) {
  const local = { student2: [] }
  db.each('SELECT id, comment FROM student2', function (err, row) {
    if (err) {
      console.log(err)
    } else {
      local.student2.push({ id: row.id, comment: row.comment })
    }
  }, function (err, numrows) {
    if (!err) {
      res.render('student2', local)
    } else {
      console.log(err)
    }
  })
})

app.post('/addStudent2', function (req, res) {
  const stmt = db.prepare('INSERT INTO student2 (comment) VALUES (?)')
  stmt.run(req.body.comment)
  stmt.finalize()
  res.redirect('/student2')
})

app.post('/deleteStudent2', function (req, res) {
  const stmt = db.prepare('DELETE FROM student2 WHERE id = ?')
  stmt.run(req.body.id)
  stmt.finalize()
  res.redirect('/student2')
})

app.post('/editStudent2', function(req, res) {
  const stmt = db.prepare('UPDATE student2 SET comment = (?) WHERE ID = (?)')
  stmt.run(req.body.comment, req.body.id)
  stmt.finalize()
  res.redirect('/student2')
})

db.run(`CREATE TABLE IF NOT EXISTS student2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comment TEXT NOT NULL
)`, function(err){
  if(err){
    console.log(err);
  }
  else{
    randomizedComments()
  }
})

// Student 3 Comment Handling

// Show comments
app.get('/student3', function (req, res) {
  db.all('SELECT * FROM student3', function (err, rows) {
    if (err) {
      console.log(err);
    } else {
      res.render('student3', { comments: rows });
    }
  });
});

// Add comments
app.post('/student3AddComment', (req, res) => {
  const stmt = db.prepare('INSERT INTO student3 (comment) VALUES(?)');
  stmt.run(req.body.comment)
  stmt.finalize()
  res.redirect('/student3')
})

// Edit comments
app.post('/student3EditComment', (req, res) => {
  const stmt = db.prepare('UPDATE student3 SET comment = (?) WHERE id = (?)');
  stmt.run(req.body.comment, req.body.id);
  stmt.finalize();
  res.redirect('/student3');
});

// Delete comments
app.post('/student3DeleteComment', (req, res) => {
  const stmt = db.prepare('DELETE FROM student3 WHERE id = ?');
  stmt.run(req.body.id);
  stmt.finalize();
  res.redirect('/student3');
});

db.run(`CREATE TABLE IF NOT EXISTS student3 (id INTEGER PRIMARY KEY AUTOINCREMENT,
  comment TEXT NOT NULL)`);


// Start the web server
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})
