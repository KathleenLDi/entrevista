// Navegação da miniapresentação.
const slides = [...document.querySelectorAll('.slide')];
const slideDots = document.getElementById('slide-dots');
const previousSlideButton = document.getElementById('prev-slide');
const nextSlideButton = document.getElementById('next-slide');
let currentSlide = 0;

slides.forEach((slide, index) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.setAttribute('aria-label', `Mostrar etapa ${index + 1}`);
  dot.addEventListener('click', () => showSlide(index));
  slideDots.appendChild(dot);
});

function showSlide(index) {
  currentSlide = Math.max(0, Math.min(index, slides.length - 1));
  slides.forEach((slide, position) => {
    const active = position === currentSlide;
    slide.hidden = !active;
    slide.classList.toggle('is-active', active);
  });
  [...slideDots.children].forEach((dot, position) => {
    dot.classList.toggle('active', position === currentSlide);
    dot.setAttribute('aria-current', String(position === currentSlide));
  });
  document.getElementById('slide-count').textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  previousSlideButton.disabled = currentSlide === 0;
  nextSlideButton.disabled = currentSlide === slides.length - 1;
}

previousSlideButton.addEventListener('click', () => showSlide(currentSlide - 1));
nextSlideButton.addEventListener('click', () => showSlide(currentSlide + 1));
showSlide(0);

// Quiz introdutório, com feedback por questão.
const questions = [
  { title: 'Qual destes itens é um hardware?', hint: 'Pense em algo que você consegue tocar.', options: ['Navegador', 'Teclado', 'Editor de texto', 'Sistema operacional'], correct: 1, explanation: 'O teclado é um equipamento físico utilizado para inserir dados.' },
  { title: 'Qual destes exemplos é um software?', hint: 'Procure um programa, não uma peça.', options: ['Monitor', 'Mouse', 'Navegador de internet', 'Memória RAM'], correct: 2, explanation: 'O navegador é um programa usado para acessar páginas da internet.' },
  { title: 'Para que serve a memória RAM?', hint: 'Ela auxilia o computador durante o uso de programas.', options: ['Imprimir documentos', 'Armazenar temporariamente dados em uso', 'Exibir imagens', 'Conectar o teclado'], correct: 1, explanation: 'A RAM guarda temporariamente informações necessárias aos programas em execução.' },
  { title: 'Qual destes é um dispositivo de saída?', hint: 'Ele apresenta informações para a pessoa.', options: ['Teclado', 'Mouse', 'Microfone', 'Monitor'], correct: 3, explanation: 'O monitor exibe informações visuais produzidas pelo computador.' },
  { title: 'O que acontece quando digitamos em um editor de texto?', hint: 'Pense no teclado, no programa e no monitor.', options: ['Somente o software participa', 'Somente o hardware participa', 'Hardware e software trabalham juntos', 'O computador dispensa programas'], correct: 2, explanation: 'O teclado envia dados, o editor de texto os processa e o monitor mostra o resultado.' }
];

let currentQuestion = 0;
let correctAnswers = 0;
let answered = false;
const answersElement = document.getElementById('answers');
const feedbackElement = document.getElementById('feedback');
const nextQuestionButton = document.getElementById('next-question');
const restartButton = document.getElementById('restart-quiz');

function renderQuestion() {
  const question = questions[currentQuestion];
  answered = false;
  document.getElementById('question-counter').textContent = `Questão ${currentQuestion + 1} de ${questions.length}`;
  document.getElementById('score').textContent = `${correctAnswers} acerto${correctAnswers === 1 ? '' : 's'}`;
  document.getElementById('progress-fill').style.width = `${(currentQuestion / questions.length) * 100}%`;
  document.getElementById('question-title').textContent = question.title;
  document.getElementById('question-hint').textContent = question.hint;
  answersElement.replaceChildren();
  feedbackElement.textContent = '';
  nextQuestionButton.hidden = true;
  restartButton.hidden = true;

  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = option;
    button.addEventListener('click', () => answerQuestion(index));
    answersElement.appendChild(button);
  });
}

function answerQuestion(selectedIndex) {
  if (answered) return;
  answered = true;
  const question = questions[currentQuestion];
  const isCorrect = selectedIndex === question.correct;
  if (isCorrect) correctAnswers += 1;
  [...answersElement.children].forEach((button, index) => {
    button.disabled = true;
    if (index === question.correct) button.classList.add('correct');
    if (index === selectedIndex && !isCorrect) button.classList.add('wrong');
  });
  feedbackElement.textContent = `${isCorrect ? 'Correto!' : 'Ainda não.'} ${question.explanation}`;
  document.getElementById('score').textContent = `${correctAnswers} acerto${correctAnswers === 1 ? '' : 's'}`;
  document.getElementById('progress-fill').style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  if (currentQuestion === questions.length - 1) {
    nextQuestionButton.hidden = true;
    restartButton.hidden = false;
    feedbackElement.textContent += ` Resultado final: ${correctAnswers} de ${questions.length} acertos.`;
  } else {
    nextQuestionButton.hidden = false;
  }
}

nextQuestionButton.addEventListener('click', () => {
  currentQuestion += 1;
  renderQuestion();
});
restartButton.addEventListener('click', () => {
  currentQuestion = 0;
  correctAnswers = 0;
  renderQuestion();
});
renderQuestion();
