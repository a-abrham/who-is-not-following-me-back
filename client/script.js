    async function compareFollowers() {
      const followersFile = document.getElementById('followersFile').files[0];
      const followingFile = document.getElementById('followingFile').files[0];

      const formData = new FormData();
      formData.append('followersFile', followersFile);
      formData.append('followingFile', followingFile);

      const response = await fetch('https://who-is-not-following-me-back-production.up.railway.app/compare-followers', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      const instagramLinks = result.B_only.map(username => `<a href="https://www.instagram.com/${username}" target="_blank">${username}</a>`);

document.getElementById('followingNotFollowersBack').innerHTML = `
  <p>${instagramLinks.join(',<br>')}</p>
`;


      document.getElementById('results').style.display = 'block';
    }