/* ============================================================
   CHESSBOARD - Interactive Board Component
   ============================================================ */

// Piece Unicode mapping
const PIECE_UNICODE = {
  wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
  bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟'
};

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

class ChessBoard {
  /**
   * @param {string} containerId - DOM id of the .chess-board element
   * @param {object} options
   *   - interactive: boolean (allow moves)
   *   - flipped: boolean (black on bottom)
   *   - showCoords: boolean
   *   - playerColor: 'w' | 'b' | 'both' (who can move)
   *   - onMove: function(moveObj)
   *   - onSelect: function(square)
   *   - highlightSquares: string[] (squares to highlight)
   */
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('Board container not found:', containerId);
      return;
    }
    this.options = {
      interactive: true,
      flipped: false,
      showCoords: true,
      playerColor: 'both',
      onMove: null,
      onSelect: null,
      allowedMoves: null, // null = all legal, [] = none, [{from,to}] = specific
      ...options
    };

    this.game = new Chess();
    this.selectedSquare = null;
    this.legalMoves = [];
    this.lastMove = null;
    this.hintSquares = [];
    this.dragging = false;
    this.dragPiece = null;
    this.dragGhost = null;
    this.dragFrom = null;

    this._buildBoard();
    this.render();

    // Bind drag events at document level
    this._onMouseMove = this._handleMouseMove.bind(this);
    this._onMouseUp = this._handleMouseUp.bind(this);
    this._onTouchMove = this._handleTouchMove.bind(this);
    this._onTouchEnd = this._handleTouchEnd.bind(this);
  }

  // Build the 64 squares
  _buildBoard() {
    this.container.innerHTML = '';
    this.squares = {};

    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const ri = this.options.flipped ? 7 - r : r;
        const fi = this.options.flipped ? 7 - f : f;
        const file = FILES[fi];
        const rank = RANKS[ri];
        const sq = file + rank;
        const isLight = (fi + ri) % 2 === 0;

        const div = document.createElement('div');
        div.className = `square ${isLight ? 'light' : 'dark'}`;
        div.dataset.square = sq;

        // Coordinates
        if (this.options.showCoords) {
          if (f === 0) {
            const coordR = document.createElement('span');
            coordR.className = 'coord-rank';
            coordR.textContent = rank;
            div.appendChild(coordR);
          }
          if (r === 7) {
            const coordF = document.createElement('span');
            coordF.className = 'coord-file';
            coordF.textContent = file;
            div.appendChild(coordF);
          }
        }

        // Events
        div.addEventListener('mousedown', (e) => this._handleMouseDown(e, sq));
        div.addEventListener('touchstart', (e) => this._handleTouchStart(e, sq), { passive: false });

        this.container.appendChild(div);
        this.squares[sq] = div;
      }
    }
  }

  // Render pieces from current game state
  render() {
    const board = this.game.board();
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const sq = FILES[f] + RANKS[r];
        const div = this.squares[sq];
        if (!div) continue;

        // Remove existing piece
        const existingPiece = div.querySelector('.piece');
        if (existingPiece) existingPiece.remove();

        // Remove state classes
        div.classList.remove('selected', 'legal-move', 'legal-capture', 'last-move', 'check', 'hint');

        const piece = board[r][f];
        if (piece) {
          const key = piece.color + piece.type.toUpperCase();
          const span = document.createElement('span');
          span.className = `piece ${piece.color === 'w' ? 'white-piece' : 'black-piece'}`;
          span.textContent = PIECE_UNICODE[key];
          span.draggable = false; // We handle drag manually
          div.appendChild(span);
        }
      }
    }

    // Apply highlights
    this._applyHighlights();
  }

  _applyHighlights() {
    // Last move
    if (this.lastMove) {
      if (this.squares[this.lastMove.from]) this.squares[this.lastMove.from].classList.add('last-move');
      if (this.squares[this.lastMove.to]) this.squares[this.lastMove.to].classList.add('last-move');
    }

    // Selected square
    if (this.selectedSquare && this.squares[this.selectedSquare]) {
      this.squares[this.selectedSquare].classList.add('selected');
    }

    // Legal moves
    this.legalMoves.forEach(move => {
      const sq = this.squares[move.to];
      if (!sq) return;
      if (move.captured || move.flags.includes('e')) {
        sq.classList.add('legal-capture');
      } else {
        sq.classList.add('legal-move');
      }
    });

    // Check
    if (this.game.in_check()) {
      const turn = this.game.turn();
      const board = this.game.board();
      for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
          const p = board[r][f];
          if (p && p.type === 'k' && p.color === turn) {
            const sq = FILES[f] + RANKS[r];
            if (this.squares[sq]) this.squares[sq].classList.add('check');
          }
        }
      }
    }

    // Hint squares
    this.hintSquares.forEach(sq => {
      if (this.squares[sq]) this.squares[sq].classList.add('hint');
    });
  }

  // ---- Mouse/Touch Interaction ----

  _handleMouseDown(e, sq) {
    if (!this.options.interactive) return;
    e.preventDefault();

    const piece = this.game.get(sq);
    const turn = this.game.turn();

    // If a piece is selected and we click a legal move target
    if (this.selectedSquare && this.legalMoves.some(m => m.to === sq)) {
      this._makeMove(this.selectedSquare, sq);
      return;
    }

    // If clicking own piece, select it
    if (piece && piece.color === turn && this._canMove(piece.color)) {
      this.selectedSquare = sq;
      this.legalMoves = this._getLegalMovesFrom(sq);
      this.render();

      // Start drag
      this.dragging = true;
      this.dragFrom = sq;
      this._createGhost(e.clientX, e.clientY, piece);
      document.addEventListener('mousemove', this._onMouseMove);
      document.addEventListener('mouseup', this._onMouseUp);

      if (this.options.onSelect) this.options.onSelect(sq);
    } else {
      // Deselect
      this.selectedSquare = null;
      this.legalMoves = [];
      this.render();
    }
  }

  _handleMouseMove(e) {
    if (!this.dragging || !this.dragGhost) return;
    this.dragGhost.style.left = e.clientX + 'px';
    this.dragGhost.style.top = e.clientY + 'px';
  }

  _handleMouseUp(e) {
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);

    if (!this.dragging) return;
    this.dragging = false;
    this._removeGhost();

    // Find target square
    const target = this._getSquareAtPoint(e.clientX, e.clientY);
    if (target && this.dragFrom && target !== this.dragFrom) {
      if (this.legalMoves.some(m => m.to === target)) {
        this._makeMove(this.dragFrom, target);
      } else {
        this.selectedSquare = null;
        this.legalMoves = [];
        this.render();
      }
    }
    this.dragFrom = null;
  }

  _handleTouchStart(e, sq) {
    if (!this.options.interactive) return;
    e.preventDefault();

    const piece = this.game.get(sq);
    const turn = this.game.turn();

    if (this.selectedSquare && this.legalMoves.some(m => m.to === sq)) {
      this._makeMove(this.selectedSquare, sq);
      return;
    }

    if (piece && piece.color === turn && this._canMove(piece.color)) {
      this.selectedSquare = sq;
      this.legalMoves = this._getLegalMovesFrom(sq);
      this.render();

      const touch = e.touches[0];
      this.dragging = true;
      this.dragFrom = sq;
      this._createGhost(touch.clientX, touch.clientY, piece);
      document.addEventListener('touchmove', this._onTouchMove, { passive: false });
      document.addEventListener('touchend', this._onTouchEnd);

      if (this.options.onSelect) this.options.onSelect(sq);
    } else {
      this.selectedSquare = null;
      this.legalMoves = [];
      this.render();
    }
  }

  _handleTouchMove(e) {
    if (!this.dragging || !this.dragGhost) return;
    e.preventDefault();
    const touch = e.touches[0];
    this.dragGhost.style.left = touch.clientX + 'px';
    this.dragGhost.style.top = touch.clientY + 'px';
  }

  _handleTouchEnd(e) {
    document.removeEventListener('touchmove', this._onTouchMove);
    document.removeEventListener('touchend', this._onTouchEnd);

    if (!this.dragging) return;
    this.dragging = false;

    const touch = e.changedTouches[0];
    const target = this._getSquareAtPoint(touch.clientX, touch.clientY);
    this._removeGhost();

    if (target && this.dragFrom && target !== this.dragFrom) {
      if (this.legalMoves.some(m => m.to === target)) {
        this._makeMove(this.dragFrom, target);
      } else {
        this.selectedSquare = null;
        this.legalMoves = [];
        this.render();
      }
    }
    this.dragFrom = null;
  }

  _createGhost(x, y, piece) {
    this._removeGhost();
    const key = piece.color + piece.type.toUpperCase();
    const ghost = document.createElement('span');
    ghost.className = `piece-ghost ${piece.color === 'w' ? 'white-piece' : 'black-piece'}`;
    ghost.textContent = PIECE_UNICODE[key];
    ghost.style.left = x + 'px';
    ghost.style.top = y + 'px';
    document.body.appendChild(ghost);
    this.dragGhost = ghost;
  }

  _removeGhost() {
    if (this.dragGhost) {
      this.dragGhost.remove();
      this.dragGhost = null;
    }
  }

  _getSquareAtPoint(x, y) {
    const elements = document.elementsFromPoint(x, y);
    for (const el of elements) {
      if (el.dataset && el.dataset.square) return el.dataset.square;
    }
    return null;
  }

  // ---- Move Logic ----

  _canMove(color) {
    if (this.options.playerColor === 'both') return true;
    return this.options.playerColor === color;
  }

  _getLegalMovesFrom(sq) {
    let moves = this.game.moves({ square: sq, verbose: true });
    if (this.options.allowedMoves) {
      moves = moves.filter(m =>
        this.options.allowedMoves.some(am => am.from === m.from && am.to === m.to)
      );
    }
    return moves;
  }

  _makeMove(from, to) {
    // Check for promotion
    const piece = this.game.get(from);
    if (piece && piece.type === 'p') {
      const targetRank = to[1];
      if ((piece.color === 'w' && targetRank === '8') || (piece.color === 'b' && targetRank === '1')) {
        this._showPromotion(from, to);
        return;
      }
    }
    this._executeMove(from, to);
  }

  _executeMove(from, to, promotion = undefined) {
    const moveObj = this.game.move({ from, to, promotion: promotion || undefined });
    if (!moveObj) {
      Sound.playError();
      return null;
    }

    this.lastMove = { from, to };
    this.selectedSquare = null;
    this.legalMoves = [];
    this.render();

    // Sound
    if (this.game.in_checkmate()) {
      Sound.playCheckmate();
    } else if (this.game.in_check()) {
      Sound.playCheck();
    } else if (moveObj.captured) {
      Sound.playCapture();
    } else {
      Sound.playMove();
    }

    if (this.options.onMove) {
      this.options.onMove(moveObj);
    }

    return moveObj;
  }

  _showPromotion(from, to) {
    const color = this.game.turn();
    const overlay = document.createElement('div');
    overlay.className = 'promotion-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'promotion-dialog';

    const pieces = ['q', 'r', 'b', 'n'];
    pieces.forEach(p => {
      const key = color + p.toUpperCase();
      const btn = document.createElement('button');
      btn.className = 'promotion-choice';
      btn.textContent = PIECE_UNICODE[key];
      btn.addEventListener('click', () => {
        overlay.remove();
        this._executeMove(from, to, p);
      });
      dialog.appendChild(btn);
    });

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
        this.selectedSquare = null;
        this.legalMoves = [];
        this.render();
      }
    });
  }

  // ---- Public API ----

  loadFen(fen) {
    this.game.load(fen);
    this.selectedSquare = null;
    this.legalMoves = [];
    this.lastMove = null;
    this.hintSquares = [];
    this.render();
  }

  loadGame(chess) {
    this.game = chess;
    this.selectedSquare = null;
    this.legalMoves = [];
    this.lastMove = null;
    this.render();
  }

  reset() {
    this.game.reset();
    this.selectedSquare = null;
    this.legalMoves = [];
    this.lastMove = null;
    this.hintSquares = [];
    this.render();
  }

  undo() {
    const move = this.game.undo();
    if (move) {
      this.selectedSquare = null;
      this.legalMoves = [];
      const hist = this.game.history({ verbose: true });
      this.lastMove = hist.length > 0 ? { from: hist[hist.length - 1].from, to: hist[hist.length - 1].to } : null;
      this.render();
    }
    return move;
  }

  flip() {
    this.options.flipped = !this.options.flipped;
    this._buildBoard();
    this.render();
  }

  setInteractive(val) {
    this.options.interactive = val;
  }

  setPlayerColor(color) {
    this.options.playerColor = color;
  }

  setAllowedMoves(moves) {
    this.options.allowedMoves = moves;
  }

  setHint(squares) {
    this.hintSquares = squares || [];
    this.render();
  }

  clearHint() {
    this.hintSquares = [];
    this.render();
  }

  getFen() {
    return this.game.fen();
  }

  getGame() {
    return this.game;
  }

  isGameOver() {
    return this.game.game_over();
  }

  turn() {
    return this.game.turn();
  }
}
