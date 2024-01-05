    async function compareFollowers() {
      const followersFile = document.getElementById('followersFile').files[0];
      const followingFile = document.getElementById('followingFile').files[0];

      const formData = new FormData();
      formData.append('followersFile', followersFile);
      formData.append('followingFile', followingFile);

      const response = await fetch('http://localhost:3000/compare-followers', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      document.getElementById('followingNotFollowersBack').innerHTML = `
        <p>People you follow, but they don't follow you back: ${result.B_only.join(',</br> ')}</p>
      `;

      document.getElementById('results').style.display = 'block';
    }