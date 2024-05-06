const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');
// const db = require(db)
const app = express();
const upload = multer({ dest: 'src/uploads/' });
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const formRoutes = require('./routes/formRoutes');

app.use('/api', formRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
