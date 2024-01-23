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
    const followersBuffer = req.files['followersFile'][0].buffer.toString('utf-8');
    const followingBuffer = req.files['followingFile'][0].buffer.toString('utf-8');
    const closeFriendsBuffer = req.files['closeFriendsFile'][0].buffer.toString('utf-8');

    const followersList = JSON.parse(followersBuffer).map(item => item.string_list_data[0].value);
    const followingList = JSON.parse(followingBuffer).relationships_following.map(item => item.string_list_data[0].value);
    
    // Extract close friends' usernames
    const closeFriendsList = JSON.parse(closeFriendsBuffer).relationships_close_friends.map(item => item.string_list_data[0].value);

    const followersSet = new Set(followersList);
    const followingSet = new Set(followingList);
    const closeFriendsSet = new Set(closeFriendsList);

    // Exclude close friends from followers and following sets
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
