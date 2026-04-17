/* ============================================================
   MASTER CHESS - Main Application Controller
   Ties together all modules: Board, Chapters, Puzzles, AI
   ============================================================ */

// ============ PROGRESS TRACKER ============
class ProgressTracker {
  constructor() {
    this.data = this._load();
  }

  _load() {
    try {
      const d = JSON.parse(localStorage.getItem('masterchess_progress'));
      return d || this._default();
    } catch { return this._default(); }
  }

  _default() {
    return {
      completedLessons: [],
      completedChapters: [],
      currentChapter: 1,
      currentLesson: '1-1',
      puzzlesSolved: 0,
      puzzlesAttempted: 0,
      puzzleStreak: 0,
      bestStreak: 0,
      gamesPlayed: 0,
      gamesWon: 0,
      totalMoves: 0,
      solvedPuzzleIds: [],
      xp: 0
    };
  }

  save() {
    localStorage.setItem('masterchess_progress', JSON.stringify(this.data));
  }

  completeLesson(lessonId) {
    if (!this.data.completedLessons.includes(lessonId)) {
      this.data.completedLessons.push(lessonId);
      this.data.xp += 50;
      this.save();
    }
  }

  completeChapter(chapterId) {
    if (!this.data.completedChapters.includes(chapterId)) {
      this.data.completedChapters.push(chapterId);
      this.data.xp += 200;
      this.save();
    }
  }

  isLessonComplete(id) { return this.data.completedLessons.includes(id); }
  isChapterComplete(id) { return this.data.completedChapters.includes(id); }
  isChapterUnlocked(id) { return id <= this.data.currentChapter + 1 || id <= 1 || this.data.completedChapters.includes(id - 1); }

  solvePuzzle(puzzleId) {
    this.data.puzzlesSolved++;
    this.data.puzzlesAttempted++;
    this.data.puzzleStreak++;
    this.data.xp += 30;
    if (this.data.puzzleStreak > this.data.bestStreak) this.data.bestStreak = this.data.puzzleStreak;
    if (!this.data.solvedPuzzleIds.includes(puzzleId)) this.data.solvedPuzzleIds.push(puzzleId);
    this.save();
  }

  failPuzzle() {
    this.data.puzzlesAttempted++;
    this.data.puzzleStreak = 0;
    this.save();
  }

  recordGame(won) {
    this.data.gamesPlayed++;
    if (won) { this.data.gamesWon++; this.data.xp += 100; }
    this.save();
  }

  getAccuracy() {
    if (this.data.puzzlesAttempted === 0) return 0;
    return Math.round((this.data.puzzlesSolved / this.data.puzzlesAttempted) * 100);
  }

  getChapterProgress(chapterId) {
    const chapter = CHAPTERS.find(c => c.id === chapterId);
    if (!chapter) return 0;
    const done = chapter.lessons.filter(l => this.data.completedLessons.includes(l.id)).length;
    return Math.round((done / chapter.lessons.length) * 100);
  }

  reset() {
    this.data = this._default();
    this.save();
  }
}

