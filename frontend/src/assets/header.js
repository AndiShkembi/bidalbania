document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('token');
  const loginLi = document.getElementById('login');
  const signupLi = document.getElementById('signup');

  if (token) {
    // Fshi Identifikohu dhe Regjistrohu nëse ekziston
    if (loginLi) loginLi.style.display = 'none';
    if (signupLi) signupLi.style.display = 'none';
    // Shto Profili në menu nëse nuk ekziston
    if (!document.getElementById('profile-menu-link')) {
      const nav = loginLi ? loginLi.parentElement : document.querySelector('.ha--nav');
      if (nav) {
        const profileLi = document.createElement('li');
        profileLi.id = 'profile-menu-link';
        const a = document.createElement('a');
        a.href = 'profile.html';
        a.className = 'ha--mobile_nav_button';
        a.textContent = 'Profili';
        a.setAttribute('role', 'menuitem');
        profileLi.appendChild(a);
        nav.insertBefore(profileLi, nav.firstChild.nextSibling); // pas 'Filloni një Projekt'
      }
    }
  } else {
    // Nëse nuk ka token, shfaq Identifikohu dhe Regjistrohu
    if (loginLi) loginLi.style.display = '';
    if (signupLi) signupLi.style.display = '';
    const profileLi = document.getElementById('profile-menu-link');
    if (profileLi) profileLi.remove();
  }
}); 