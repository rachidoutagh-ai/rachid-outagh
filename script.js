// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.padding = '10px 50px';
        navbar.style.background = 'rgba(5, 5, 5, 0.9)';
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
    } else {
        navbar.style.padding = '20px 50px';
        navbar.style.background = 'transparent';
        navbar.style.boxShadow = 'none';
        navbar.style.backdropFilter = 'blur(12px)';
    }
});

// Hover effects for cards (3D tilt effect - simplified)
const cards = document.querySelectorAll('.module-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
    });
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        item.classList.toggle('active');
    });
});

// Expanded Quiz Logic
const quizData = [
    {
        question: "Qu'est-ce que le Phishing ?",
        options: ["Un virus informatique", "Une technique de fraude par email", "Un logiciel antivirus"],
        correct: 1
    },
    {
        question: "Que signifie CIA en sécurité ?",
        options: ["Central Intelligence Agency", "Confidentialité, Intégrité, Disponibilité", "Control Internal Access"],
        correct: 1
    },
    {
        question: "Quel outil est utilisé pour l'analyse réseau ?",
        options: ["Photoshop", "Wireshark", "Word"],
        correct: 1
    },
    {
        question: "Quelle est la meilleure pratique pour les mots de passe ?",
        options: ["Utiliser '123456'", "Utiliser le même partout", "Utiliser un gestionnaire de mots de passe"],
        correct: 2
    }
];

let currentQuestion = 0;
let score = 0;

function loadQuiz() {
    const quizBox = document.querySelector('.quiz-box');
    if (!quizBox) return;

    if (currentQuestion < quizData.length) {
        const data = quizData[currentQuestion];
        quizBox.innerHTML = `
            <div class="question">
                <div style="margin-bottom: 15px; color: var(--accent-color);">Question ${currentQuestion + 1}/${quizData.length}</div>
                <h4>${data.question}</h4>
                <div class="options">
                    ${data.options.map((opt, index) => `
                        <button class="option" onclick="selectOption(${index})">${opt}</button>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        quizBox.innerHTML = `
            <div class="question" style="text-align: center;">
                <i class="fas fa-trophy fa-3x" style="color: var(--accent-color); margin-bottom: 20px;"></i>
                <h4>Quiz Terminé !</h4>
                <p>Votre score : ${score}/${quizData.length}</p>
                <button class="cta-button" onclick="resetQuiz()" style="margin-top: 20px;">Recommencer</button>
            </div>
        `;
    }
}

function selectOption(index) {
    const correct = quizData[currentQuestion].correct;
    const options = document.querySelectorAll('.option');

    options.forEach(opt => opt.style.pointerEvents = 'none'); // Disable clicks

    if (index === correct) {
        options[index].classList.add('correct');
        score++;
    } else {
        options[index].classList.add('wrong');
        options[correct].classList.add('correct');
    }

    setTimeout(() => {
        currentQuestion++;
        loadQuiz();
    }, 1500);
}

function resetQuiz() {
    currentQuestion = 0;
    score = 0;
    loadQuiz();
}

// Initial Load of Quiz
document.addEventListener('DOMContentLoaded', loadQuiz);

// Modal Interaction (Keep at bottom)
const modalOverlay = document.getElementById('modal-overlay');
const modalContainer = document.querySelector('.modal-container');
const modalTitle = document.getElementById('modal-title');
const modalBodyContent = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('close-modal');
const contentStorage = document.getElementById('content-storage');
const moduleButtons = document.querySelectorAll('.read-more');

function openModal(moduleId, title) {
    if (!contentStorage) return;
    const contentElement = contentStorage.querySelector(`[data-id="${moduleId}"]`);
    if (contentElement) {
        const content = contentElement.innerHTML;
        modalTitle.textContent = title;
        modalBodyContent.innerHTML = content;

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Add click listeners to module buttons
if (moduleButtons) {
    moduleButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const moduleCard = btn.closest('.module-card');
            const title = moduleCard.querySelector('h3').textContent;
            const moduleId = btn.getAttribute('data-id');
            openModal(moduleId, title);
        });
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

// Close on click outside
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});

// Password Strength Checker
const passwordInput = document.getElementById('password-input');
const strengthBar = document.getElementById('strength-bar');
const passwordFeedback = document.getElementById('password-feedback');
const togglePasswordBtn = document.getElementById('toggle-password');

if (passwordInput) {
    passwordInput.addEventListener('input', function () {
        const password = this.value;
        const strength = calculateStrength(password);
        updateStrengthMeter(strength);
    });

    togglePasswordBtn.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });
}

function calculateStrength(password) {
    let score = 0;
    if (!password) return 0;

    if (password.length > 8) score += 20;
    if (password.length > 12) score += 20;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 20;
    if (/[^A-Za-z0-9]/.test(password)) score += 20;

    return Math.min(score, 100);
}

function updateStrengthMeter(strength) {
    strengthBar.style.width = `${strength}%`;

    // Remove old classes
    strengthBar.className = 'strength-bar';

    if (strength < 40) {
        strengthBar.classList.add('strength-weak');
        passwordFeedback.textContent = "Faible : Trop court ou trop simple.";
        passwordFeedback.style.color = "#ff453a";
    } else if (strength < 80) {
        strengthBar.classList.add('strength-medium');
        passwordFeedback.textContent = "Moyen : Ajoutez des symboles ou des chiffres.";
        passwordFeedback.style.color = "#ffd60a";
    } else {
        strengthBar.classList.add('strength-strong');
        passwordFeedback.textContent = "Fort : Excellent mot de passe !";
        passwordFeedback.style.color = "#00ff88";
    }

    if (strength === 0) {
        passwordFeedback.textContent = "Entrez un mot de passe pour commencer.";
        passwordFeedback.style.color = "var(--text-secondary)";
    }
}
