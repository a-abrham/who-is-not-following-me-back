async function compareFollowers() {
  const followersFile = document.getElementById('followersFile').files[0];
  const followingFile = document.getElementById('followingFile').files[0];
  const closeFriendsFile = document.getElementById('closeFriendsFile').files[0];

  if (!followersFile || !followingFile || !closeFriendsFile) {
    alert('Please upload all three JSON files.');
    return;
  }

  const formData = new FormData();
  formData.append('followersFile', followersFile);
  formData.append('followingFile', followingFile);
  formData.append('closeFriendsFile', closeFriendsFile);

  try {
    const response = await fetch('https://who-is-not-following-me-back-production.up.railway.app/compare-followers', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();

    const instagramLinks = result.B_only.map(username => `<a href="https://www.instagram.com/${username}" target="_blank">${username}</a>`);

    document.getElementById('followingNotFollowersBack').innerHTML = `
      <p>${instagramLinks.join(',<br>')}</p>
    `;

    document.getElementById('results').style.display = 'block';
  } catch (error) {
    console.error(error);
    alert('An error occurred during the comparison. Please try again.');
  }
}