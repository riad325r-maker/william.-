// بيانات المستخدم (مؤقتة)
const userData = {
    name: 'أحمد محمد',
    level: 'متوسط',
    streak: 7,
    savedWords: 120,
    watchedScenes: 45,
    achievements: 5
};

// تحميل بيانات المستخدم
document.addEventListener('DOMContentLoaded', function() {
    updateUserStats();
});

function updateUserStats() {
    // تحديث الإحصائيات
}

function continueWatching() {
    window.location.href = 'watch.html?scene=latest';
}

function searchContent() {
    const searchTerm = document.querySelector('.header-search input').value;
    if (searchTerm) {
        alert(`البحث عن: ${searchTerm}`);
    }
}