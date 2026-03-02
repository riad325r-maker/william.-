// بيانات المشهد الحالي (مثال)
const sceneData = {
    movieId: 1,
    title: "Friends - The Break Scene",
    videoId: "M7lc1UVf-VE", // YouTube ID
    words: [
        {
            id: 1,
            english: "break",
            arabic: "انفصال",
            context: "We were on a break!",
            saved: false
        },
        {
            id: 2,
            english: "were",
            arabic: "كنا",
            context: "We were on a break!",
            saved: false
        },
        {
            id: 3,
            english: "on",
            arabic: "في",
            context: "We were on a break!",
            saved: false
        }
    ],
    sentences: [
        {
            id: 1,
            english: "We were on a break!",
            arabic: "كنا في فترة انفصال!",
            words: [1, 2, 3],
            time: 10
        },
        {
            id: 2,
            english: "How you doin'?",
            arabic: "كيف حالك؟",
            words: [4, 5],
            time: 15
        }
    ],
    quiz: [
        {
            id: 1,
            question: {
                ar: "ماذا تعني كلمة 'break' في هذا السياق؟",
                en: "What does 'break' mean in this context?"
            },
            options: {
                ar: ["استراحة", "انفصال", "كسر", "فرصة"],
                en: ["Rest", "Separation", "Break (physical)", "Opportunity"]
            },
            correct: 1,
            explanation: {
                ar: "في مسلسل Friends، 'break' تعني انفصال مؤقت بين الشخصيات",
                en: "In Friends, 'break' means temporary separation between characters"
            }
        }
    ],
    speakSentences: [
        {
            id: 1,
            english: "We were on a break!",
            arabic: "كنا في فترة انفصال!"
        },
        {
            id: 2,
            english: "How you doin'?",
            arabic: "كيف حالك؟"
        },
        {
            id: 3,
            english: "I'll be there for you",
            arabic: "سأكون موجوداً لأجلك"
        }
    ]
};

let currentSentenceIndex = 0;
let recognition = null;
let isListening = false;
let player = null;

// تحميل YouTube API
function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// تشغيل الفيديو
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('youtube-player', {
        height: '400',
        width: '100%',
        videoId: sceneData.videoId,
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'rel': 0,
            'modestbranding': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
    console.log('Player ready');
    // بدأ التحديث التلقائي للترجمة
    setInterval(updateSubtitles, 100);
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        document.getElementById('playPauseIcon').className = 'fas fa-pause';
    } else {
        document.getElementById('playPauseIcon').className = 'fas fa-play';
    }
}

function updateSubtitles() {
    if (!player) return;
    
    const currentTime = player.getCurrentTime();
    const currentSentence = sceneData.sentences.find(s => 
        Math.abs(s.time - currentTime) < 2
    );
    
    if (currentSentence) {
        document.getElementById('currentSubtitle').textContent = currentSentence.english;
        document.getElementById('currentTranslation').textContent = currentSentence.arabic;
    }
}

function togglePlay() {
    if (!player) return;
    
    const state = player.getPlayerState();
    if (state == YT.PlayerState.PLAYING) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
}

function replay5Seconds() {
    if (!player) return;
    const currentTime = player.getCurrentTime();
    player.seekTo(currentTime - 5, true);
}

function toggleLoop() {
    // TODO: تنفيذ خاصية الإعادة
    alert('Loop feature coming soon!');
}

// تحميل البيانات عند فتح الصفحة
document.addEventListener('DOMContentLoaded', function() {
    loadYouTubeAPI();
    loadWords();
    loadSentences();
    loadQuiz();
    loadSpeakSection();
    setupSpeechRecognition();
});