// ============ TOAST SYSTEM ============
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.innerHTML = `<span>${icons[type] || '💬'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3000);
}

// ============ CONFETTI ============
function showConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);
  const colors = ['#7c3aed', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#f472b6', '#fbbf24'];
  for (let i = 0; i < 60; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + '%';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDuration = (1.5 + Math.random() * 2) + 's';
    c.style.animationDelay = Math.random() * 0.5 + 's';
    c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    c.style.width = (5 + Math.random() * 10) + 'px';
    c.style.height = (5 + Math.random() * 10) + 'px';
    container.appendChild(c);
  }
  setTimeout(() => container.remove(), 4000);
}

// ============ MODAL ============
function showModal(icon, title, text, actions = []) {
  const existing = document.querySelector('.modal-overlay');
  if (existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  let actionsHtml = actions.map(a =>
    `<button class="${a.primary ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}" id="${a.id}">${a.label}</button>`
  ).join('');
  overlay.innerHTML = `<div class="modal-content">
    <div class="modal-icon">${icon}</div>
    <h3 class="modal-title">${title}</h3>
    <p class="modal-text">${text}</p>
    <div class="modal-actions">${actionsHtml}</div>
  </div>`;
  document.body.appendChild(overlay);
  actions.forEach(a => {
    const btn = document.getElementById(a.id);
    if (btn) btn.addEventListener('click', () => { overlay.remove(); if (a.onClick) a.onClick(); });
  });
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

// ============ MAIN APP CLASS ============
class MasterChessApp {
  constructor() {
    this.progress = new ProgressTracker();
    this.ai = new ChessAI(1);
    this.currentView = 'story';
    this.storyBoard = null;
    this.puzzleBoard = null;
    this.playBoard = null;
    this.currentChapter = 0;
    this.currentLessonIdx = 0;
    this.currentPuzzleIdx = 0;
    this.filteredPuzzles = [...PUZZLES];
    this.playGame = null;
    this.playerColor = 'w';
    this.aiDifficulty = 1;
    this.timeControl = 600;
    this.whiteTime = 600;
    this.blackTime = 600;
    this.timerInterval = null;
    this.gameActive = false;
    this.theme = localStorage.getItem('masterchess_theme') || 'dark';

    this._init();
  }

  _init() {
    // Set theme
    document.documentElement.setAttribute('data-theme', this.theme);
    this._updateThemeIcon();

    // Landing page animations
    this._createFloatingPieces();

    // Event listeners
    document.getElementById('start-journey-btn').addEventListener('click', () => this._enterApp('story'));
    document.getElementById('quick-play-btn').addEventListener('click', () => this._enterApp('play'));
    document.getElementById('logo-home').addEventListener('click', () => this._goHome());
    document.getElementById('theme-toggle').addEventListener('click', () => this._toggleTheme());
    document.getElementById('sound-toggle').addEventListener('click', () => this._toggleSound());

    // Nav
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => this._switchView(btn.dataset.view));
    });

    // Puzzle controls
    document.getElementById('puzzle-hint-btn').addEventListener('click', () => this._showPuzzleHint());
    document.getElementById('puzzle-retry-btn').addEventListener('click', () => this._retryPuzzle());
    document.getElementById('puzzle-next-btn').addEventListener('click', () => this._nextPuzzle());
    document.querySelectorAll('#puzzle-filters .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => this._filterPuzzles(btn.dataset.filter));
    });

    // Play controls
    document.getElementById('new-game-btn').addEventListener('click', () => this._startNewGame());
    document.getElementById('play-flip-btn').addEventListener('click', () => { if (this.playBoard) this.playBoard.flip(); });
    document.getElementById('play-undo-btn').addEventListener('click', () => this._undoPlayMove());
    document.getElementById('play-resign-btn').addEventListener('click', () => this._resignGame());
    document.querySelectorAll('#difficulty-options .option-btn').forEach(btn => {
      btn.addEventListener('click', () => this._selectOption('difficulty-options', btn, () => { this.aiDifficulty = parseInt(btn.dataset.difficulty); }));
    });
    document.querySelectorAll('#time-options .option-btn').forEach(btn => {
      btn.addEventListener('click', () => this._selectOption('time-options', btn, () => { this.timeControl = parseInt(btn.dataset.time); }));
    });
    document.querySelectorAll('#color-options .option-btn').forEach(btn => {
      btn.addEventListener('click', () => this._selectOption('color-options', btn, () => { this.playerColor = btn.dataset.color; }));
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        const modal = document.querySelector('.modal-overlay');
        if (modal) modal.remove();
      }
    });
  }

  // ---- Landing Page ----
  _createFloatingPieces() {
    const container = document.getElementById('bg-pieces');
    if (!container) return;
    const pieces = ['♔','♕','♖','♗','♘','♙','♚','♛','♜','♝','♞','♟'];
    for (let i = 0; i < 20; i++) {
      const span = document.createElement('span');
      span.className = 'floating-piece';
      span.textContent = pieces[Math.floor(Math.random() * pieces.length)];
      span.style.left = Math.random() * 100 + '%';
      span.style.fontSize = (1.5 + Math.random() * 3) + 'rem';
      span.style.animationDuration = (15 + Math.random() * 25) + 's';
      span.style.animationDelay = Math.random() * 10 + 's';
      container.appendChild(span);
    }
  }

  _enterApp(view) {
    Sound.init();
    Sound.playClick();
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    this._switchView(view);
  }

  _goHome() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    document.getElementById('app-container').classList.add('hidden');
    document.getElementById('landing-page').classList.remove('hidden');
  }

  // ---- Theme ----
  _toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('masterchess_theme', this.theme);
    this._updateThemeIcon();
    Sound.playClick();
  }

  _updateThemeIcon() {
    const btn = document.getElementById('theme-toggle');
    btn.textContent = this.theme === 'dark' ? '☀️' : '🌙';
  }

  _toggleSound() {
    const enabled = Sound.toggle();
    document.getElementById('sound-toggle').textContent = enabled ? '🔊' : '🔇';
    if (enabled) Sound.playClick();
  }

  // ---- Navigation ----
  _switchView(view) {
    this.currentView = view;
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(view + '-view');
    if (target) {
      target.classList.add('active');
    } else {
      console.warn('View not found:', view + '-view');
    }

    // Initialize views with error handling
    try {
      if (view === 'story') this._initStoryMode();
      if (view === 'puzzles') this._initPuzzleMode();
      if (view === 'play') this._initPlayMode();
      if (view === 'progress') this._renderProgress();
    } catch (e) {
      console.error('Error initializing view:', view, e);
    }
  }

  _selectOption(groupId, activeBtn, callback) {
    document.querySelectorAll(`#${groupId} .option-btn`).forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');
    Sound.playClick();
    if (callback) callback();
  }

  // ============ STORY MODE ============
  _initStoryMode() {
    this._renderChapterList();
    if (!this.currentChapter) this.currentChapter = 0;
    this._loadLesson(this.currentChapter, this.currentLessonIdx);
  }

  _renderChapterList() {
    const list = document.getElementById('chapter-list');
    list.innerHTML = '';
    CHAPTERS.forEach((ch, idx) => {
      const unlocked = this.progress.isChapterUnlocked(ch.id);
      const completed = this.progress.isChapterComplete(ch.id);
      const active = idx === this.currentChapter;

      const div = document.createElement('div');
      div.className = `chapter-item${active ? ' active' : ''}${completed ? ' completed' : ''}${!unlocked ? ' locked' : ''}`;

      div.innerHTML = `
        <div class="chapter-icon">${completed ? '✓' : ch.icon}</div>
        <div class="chapter-info">
          <div class="chapter-name">${ch.title}</div>
          <div class="chapter-status">${completed ? 'Completed' : (unlocked ? `${ch.lessons.length} lessons` : 'Locked')}</div>
        </div>
        ${!unlocked ? '<span class="chapter-lock">🔒</span>' : ''}`;

      if (unlocked) {
        div.addEventListener('click', () => {
          this.currentChapter = idx;
          this.currentLessonIdx = 0;
          this._renderChapterList();
          this._loadLesson(idx, 0);
          Sound.playClick();
        });
      }
      list.appendChild(div);
    });
  }

  _loadLesson(chapterIdx, lessonIdx) {
    const chapter = CHAPTERS[chapterIdx];
    if (!chapter) return;
    const lesson = chapter.lessons[lessonIdx];
    if (!lesson) return;

    this.currentChapter = chapterIdx;
    this.currentLessonIdx = lessonIdx;
    const container = document.getElementById('lesson-container');

    // Reset task progress for explore tasks
    if (lesson.task && lesson.task.type === 'explore') {
      lesson.task.progress = 0;
    }

    const isComplete = this.progress.isLessonComplete(lesson.id);
    const totalLessons = chapter.lessons.length;
    const progressPct = ((lessonIdx) / totalLessons) * 100;

    container.innerHTML = `
      <div class="lesson-header">
        <div class="lesson-chapter-badge">📖 Chapter ${chapter.id} · Lesson ${lessonIdx + 1}/${totalLessons}</div>
        <h2 class="lesson-title">${lesson.title}</h2>
        <p class="lesson-description">${chapter.description}</p>
      </div>

      <div class="lesson-body">
        <div>
          <div class="lesson-narrative">
            <div class="narrative-content">${lesson.narrative}</div>
          </div>
          <div class="task-card">
            <div class="task-card-header">
              <span class="task-icon">🎯</span> Task
            </div>
            <p class="task-description">${lesson.task.description}</p>
            <div class="task-feedback" id="task-feedback"></div>
          </div>
        </div>

        <div class="board-container">
          <div class="board-wrapper">
            <div class="chess-board" id="story-board"></div>
          </div>
          <div class="board-status" id="story-status">Complete the task above</div>
          <div class="board-controls">
            <button class="btn-icon" id="story-reset-btn" data-tooltip="Reset Position">🔄</button>
            <button class="btn-icon" id="story-hint-btn" data-tooltip="Show Hint">💡</button>
          </div>
        </div>
      </div>

      <div class="lesson-nav">
        <button class="btn-secondary btn-sm" id="lesson-prev-btn" ${lessonIdx === 0 && chapterIdx === 0 ? 'disabled style="opacity:0.3"' : ''}>← Previous</button>
        <div class="lesson-progress-bar">
          <div class="lesson-progress-fill" style="width: ${progressPct}%"></div>
        </div>
        <button class="btn-primary btn-sm" id="lesson-next-btn">${lessonIdx < totalLessons - 1 ? 'Next →' : (chapterIdx < CHAPTERS.length - 1 ? 'Next Chapter →' : 'Complete! 🎉')}</button>
      </div>`;

    // Init board
    this.storyBoard = new ChessBoard('story-board', {
      interactive: true,
      playerColor: 'both',
      showCoords: true,
      onMove: (move) => this._handleStoryMove(move, lesson),
      onSelect: (sq) => this._handleStorySelect(sq, lesson)
    });
    this.storyBoard.loadFen(lesson.fen);

    // Apply task-specific allowed moves
    if (lesson.task.type === 'move' && lesson.task.from && lesson.task.to) {
      this.storyBoard.setAllowedMoves([{ from: lesson.task.from, to: lesson.task.to }]);
    } else if (lesson.task.type === 'move' && lesson.task.from && !lesson.task.to) {
      // Allow any move from that square
      this.storyBoard.setAllowedMoves(null);
    } else if (lesson.task.type === 'checkmate' && lesson.task.from && lesson.task.to) {
      this.storyBoard.setAllowedMoves([{ from: lesson.task.from, to: lesson.task.to }]);
    }

    // Event listeners
    document.getElementById('story-reset-btn').addEventListener('click', () => {
      this.storyBoard.loadFen(lesson.fen);
      if (lesson.task.type === 'explore') lesson.task.progress = 0;
      document.getElementById('task-feedback').className = 'task-feedback';
      document.getElementById('task-feedback').textContent = '';
      document.getElementById('story-status').textContent = 'Complete the task above';
    });

    document.getElementById('story-hint-btn').addEventListener('click', () => {
      if (lesson.task.from) {
        this.storyBoard.setHint(lesson.task.to ? [lesson.task.from, lesson.task.to] : [lesson.task.from]);
        showToast('Highlighted squares show where to look!', 'info');
      } else if (lesson.task.targetSquare) {
        this.storyBoard.setHint([lesson.task.targetSquare]);
      } else {
        showToast('Explore the board and complete the task!', 'info');
      }
    });

    document.getElementById('lesson-prev-btn').addEventListener('click', () => {
      if (lessonIdx > 0) {
        this._loadLesson(chapterIdx, lessonIdx - 1);
      } else if (chapterIdx > 0) {
        const prevChapter = CHAPTERS[chapterIdx - 1];
        this._loadLesson(chapterIdx - 1, prevChapter.lessons.length - 1);
      }
      Sound.playClick();
    });

    document.getElementById('lesson-next-btn').addEventListener('click', () => {
      if (lessonIdx < totalLessons - 1) {
        this._loadLesson(chapterIdx, lessonIdx + 1);
      } else if (chapterIdx < CHAPTERS.length - 1) {
        this.progress.completeChapter(chapter.id);
        this.progress.data.currentChapter = chapterIdx + 1;
        this.progress.save();
        this.currentChapter = chapterIdx + 1;
        this.currentLessonIdx = 0;
        this._renderChapterList();
        this._loadLesson(chapterIdx + 1, 0);
        showConfetti();
        Sound.playLevelUp();
        showToast(`Chapter ${chapter.id} completed! 🎉`, 'success');
      }
      Sound.playClick();
    });

    this._renderChapterList();
  }

  _handleStoryMove(move, lesson) {
    const fb = document.getElementById('task-feedback');
    const status = document.getElementById('story-status');
    const task = lesson.task;

    if (task.type === 'move') {
      if (task.to && move.to === task.to && move.from === task.from) {
        fb.className = 'task-feedback success';
        fb.innerHTML = '✅ Correct! Well done!';
        status.textContent = 'Task completed! ✓';
        this.progress.completeLesson(lesson.id);
        Sound.playSuccess();
      } else if (!task.to && move.from === task.from) {
        fb.className = 'task-feedback success';
        fb.innerHTML = '✅ Great move! You understand how this piece moves.';
        status.textContent = 'Task completed! ✓';
        this.progress.completeLesson(lesson.id);
        Sound.playSuccess();
      }
    } else if (task.type === 'checkmate') {
      if (this.storyBoard.getGame().in_checkmate()) {
        fb.className = 'task-feedback success';
        fb.innerHTML = '🎉 Checkmate! Brilliant!';
        status.textContent = 'Checkmate! ✓';
        this.progress.completeLesson(lesson.id);
        Sound.playSuccess();
        showConfetti();
      } else if (move.from === task.from) {
        fb.className = 'task-feedback info';
        fb.innerHTML = '💡 Close, but that\'s not checkmate. Try again!';
      }
    } else if (task.type === 'check') {
      if (this.storyBoard.getGame().in_check()) {
        fb.className = 'task-feedback success';
        fb.innerHTML = '✅ Check! The King is under attack!';
        status.textContent = 'Task completed! ✓';
        this.progress.completeLesson(lesson.id);
        Sound.playSuccess();
      }
    }
  }

  _handleStorySelect(sq, lesson) {
    const fb = document.getElementById('task-feedback');
    const status = document.getElementById('story-status');
    const task = lesson.task;

    if (task.type === 'identify') {
      if (sq === task.targetSquare) {
        fb.className = 'task-feedback success';
        fb.innerHTML = `✅ Correct! You found the ${task.pieceName}!`;
        status.textContent = 'Task completed! ✓';
        this.progress.completeLesson(lesson.id);
        Sound.playSuccess();
      } else {
        fb.className = 'task-feedback error';
        fb.innerHTML = `❌ That's not the ${task.pieceName}. Try again!`;
      }
    } else if (task.type === 'explore') {
      task.progress = (task.progress || 0) + 1;
      status.textContent = `Explored ${task.progress}/${task.target} squares`;
      if (task.progress >= task.target) {
        fb.className = 'task-feedback success';
        fb.innerHTML = '✅ Great exploration! You\'re learning the board!';
        status.textContent = 'Task completed! ✓';
        this.progress.completeLesson(lesson.id);
        Sound.playSuccess();
      }
    }
  }

  // ============ PUZZLE MODE ============
  _initPuzzleMode() {
    console.log('MasterChess: Initializing Puzzle Mode');
    const container = document.getElementById('puzzles-view');
    if (!container) return;

    if (!PUZZLES || PUZZLES.length === 0) {
      console.error('MasterChess: PUZZLES array is empty or undefined');
      container.innerHTML = `<div style="padding: 3rem; text-align: center; color: var(--accent-gold);">
        <h2>Chess Puzzles Unavailable</h2>
        <p>There was an error loading the puzzle database.</p>
      </div>`;
      return;
    }

    this.filteredPuzzles = [...PUZZLES];
    this.currentPuzzleIdx = 0;
    this._loadPuzzle(0);
    this._updatePuzzleStats();
  }

  _filterPuzzles(filter) {
    document.querySelectorAll('#puzzle-filters .filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
    this.filteredPuzzles = filter === 'all' ? [...PUZZLES] : PUZZLES.filter(p => p.category === filter);
    this.currentPuzzleIdx = 0;
    this._loadPuzzle(0);
    Sound.playClick();
  }

  _loadPuzzle(idx) {
    if (idx < 0 || idx >= this.filteredPuzzles.length) return;
    this.currentPuzzleIdx = idx;
    const puzzle = this.filteredPuzzles[idx];

    document.getElementById('puzzle-counter').textContent = `Puzzle ${idx + 1} / ${this.filteredPuzzles.length}`;
    document.getElementById('puzzle-title').textContent = puzzle.title;
    document.getElementById('puzzle-objective').textContent = puzzle.objective;

    // Difficulty stars
    const starsDiv = document.getElementById('puzzle-stars');
    starsDiv.innerHTML = '';
    for (let i = 1; i <= 3; i++) {
      const star = document.createElement('span');
      star.className = `star ${i <= puzzle.difficulty ? 'filled' : 'empty'}`;
      star.textContent = '★';
      starsDiv.appendChild(star);
    }

    // Reset hint and result
    document.getElementById('puzzle-hint').classList.remove('visible');
    document.getElementById('puzzle-result').className = 'puzzle-result';
    document.getElementById('puzzle-result').textContent = '';
    document.getElementById('puzzle-board-status').textContent = `${puzzle.playerColor === 'w' ? 'White' : 'Black'} to move — find the best move!`;

    // Init board
    this.puzzleBoard = new ChessBoard('puzzle-board', {
      interactive: true,
      playerColor: puzzle.playerColor,
      showCoords: true,
      flipped: puzzle.playerColor === 'b',
      onMove: (move) => this._handlePuzzleMove(move, puzzle)
    });
    this.puzzleBoard.loadFen(puzzle.fen);
    this._puzzleMoveIdx = 0;
  }

  _handlePuzzleMove(move, puzzle) {
    const moveStr = move.from + move.to;
    const expected = puzzle.solution[this._puzzleMoveIdx];

    // For puzzles with multiple acceptable first moves
    const isCorrect = Array.isArray(expected) ? expected.includes(moveStr) : moveStr === expected;

    if (isCorrect || (this._puzzleMoveIdx === 0 && puzzle.solution.includes(moveStr))) {
      this._puzzleMoveIdx++;

      // Check if puzzle is complete
      if (this._puzzleMoveIdx >= puzzle.solution.filter(m => m !== null).length) {
        // Puzzle solved!
        document.getElementById('puzzle-result').className = 'puzzle-result solved';
        document.getElementById('puzzle-result').textContent = '🎉 Brilliant! Puzzle solved!';
        document.getElementById('puzzle-board-status').textContent = 'Puzzle solved! ✓';
        this.puzzleBoard.setInteractive(false);
        this.progress.solvePuzzle(puzzle.id);
        this._updatePuzzleStats();
        Sound.playSuccess();
        showConfetti();
      } else {
        // Make opponent's response
        document.getElementById('puzzle-board-status').textContent = 'Correct! Opponent responds...';
        Sound.playMove();

        // Opponent's response (next null entry means auto)
        if (this._puzzleMoveIdx < puzzle.solution.length && puzzle.solution[this._puzzleMoveIdx] === null) {
          this._puzzleMoveIdx++;
          // AI responds
          setTimeout(() => {
            const game = this.puzzleBoard.getGame();
            const moves = game.moves({ verbose: true });
            if (moves.length > 0) {
              const aiMove = moves[Math.floor(Math.random() * moves.length)];
              game.move(aiMove);
              this.puzzleBoard.lastMove = { from: aiMove.from, to: aiMove.to };
              this.puzzleBoard.render();
              Sound.playMove();
              document.getElementById('puzzle-board-status').textContent = 'Your turn — find the next move!';
            }
          }, 600);
        }
      }
    } else {
      // Wrong move
      document.getElementById('puzzle-result').className = 'puzzle-result failed';
      document.getElementById('puzzle-result').textContent = '❌ Not quite. Try again!';
      document.getElementById('puzzle-board-status').textContent = 'Wrong move — try again!';
      this.progress.failPuzzle();
      this._updatePuzzleStats();
      Sound.playError();

      // Undo the wrong move after a short delay
      setTimeout(() => {
        this.puzzleBoard.undo();
        document.getElementById('puzzle-board-status').textContent = `${puzzle.playerColor === 'w' ? 'White' : 'Black'} to move — try again!`;
      }, 800);
    }
  }

  _showPuzzleHint() {
    const puzzle = this.filteredPuzzles[this.currentPuzzleIdx];
    if (!puzzle) return;
    const hintDiv = document.getElementById('puzzle-hint');
    document.getElementById('puzzle-hint-text').textContent = puzzle.hint;
    hintDiv.classList.add('visible');

    // Also highlight the source square
    if (puzzle.solution[0]) {
      const from = puzzle.solution[0].substring(0, 2);
      this.puzzleBoard.setHint([from]);
    }
    Sound.playClick();
  }

  _retryPuzzle() {
    this._loadPuzzle(this.currentPuzzleIdx);
    Sound.playClick();
  }

  _nextPuzzle() {
    const next = (this.currentPuzzleIdx + 1) % this.filteredPuzzles.length;
    this._loadPuzzle(next);
    Sound.playClick();
  }

  _updatePuzzleStats() {
    document.getElementById('puzzles-solved-count').textContent = this.progress.data.puzzlesSolved;
    document.getElementById('puzzles-streak-count').textContent = this.progress.data.puzzleStreak;
    document.getElementById('puzzles-accuracy').textContent = this.progress.getAccuracy() + '%';
  }

  // ============ PLAY MODE ============
  _initPlayMode() {
    if (!this.playBoard) {
      this.playBoard = new ChessBoard('play-board', {
        interactive: true,
        playerColor: 'w',
        showCoords: true,
        onMove: (move) => this._handlePlayMove(move)
      });
    }
  }

  _startNewGame() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    let color = this.playerColor;
    if (color === 'random') color = Math.random() < 0.5 ? 'w' : 'b';
    this.playerColor = color;

    this.ai.setDifficulty(this.aiDifficulty);
    this.gameActive = true;
    this.whiteTime = this.timeControl;
    this.blackTime = this.timeControl;

    this.playBoard = new ChessBoard('play-board', {
      interactive: true,
      playerColor: color,
      showCoords: true,
      flipped: color === 'b',
      onMove: (move) => this._handlePlayMove(move)
    });
    this.playBoard.reset();

    // Update UI
    document.getElementById('play-board-status').textContent = 'Your turn — White to move';
    document.getElementById('play-player-name').textContent = color === 'w' ? 'You (White)' : 'You (Black)';
    document.getElementById('play-opponent-name').textContent = color === 'w' ? 'ChessBot (Black)' : 'ChessBot (White)';
    document.getElementById('play-opponent-captured').textContent = '';
    document.getElementById('play-player-captured').textContent = '';
    document.getElementById('move-history').innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 1rem; font-size: 0.85rem;">Game started!</div>';

    this._updateTimers();
    if (this.timeControl > 0) this._startTimer();

    // If AI plays white (player is black), make AI move first
    if (color === 'b') {
      this.playBoard.setInteractive(false);
      setTimeout(() => this._makeAIMove(), 500);
    }

    Sound.playClick();
    showToast('New game started! Good luck!', 'info');
  }

  _handlePlayMove(move) {
    if (!this.gameActive) return;

    this._addMoveToHistory(move);
    this._updateCaptured();

    const game = this.playBoard.getGame();

    if (game.game_over()) {
      this._endGame(game);
      return;
    }

    // Update status
    document.getElementById('play-board-status').textContent = "Opponent's turn — thinking...";
    this.playBoard.setInteractive(false);

    // AI responds
    setTimeout(() => this._makeAIMove(), 300 + Math.random() * 500);
  }

  _makeAIMove() {
    if (!this.gameActive) return;
    const game = this.playBoard.getGame();
    const aiMove = this.ai.getBestMove(game);

    if (aiMove) {
      game.move(aiMove);
      this.playBoard.lastMove = { from: aiMove.from, to: aiMove.to };
      this.playBoard.selectedSquare = null;
      this.playBoard.legalMoves = [];
      this.playBoard.render();

      if (aiMove.captured) Sound.playCapture();
      else Sound.playMove();
      if (game.in_check()) Sound.playCheck();

      this._addMoveToHistory(aiMove);
      this._updateCaptured();

      if (game.game_over()) {
        this._endGame(game);
        return;
      }

      document.getElementById('play-board-status').textContent = 'Your turn!';
      this.playBoard.setInteractive(true);
    }
  }

  _addMoveToHistory(move) {
    const game = this.playBoard.getGame();
    const history = game.history();
    const histDiv = document.getElementById('move-history');

    let html = '';
    for (let i = 0; i < history.length; i += 2) {
      const moveNum = Math.floor(i / 2) + 1;
      const whiteMove = history[i] || '';
      const blackMove = history[i + 1] || '';
      const isCurrent = i === history.length - 1 || i + 1 === history.length - 1;
      html += `<div class="move-row">
        <span class="move-number">${moveNum}.</span>
        <span class="move-white ${i === history.length - 1 ? 'current' : ''}">${whiteMove}</span>
        <span class="move-black ${i + 1 === history.length - 1 ? 'current' : ''}">${blackMove}</span>
      </div>`;
    }
    histDiv.innerHTML = html || '<div style="text-align: center; color: var(--text-muted); padding: 1rem; font-size: 0.85rem;">No moves yet</div>';
    histDiv.scrollTop = histDiv.scrollHeight;
  }

  _updateCaptured() {
    const game = this.playBoard.getGame();
    const history = game.history({ verbose: true });
    const whiteCaptured = [], blackCaptured = [];

    history.forEach(m => {
      if (m.captured) {
        const key = (m.color === 'w' ? 'b' : 'w') + m.captured.toUpperCase();
        if (m.color === 'w') whiteCaptured.push(PIECE_UNICODE[key] || '');
        else blackCaptured.push(PIECE_UNICODE[key] || '');
      }
    });

    const playerIsWhite = this.playerColor === 'w';
    document.getElementById('play-player-captured').textContent = playerIsWhite ? whiteCaptured.join(' ') : blackCaptured.join(' ');
    document.getElementById('play-opponent-captured').textContent = playerIsWhite ? blackCaptured.join(' ') : whiteCaptured.join(' ');
  }

  _endGame(game) {
    this.gameActive = false;
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.playBoard.setInteractive(false);

    let title, text, icon;
    const playerTurn = this.playerColor;

    if (game.in_checkmate()) {
      const loser = game.turn();
      if (loser !== playerTurn) {
        title = 'Victory!';
        text = 'You delivered checkmate! Brilliant play!';
        icon = '🏆';
        this.progress.recordGame(true);
        showConfetti();
        Sound.playCheckmate();
      } else {
        title = 'Defeat';
        text = 'You were checkmated. Study the game and try again!';
        icon = '😔';
        this.progress.recordGame(false);
      }
    } else if (game.in_stalemate()) {
      title = 'Stalemate!';
      text = "It's a draw by stalemate. No legal moves available.";
      icon = '🤝';
      this.progress.recordGame(false);
    } else if (game.in_draw()) {
      title = 'Draw!';
      text = 'The game ended in a draw.';
      icon = '🤝';
      this.progress.recordGame(false);
    } else {
      title = 'Game Over';
      text = 'The game has ended.';
      icon = '🏁';
    }

    document.getElementById('play-board-status').textContent = title;

    showModal(icon, title, text, [
      { id: 'modal-new-game', label: '🎮 New Game', primary: true, onClick: () => this._startNewGame() },
      { id: 'modal-review', label: 'Review', onClick: () => {} }
    ]);
  }

  _undoPlayMove() {
    if (!this.playBoard || !this.gameActive) return;
    // Undo both player and AI move
    this.playBoard.undo();
    this.playBoard.undo();
    this._addMoveToHistory(null);
    Sound.playClick();
  }

  _resignGame() {
    if (!this.gameActive) return;
    showModal('🏳️', 'Resign?', 'Are you sure you want to resign this game?', [
      { id: 'modal-resign-yes', label: 'Resign', primary: false, onClick: () => {
        this.gameActive = false;
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.playBoard.setInteractive(false);
        this.progress.recordGame(false);
        document.getElementById('play-board-status').textContent = 'You resigned';
        showToast('Game over — you resigned.', 'info');
      }},
      { id: 'modal-resign-no', label: 'Continue Playing', primary: true, onClick: () => {} }
    ]);
  }

  // Timer
  _startTimer() {
    if (this.timeControl <= 0) return;
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (!this.gameActive) { clearInterval(this.timerInterval); return; }
      const game = this.playBoard.getGame();
      const turn = game.turn();

      if (turn === 'w') this.whiteTime--;
      else this.blackTime--;

      this._updateTimers();

      if (this.whiteTime <= 0 || this.blackTime <= 0) {
        clearInterval(this.timerInterval);
        this.gameActive = false;
        this.playBoard.setInteractive(false);
        const loser = this.whiteTime <= 0 ? 'w' : 'b';
        const playerWon = loser !== this.playerColor;
        this.progress.recordGame(playerWon);

        showModal(
          playerWon ? '🏆' : '⏰',
          playerWon ? 'Victory!' : 'Time\'s Up!',
          playerWon ? 'Your opponent ran out of time!' : 'You ran out of time!',
          [{ id: 'modal-ok', label: 'New Game', primary: true, onClick: () => this._startNewGame() }]
        );
      }
    }, 1000);
  }

  _updateTimers() {
    const formatTime = (s) => {
      if (s <= 0) return '0:00';
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return `${m}:${sec.toString().padStart(2, '0')}`;
    };
    const wTimer = document.getElementById('timer-white');
    const bTimer = document.getElementById('timer-black');

    if (this.timeControl <= 0) {
      wTimer.textContent = '∞';
      bTimer.textContent = '∞';
      wTimer.className = 'timer-clock';
      bTimer.className = 'timer-clock';
      return;
    }

    wTimer.textContent = formatTime(this.whiteTime);
    bTimer.textContent = formatTime(this.blackTime);

    const game = this.playBoard ? this.playBoard.getGame() : null;
    const turn = game ? game.turn() : 'w';
    wTimer.className = `timer-clock ${turn === 'w' && this.gameActive ? 'active' : ''} ${this.whiteTime <= 30 ? 'low-time' : ''}`;
    bTimer.className = `timer-clock ${turn === 'b' && this.gameActive ? 'active' : ''} ${this.blackTime <= 30 ? 'low-time' : ''}`;
  }

  // ============ PROGRESS VIEW ============
  _renderProgress() {
    const d = this.progress.data;

    // Overview cards
    const overview = document.getElementById('progress-overview');
    overview.innerHTML = `
      <div class="progress-card">
        <div class="progress-card-icon">⭐</div>
        <div class="progress-card-value">${d.xp}</div>
        <div class="progress-card-label">Total XP</div>
      </div>
      <div class="progress-card">
        <div class="progress-card-icon">📖</div>
        <div class="progress-card-value">${d.completedLessons.length}</div>
        <div class="progress-card-label">Lessons Done</div>
      </div>
      <div class="progress-card">
        <div class="progress-card-icon">🧩</div>
        <div class="progress-card-value">${d.puzzlesSolved}</div>
        <div class="progress-card-label">Puzzles Solved</div>
      </div>
      <div class="progress-card">
        <div class="progress-card-icon">⚔</div>
        <div class="progress-card-value">${d.gamesWon}/${d.gamesPlayed}</div>
        <div class="progress-card-label">Games Won</div>
      </div>
      <div class="progress-card">
        <div class="progress-card-icon">🔥</div>
        <div class="progress-card-value">${d.bestStreak}</div>
        <div class="progress-card-label">Best Streak</div>
      </div>
      <div class="progress-card">
        <div class="progress-card-icon">🎯</div>
        <div class="progress-card-value">${this.progress.getAccuracy()}%</div>
        <div class="progress-card-label">Puzzle Accuracy</div>
      </div>`;

    // Chapter progress
    const chaptersDiv = document.getElementById('progress-chapters');
    let chapHtml = '<h3>📖 Chapter Progress</h3>';
    CHAPTERS.forEach(ch => {
      const pct = this.progress.getChapterProgress(ch.id);
      const completed = this.progress.isChapterComplete(ch.id);
      chapHtml += `
        <div class="progress-chapter-item">
          <div class="progress-chapter-icon ${completed ? 'completed' : ''}">${completed ? '✓' : ch.icon}</div>
          <div class="progress-chapter-info">
            <div class="progress-chapter-name">Ch ${ch.id}: ${ch.title}</div>
            <div class="progress-chapter-bar">
              <div class="progress-chapter-fill" style="width: ${pct}%"></div>
            </div>
          </div>
          <div class="progress-chapter-percent">${pct}%</div>
        </div>`;
    });
    chaptersDiv.innerHTML = chapHtml;

    // Leaderboard (mock data)
    const lb = document.getElementById('leaderboard');
    const leaderboardData = [
      { name: 'GrandMaster_X', rating: 2450, puzzles: 342 },
      { name: 'ChessKnight99', rating: 2180, puzzles: 287 },
      { name: 'QueenGambit', rating: 1950, puzzles: 225 },
      { name: 'RookieNoMore', rating: 1820, puzzles: 198 },
      { name: 'You', rating: 1200 + d.xp, puzzles: d.puzzlesSolved, isUser: true },
      { name: 'PawnStar', rating: 1650, puzzles: 156 },
      { name: 'BishopPair', rating: 1540, puzzles: 134 },
      { name: 'KnightRider', rating: 1420, puzzles: 98 }
    ];
    leaderboardData.sort((a, b) => b.rating - a.rating);

    let lbHtml = '<h3>🏆 Leaderboard</h3>';
    leaderboardData.forEach((entry, i) => {
      const rankClass = i === 0 ? 'gold' : (i === 1 ? 'silver' : (i === 2 ? 'bronze' : ''));
      const medals = ['🥇', '🥈', '🥉'];
      lbHtml += `
        <div class="leaderboard-row ${entry.isUser ? 'current-user' : ''}">
          <span class="lb-rank ${rankClass}">${medals[i] || (i + 1)}</span>
          <span class="lb-name">${entry.name}</span>
          <span class="lb-rating">${entry.rating}</span>
          <span class="lb-puzzles">${entry.puzzles} 🧩</span>
        </div>`;
    });
    lb.innerHTML = lbHtml;
  }
}

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
  window.app = new MasterChessApp();
});
