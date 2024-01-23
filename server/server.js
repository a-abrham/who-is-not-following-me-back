const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');

const _ = require('lodash');

const app = express();
const port = process.env.PORT;
app.use(cors());


app.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/compare-followers', upload.fields([{ name: 'followersFile', maxCount: 1 }, { name: 'followingFile', maxCount: 1 }]), (req, res) => {
    try {
      const followersBuffer = req.files['followersFile'][0].buffer.toString('utf-8');
      const followingBuffer = req.files['followingFile'][0].buffer.toString('utf-8');
  
      const followersList = JSON.parse(followersBuffer).map(item => item.string_list_data[0].value);
      const followingList = JSON.parse(followingBuffer).relationships_following.map(item => item.string_list_data[0].value);
    
      const followersSet = new Set(followersList);
      const followingSet = new Set(followingList);
  
      const aOnly = _.difference([...followersSet], [...followingSet]);
      const aAndB = _.intersection([...followersSet], [...followingSet]);
      const bOnly = _.difference([...followingSet], [...followersSet]);
  
      const result = {
        A_only: aOnly,
        A_and_B: aAndB,
        B_only: bOnly,
      };
  
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