// الكلمات
function loadWords() {
    const grid = document.getElementById('wordsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    sceneData.words.forEach(word => {
        const card = document.createElement('div');
        card.className = `word-card ${word.saved ? 'saved' : ''}`;
        card.innerHTML = `
            <div class="word-english">${word.english}</div>
            <div class="word-arabic">${word.arabic}</div>
            <div class="word-context">"${word.context}"</div>
            <div class="word-actions">
                <button onclick="playWord('${word.english}')" title="استماع">
                    <i class="fas fa-volume-up"></i>
                </button>
                <button onclick="saveWord(${word.id})" title="حفظ">
                    <i class="fas ${word.saved ? 'fa-bookmark' : 'fa-bookmark-o'}"></i>
                </button>
                <button onclick="showWordDetails(${word.id})" title="تفاصيل">
                    <i class="fas fa-info-circle"></i>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function playWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
}

function saveWord(wordId) {
    const word = sceneData.words.find(w => w.id === wordId);
    if (word) {
        word.saved = !word.saved;
        loadWords(); // إعادة تحميل الكلمات
    
        // رسالة تأكيد
        const msg = word.saved ? 'تم حفظ الكلمة' : 'تم إزالة الكلمة';
        showNotification(msg);
    }
}

function saveAllWords() {
    sceneData.words.forEach(word => word.saved = true);
    loadWords();
    showNotification('تم حفظ جميع الكلمات');
}

function showWordDetails(wordId) {
    const word = sceneData.words.find(w => w.id === wordId);
    alert(`
        الكلمة: ${word.english}
        المعنى: ${word.arabic}
        السياق: ${word.context}
    `);
}

// الجمل
function loadSentences() {
    const list = document.getElementById('sentencesList');
    if (!list) return;
    
    list.innerHTML = '';
    sceneData.sentences.forEach(sentence => {
        const item = document.createElement('div');
        item.className = 'sentence-item';
        item.innerHTML = `
            <div class="sentence-english">${sentence.english}</div>
            <div class="sentence-arabic">${sentence.arabic}</div>
            <div class="sentence-words">
                ${sentence.words.map(wordId => {
                    const word = sceneData.words.find(w => w.id === wordId);
                    return `<span class="word-chip" onclick="showWordDetails(${wordId})">${word.english}</span>`;
                }).join('')}
            </div>
            <button class="btn btn-small" onclick="jumpToTime(${sentence.time})">
                <i class="fas fa-clock"></i> الانتقال للمشهد
            </button>
        `;
        list.appendChild(item);
    });
}

function jumpToTime(time) {
    if (!player) return;
    player.seekTo(time, true);
    player.playVideo();
    switchTab('words'); // الرجوع لتبويب الكلمات
}

// الأسئلة
function loadQuiz() {
    const container = document.getElementById('quizContainer');
    if (!container) return;
    
    const currentLang = window.currentLanguage || 'ar';
    const quiz = sceneData.quiz[0];
    
    container.innerHTML = `
        <div class="quiz-question">
            <h4>${quiz.question[currentLang]}</h4>
            <div class="quiz-options" id="quizOptions">
                ${quiz.options[currentLang].map((opt, index) => `
                    <div class="quiz-option" onclick="selectOption(${index})">
                        <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                        <span class="option-text">${opt}</span>
                    </div>
                `).join('')}
            </div>
            <div class="quiz-feedback" id="quizFeedback" style="display: none;"></div>
            <button class="btn btn-primary" onclick="checkAnswer()" id="checkBtn">
                ${currentLang === 'ar' ? 'تحقق' : 'Check'}
            </button>
        </div>
    `;
}

let selectedOption = -1;

function selectOption(index) {
    selectedOption = index;
    
    // إزالة التحديد السابق
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // تحديد الخيار الجديد
    document.querySelectorAll('.quiz-option')[index].classList.add('selected');
}

function checkAnswer() {
    const currentLang = window.currentLanguage || 'ar';
    const quiz = sceneData.quiz[0];
    const feedback = document.getElementById('quizFeedback');
    const checkBtn = document.getElementById('checkBtn');
    
    if (selectedOption === -1) {
        alert(currentLang === 'ar' ? 'اختر إجابة أولاً' : 'Select an answer first');
        return;
    }
    
    const isCorrect = selectedOption === quiz.correct;
    
    feedback.style.display = 'block';
    feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`;
    
    if (isCorrect) {
        feedback.innerHTML = `
            <i class="fas fa-check-circle"></i>
            ${currentLang === 'ar' ? 'إجابة صحيحة! 🎉' : 'Correct! 🎉'}
            <p>${quiz.explanation[currentLang]}</p>
        `;
        
        // تغيير لون الخيارات
        document.querySelectorAll('.quiz-option').forEach((opt, index) => {
            if (index === quiz.correct) {
                opt.classList.add('correct');
            }
        });
    } else {
        feedback.innerHTML = `
            <i class="fas fa-times-circle"></i>
            ${currentLang === 'ar' ? 'إجابة خاطئة 😢' : 'Wrong answer 😢'}
            <p>${quiz.explanation[currentLang]}</p>
        `;
        
        document.querySelectorAll('.quiz-option')[selectedOption].classList.add('wrong');
        document.querySelectorAll('.quiz-option')[quiz.correct].classList.add('correct');
    }
    
    checkBtn.disabled = true;
}

// النطق
function setupSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = function() {
            isListening = true;
            document.getElementById('micButton').classList.add('listening');
            document.getElementById('micStatus').textContent = 
                window.currentLanguage === 'ar' ? 'جاري الاستماع...' : 'Listening...';
        };
        
        recognition.onend = function() {
            isListening = false;
            document.getElementById('micButton').classList.remove('listening');
            document.getElementById('micStatus').textContent = 
                window.currentLanguage === 'ar' ? 'اضغط للتكلم' : 'Click to speak';
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            processSpeech(transcript);
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error', event);
            alert('حدث خطأ في التعرف على الصوت. تأكد من إذن المايكروفون.');
        };
    } else {
        console.warn('Speech recognition not supported');
        document.getElementById('micButton').disabled = true;
        document.getElementById('micStatus').textContent = 
            window.currentLanguage === 'ar' ? 'غير مدعوم في هذا المتصفح' : 'Not supported';
    }
}

