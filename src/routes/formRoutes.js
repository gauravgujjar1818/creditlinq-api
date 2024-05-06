const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../db');
const { json } = require('body-parser');

const upload = multer({ dest: 'src/uploads/' });

router.post('/submitForm', (req, res) => {
    
  const { companyUEN, companyName, fullName, position, email, mobile } = req.body;
    console.log(req.body)
  if (!companyUEN || !companyName ||  !fullName || !position || !email || !mobile)
  {
    return  res.status(400).json({ message: 'Data missing mandatory filds' });
  }
  const sql = `INSERT INTO leads_form (companyUEN, companyName, fullName, positionWithinComp, email, mobileNumber) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [companyUEN, companyName, fullName, position, email, mobile];

  db.query(sql, values, (err, result) => {
    if (err){
      return  res.status(400).json({ message: 'Data not inserted' });
    }
    const insertedId = result.insertId;
    console.log('Form data inserted with ID:', insertedId);
    console.log('Form data inserted');
    res.status(200).json({ message: 'Form data submitted successfully',
  id: insertedId});
  });
});

router.post('/uploadFiles', upload.array('files', 6), (req, res) => {
  // console.log('Uploading', req.files)
  console.log('Uploading', req.body)
  let files = []
  let id=null;
  if(req.files){
    files = req.files;
    id = req.body
  }
   
  const fileUploadStatus = [];

  files.forEach((file) => {
    if (file.size <= 0) {
      console.log()
      fileUploadStatus.push({ filename: file.originalname , status: 'Failed' });
    } else {
      fileUploadStatus.push({ filename: file.originalname, status: 'Success' });
    }
  });

  const fileNames = files.map((file) => file.originalname).join(',');

  const sql = `UPDATE leads_form SET fileNames = ?, fileUploadStatus = ? WHERE id = ?;`;
  const values = [fileNames, JSON.stringify(fileUploadStatus),id];
console.log(values)
  db.query(sql, values, (err, result) => {
    if (err) throw err;
    console.log(result.insertId,result.affectedRows)
    console.log('File details inserted into database');
    res.status(200).json({ message: 'Files uploaded successfully', fileUploadStatus });
  });
});


router.get('/getFormDetails', (req, res) => {
    
   
    const sql = `select id,companyUEN,companyName,fullName,positionWithinComp,email,mobileNumber,submissionDate from leads_form;`;
    const values = [];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' }); // Send an error response
      }
      console.log(result);
      res.status(200).json({ data: result });
    });
  });
module.exports = router;
