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

app.post('/compare-followers', upload.fields([
  { name: 'followersFile', maxCount: 1 },
  { name: 'followingFile', maxCount: 1 },
  { name: 'closeFriendsFile', maxCount: 1 }
]), (req, res) => {
  try {
    const parseJSON = (buffer) => {
      try {
        return JSON.parse(buffer);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return null;
      }
    };

    const followersBuffer = req.files['followersFile'][0].buffer.toString('utf-8');
    const followingBuffer = req.files['followingFile'][0].buffer.toString('utf-8');
    const closeFriendsBuffer = req.files['closeFriendsFile'][0].buffer.toString('utf-8');

    const followersList = parseJSON(followersBuffer);
    const followingList = parseJSON(followingBuffer);
    const closeFriendsList = parseJSON(closeFriendsBuffer);

    if (!followersList || !followingList || !closeFriendsList) {
      throw new Error('Invalid JSON format in one of the files');
    }

    const extractValues = (data) => {
      if (Array.isArray(data)) {
        return data.map(item => item.string_list_data[0].value);
      } else {
        throw new Error('Invalid data format');
      }
    };

    const followersSet = new Set(extractValues(followersList));
    const followingSet = new Set(extractValues(followingList));
    const closeFriendsSet = new Set(extractValues(closeFriendsList));

    const followersSetWithoutCloseFriends = new Set([...followersSet].filter(item => !closeFriendsSet.has(item)));
    const followingSetWithoutCloseFriends = new Set([...followingSet].filter(item => !closeFriendsSet.has(item)));

    const aOnly = _.difference([...followersSetWithoutCloseFriends], [...followingSetWithoutCloseFriends]);
    const aAndB = _.intersection([...followersSetWithoutCloseFriends], [...followingSetWithoutCloseFriends]);
    const bOnly = _.difference([...followingSetWithoutCloseFriends], [...followersSetWithoutCloseFriends]);

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