function loadSpeakSection() {
    const sentence = sceneData.speakSentences[currentSentenceIndex];
    document.getElementById('speakSentence').textContent = sentence.english;
    document.getElementById('speakTranslation').textContent = sentence.arabic;
    document.getElementById('sentenceCounter').textContent = 
        `${currentSentenceIndex + 1}/${sceneData.speakSentences.length}`;
}

function startListening() {
    if (!recognition) {
        alert('التعرف على الصوت غير مدعوم');
        return;
    }
    
    if (isListening) {
        recognition.stop();
        return;
    }
    
    recognition.start();
}

function processSpeech(transcript) {
    const expected = sceneData.speakSentences[currentSentenceIndex].english;
    const similarity = calculateSimilarity(transcript, expected);
    const percentage = Math.round(similarity * 100);
    
    document.getElementById('userSpeech').textContent = transcript;
    document.getElementById('score').textContent = percentage + '%';
    document.getElementById('pronunciationResult').style.display = 'block';
    
    // رسالة حسب الدقة
    let feedback = '';
    if (percentage > 90) {
        feedback = window.currentLanguage === 'ar' ? 'ممتاز! 🎉' : 'Excellent! 🎉';
    } else if (percentage > 70) {
        feedback = window.currentLanguage === 'ar' ? 'جيد جداً 👍' : 'Very good 👍';
    } else if (percentage > 50) {
        feedback = window.currentLanguage === 'ar' ? 'جيد، حاول مرة أخرى' : 'Good, try again';
    } else {
        feedback = window.currentLanguage === 'ar' ? 'حاول مرة أخرى' : 'Try again';
    }
    
    document.getElementById('feedback').innerHTML = `
        <span class="score">${percentage}%</span>
        <span>${feedback}</span>
    `;
}

function calculateSimilarity(str1, str2) {
    // مقارنة بسيطة (في الواقع نستخدم خوارزمية أفضل)
    str1 = str1.toLowerCase().trim();
    str2 = str2.toLowerCase().trim();
    
    if (str1 === str2) return 1;
    
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    let matches = 0;
    
    words2.forEach(word => {
        if (words1.includes(word)) matches++;
    });
    
    return matches / Math.max(words1.length, words2.length);
}

function previousSentence() {
    if (currentSentenceIndex > 0) {
        currentSentenceIndex--;
        loadSpeakSection();
        document.getElementById('pronunciationResult').style.display = 'none';
    }
}

function nextSentence() {
    if (currentSentenceIndex < sceneData.speakSentences.length - 1) {
        currentSentenceIndex++;
        loadSpeakSection();
        document.getElementById('pronunciationResult').style.display = 'none';
    }
}

// التنقل بين التبويبات
function switchTab(tabId) {
    // إزالة active من كل التبويبات
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // تفعيل التبويب المختار
    document.getElementById(`tab${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`).classList.add('active');
    document.getElementById(`${tabId}Tab`).classList.add('active');
    
    // إذا كان تبويب النطق، حمل الجمل
    if (tabId === 'speak') {
        loadSpeakSection();
    }
}

// دوال مساعدة
function showNotification(message) {
    // TODO: تنفيذ نظام إشعارات جميل
    alert(message);
}

function playAudio(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
}