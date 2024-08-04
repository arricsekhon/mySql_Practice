const { faker, th } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'Delta_app',
    password: 'Mysql@1234'
  });

let getRandomUser = () => {
    return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
];
}


// try {
//     connection.query(q, flattenedUsers, (err, results) => {
//         console.log(results);
//     });
// } catch(err) {
//     console.log(err);
// }

app.get("/", (req, res) => {
    let q = "SELECT * FROM users"
    try {
        connection.query(q, (err, results) => {
            let count = results.length;
            res.render('home.ejs', {count})
        });
    } catch(err) {
        console.log(err);
        res.send("Some Error in the DB");
    }
});

app.get("/users", (req, res) => {
    let q = "SELECT * FROM users"
    try {
        connection.query(q, (err, users) => {
            let count = users.length;
            res.render('users.ejs', {users, count})
        });
    } catch(err) {
        console.log(err);
        res.send("Some Error in the DB");
    }
});

app.get("/user/:id/edit", (req, res) => {
    let {id} = req.params;
    let q = `SELECT * FROM users WHERE id = '${id}'`;
    try {
        connection.query(q, (err, result) => {
            console.log(result);
            let user = result[0];
            res.render('edit.ejs', {user});
        });
    } catch(err) {
        console.log(err);
        res.send("Some Error in the DB");
    }
});

app.get("/user/add", (req, res) => {
    res.render('add.ejs');
});

app.post("/user/new", (req, res) => {
    let {username, email, password} = req.body;
    let q = `INSERT INTO users (id, username, email, password) VALUES ('${faker.string.uuid()}', '${username}', '${email}', '${password}')`;
    try {
        connection.query(q, (err, result) => {
            console.log(result);
            res.redirect("/users");
        });
    } catch(err) {
        console.log(err);
        res.send("Some Error in the DB");
    }
}
);
app.patch("/user/:id", (req, res) => {
    let {id} = req.params;
    let {password: formpassword, username: newUserName} = req.body;
    let q = `SELECT * FROM users WHERE id = '${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (result[0].password != formpassword) {
                res.send("Wrong Password");
                
            } else {
                let q = `UPDATE users SET username = '${newUserName}' WHERE id = '${id}'`;
                connection.query(q, (err, result) => {
                    res.redirect("/users");
                }
                );
            }
        });
    } catch(err) {
        console.log(err);
        res.send("Some Error in the DB");
    }
});

app.delete("/user/:id", (req, res) => {
    let {id} = req.params;
    let {password: formpassword, username: newUserName} = req.body;
    let q = `DELETE FROM users WHERE id = '${id}'`;
    if (!formpassword ){
        res.send("Password is not filles (required)");
    } else {
    try {
        if (result[0].password != formpassword) {
            res.send("Wrong Password");
        } else {
            connection.query(q, (err, result) => {
            res.redirect("/users");
        });
    }
    } catch(err) {
        console.log(err);
        res.send("Some Error in the DB");
    }
}
}
); 



app.listen("3000", () => {
    console.log("Server is running on port 3000");
});





// console.log(getRandomUser());
// let users = [];
// for (let i = 0; i < 90; i++) {
//     users.push(getRandomUser());
// }

// let flattenedUsers = users.flat();

// let placeholders = users.map(() => "(?, ?, ?, ?)").join(", ");
// let q = `INSERT INTO users (id, username, email, password) VALUES ${placeholders}`;