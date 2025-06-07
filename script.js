const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const quizScreen = document.getElementById("quiz-screen");
const startScreen = document.getElementById("start-screen");
const resultScreen = document.getElementById("result-screen");
const questionBox = document.getElementById("question-box");
const optionBox = document.getElementById("option-box");
const categorySelect = document.getElementById("category-select");
const progress = document.getElementById("progress");
const feedback = document.getElementById("feedback");
const questionNumber = document.getElementById("question-number");
const totalQuestions = document.getElementById("total-questions");

let currentIndex = 0;
let score = 0;
let quizQuestions = [];
let timer;
let timeLeft = 120;

startBtn.addEventListener("click", () => {
    const category = categorySelect.value;

    if (!category) {
        alert("Please select one category!");
        return;
    }

    quizQuestions = questions.filter(q => q.category === category);
    quizQuestions = quizQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);

    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    totalQuestions.innerText = quizQuestions.length;
    updateProgress();
    showQuestion();
});

function showQuestion() {
    clearInterval(timer);
    timeLeft = 120;
    document.getElementById("time").innerText = timeLeft;
    feedback.innerText = "";
    feedback.className = "mt-4 text-lg font-semibold";
    questionNumber.innerText = currentIndex + 1;
    
    const q = quizQuestions[currentIndex];
    questionBox.innerText = q.question;
    
    optionBox.innerHTML = "";
    q.options.forEach(option => {
        const btn = document.createElement("button");
        btn.innerText = option;
        btn.className = "w-full p-4 bg-gray-100 border-2 border-gray-300 rounded-lg text-gray-800 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition transform hover:scale-105";
        btn.addEventListener("click", () => {
            clearInterval(timer);
            if (option === q.answer) {
                score++;
                feedback.innerText = "Correct!";
                feedback.className = "mt-4 text-lg font-semibold text-green-500 animate-pulse-slow";
            } else {
                feedback.innerText = `Incorrect! Correct answer: ${q.answer}`;
                feedback.className = "mt-4 text-lg font-semibold text-red-500 animate-pulse-slow";
            }
            setTimeout(nextQuestion, 12000);
        });
        optionBox.appendChild(btn);
    });

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("time").innerText = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timer);
            feedback.innerText = "Time's up!";
            feedback.className = "mt-4 text-lg font-semibold text-red-500 animate-pulse-slow";
            setTimeout(nextQuestion, 1000);
        }
    }, 1000);
}

function updateProgress() {
    const progressPercent = ((currentIndex + 1) / quizQuestions.length) * 100;
    progress.style.width = `${progressPercent}%`;
}

function nextQuestion() {
    currentIndex++;
    if (currentIndex < quizQuestions.length) {
        updateProgress();
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    clearInterval(timer);
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");
    document.getElementById("score").innerText = `${score}/${quizQuestions.length}`;

    let oldScores = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    oldScores.push(score);
    oldScores = oldScores.sort((a, b) => b - a).slice(0, 5);
    localStorage.setItem("leaderboard", JSON.stringify(oldScores));

    const leaderboard = document.getElementById("leaderboard");
    leaderboard.innerHTML = "";
    oldScores.forEach((s, i) => {
        const li = document.createElement("li");
        li.innerText = `#${i + 1} - ${s} points`;
        li.className = "p-3 bg-gray-100 rounded-lg text-gray-800";
        leaderboard.appendChild(li);
    });

    // Ensure reset button listener is added only once
    resetBtn.removeEventListener("click", resetLeaderboard); // Prevent multiple listeners
    resetBtn.addEventListener("click", resetLeaderboard);
}

function resetLeaderboard() {
    localStorage.removeItem("leaderboard");
    const leaderboard = document.getElementById("leaderboard");
    leaderboard.innerHTML = "<li class='p-3 bg-gray-100 rounded-lg text-gray-800'>No scores yet</li>";
}