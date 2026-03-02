// script.js

// بيانات الأفلام (نفسها)
const movies = [
    {
        id: 1,
        title: { ar: "فريندز", en: "Friends" },
        image: "https://via.placeholder.com/300x400?text=Friends",
        level: { ar: "مبتدئ", en: "Beginner" },
        scenes: 45
    },
    {
        id: 2,
        title: { ar: "هاري بوتر", en: "Harry Potter" },
        image: "https://via.placeholder.com/300x400?text=Harry+Potter",
        level: { ar: "متوسط", en: "Intermediate" },
        scenes: 67
    },
    {
        id: 3,
        title: { ar: "استهلال", en: "Inception" },
        image: "https://via.placeholder.com/300x400?text=Inception",
        level: { ar: "متقدم", en: "Advanced" },
        scenes: 23
    },
    {
        id: 4,
        title: { ar: "التاج", en: "The Crown" },
        image: "https://via.placeholder.com/300x400?text=The+Crown",
        level: { ar: "متقدم", en: "Advanced" },
        scenes: 34
    }
];

// تحميل الأفلام
document.addEventListener('DOMContentLoaded', function() {
    loadMovies();
    
    // تحديث الإحصائيات
    updateStats();
});

function loadMovies() {
    const movieGrid = document.getElementById('movieGrid');
    if (movieGrid) {
        movieGrid.innerHTML = '';
        
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            movieCard.onclick = () => goToMovie(movie.id);
            
            // استخدم اللغة الحالية للعنوان
            const currentLang = window.currentLanguage || 'ar';
            const title = movie.title[currentLang];
            const level = movie.level[currentLang];
            
            movieCard.innerHTML = `
                <img src="${movie.image}" alt="${title}">
                <div class="movie-info">
                    <h3>${title}</h3>
                    <p>${getTranslation('stats.scenes')}: ${movie.scenes}</p>
                    <p>${level}</p>
                </div>
            `;
            movieGrid.appendChild(movieCard);
        });
    }
}

// تحديث الإحصائيات بشكل حي
function updateStats() {
    const moviesCount = document.getElementById('movies-count');
    const usersCount = document.getElementById('users-count');
    const wordsCount = document.getElementById('words-count');
    
    if (moviesCount) {
        let count = 500;
        setInterval(() => {
            count += Math.floor(Math.random() * 10);
            moviesCount.textContent = count + '+';
        }, 5000);
    }
}

// دوال المودال
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function openSignupModal() {
    const msg = window.currentLanguage === 'ar' ? 
        "راح نفتح مودال التسجيل قريباً!" : 
        "Signup modal coming soon!";
    alert(msg);
}

function handleLogin(event) {
    event.preventDefault();
    const email = event.target[0].value;
    const password = event.target[1].value;
    
    console.log('Login attempt:', { email, password });
    
    const successMsg = window.currentLanguage === 'ar' ? 
        'تم تسجيل الدخول بنجاح!' : 
        'Login successful!';
    
    alert(successMsg);
    closeLoginModal();
}

function googleLogin() {
    const msg = window.currentLanguage === 'ar' ? 
        'جاري تسجيل الدخول بـ Google...' : 
        'Logging in with Google...';
    alert(msg);
}

function toggleMenu() {
    const msg = window.currentLanguage === 'ar' ? 
        'قائمة الموبايل - راح نضيفها قريباً' : 
        'Mobile menu - coming soon';
    alert(msg);
}

function goToMovie(movieId) {
    window.location.href = `watch.html?movie=${movieId}`;
}=