/* ============================================================
   AI ENGINE - Basic Chess AI with Minimax & Alpha-Beta
   ============================================================ */

class ChessAI {
  constructor(difficulty = 1) {
    this.difficulty = difficulty; // 1=beginner, 2=intermediate, 3=advanced
    this.nodesSearched = 0;

    // Piece values
    this.PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

    // Piece-square tables (encourage good positioning)
    this.PST = {
      p: [ // Pawn
        [0,0,0,0,0,0,0,0],
        [50,50,50,50,50,50,50,50],
        [10,10,20,30,30,20,10,10],
        [5,5,10,25,25,10,5,5],
        [0,0,0,20,20,0,0,0],
        [5,-5,-10,0,0,-10,-5,5],
        [5,10,10,-20,-20,10,10,5],
        [0,0,0,0,0,0,0,0]
      ],
      n: [ // Knight
        [-50,-40,-30,-30,-30,-30,-40,-50],
        [-40,-20,0,0,0,0,-20,-40],
        [-30,0,10,15,15,10,0,-30],
        [-30,5,15,20,20,15,5,-30],
        [-30,0,15,20,20,15,0,-30],
        [-30,5,10,15,15,10,5,-30],
        [-40,-20,0,5,5,0,-20,-40],
        [-50,-40,-30,-30,-30,-30,-40,-50]
      ],
      b: [ // Bishop
        [-20,-10,-10,-10,-10,-10,-10,-20],
        [-10,0,0,0,0,0,0,-10],
        [-10,0,10,10,10,10,0,-10],
        [-10,5,5,10,10,5,5,-10],
        [-10,0,10,10,10,10,0,-10],
        [-10,10,10,10,10,10,10,-10],
        [-10,5,0,0,0,0,5,-10],
        [-20,-10,-10,-10,-10,-10,-10,-20]
      ],
      r: [ // Rook
        [0,0,0,0,0,0,0,0],
        [5,10,10,10,10,10,10,5],
        [-5,0,0,0,0,0,0,-5],
        [-5,0,0,0,0,0,0,-5],
        [-5,0,0,0,0,0,0,-5],
        [-5,0,0,0,0,0,0,-5],
        [-5,0,0,0,0,0,0,-5],
        [0,0,0,5,5,0,0,0]
      ],
      q: [ // Queen
        [-20,-10,-10,-5,-5,-10,-10,-20],
        [-10,0,0,0,0,0,0,-10],
        [-10,0,5,5,5,5,0,-10],
        [-5,0,5,5,5,5,0,-5],
        [0,0,5,5,5,5,0,-5],
        [-10,5,5,5,5,5,0,-10],
        [-10,0,5,0,0,0,0,-10],
        [-20,-10,-10,-5,-5,-10,-10,-20]
      ],
      k: [ // King (middlegame)
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-20,-30,-30,-40,-40,-30,-30,-20],
        [-10,-20,-20,-20,-20,-20,-20,-10],
        [20,20,0,0,0,0,20,20],
        [20,30,10,0,0,10,30,20]
      ]
    };
  }

  setDifficulty(d) {
    this.difficulty = d;
  }

  // Get the best move for the current position
  getBestMove(game) {
    this.nodesSearched = 0;
    const depth = this.difficulty; // depth 1, 2, or 3
    const isMaximizing = game.turn() === 'w';

    const moves = game.moves({ verbose: true });
    if (moves.length === 0) return null;

    // Add randomness for beginner
    if (this.difficulty === 1 && Math.random() < 0.4) {
      return moves[Math.floor(Math.random() * moves.length)];
    }

    let bestMove = null;
    let bestScore = isMaximizing ? -Infinity : Infinity;

    // Shuffle moves for variety
    this._shuffle(moves);

    // Prioritize captures and checks for move ordering
    moves.sort((a, b) => {
      let scoreA = 0, scoreB = 0;
      if (a.captured) scoreA += this.PIECE_VALUES[a.captured] || 0;
      if (b.captured) scoreB += this.PIECE_VALUES[b.captured] || 0;
      if (a.san && a.san.includes('+')) scoreA += 50;
      if (b.san && b.san.includes('+')) scoreB += 50;
      return scoreB - scoreA;
    });

    for (const move of moves) {
      game.move(move.san);
      const score = this._minimax(game, depth - 1, -Infinity, Infinity, !isMaximizing);
      game.undo();

      if (isMaximizing) {
        if (score > bestScore) { bestScore = score; bestMove = move; }
      } else {
        if (score < bestScore) { bestScore = score; bestMove = move; }
      }
    }

    // For beginner, sometimes pick a suboptimal move
    if (this.difficulty === 1 && Math.random() < 0.25) {
      const randomIdx = Math.floor(Math.random() * Math.min(3, moves.length));
      return moves[randomIdx];
    }

    return bestMove;
  }

  _minimax(game, depth, alpha, beta, isMaximizing) {
    this.nodesSearched++;

    if (depth === 0 || game.game_over()) {
      return this._evaluate(game);
    }

    const moves = game.moves({ verbose: true });

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        game.move(move.san);
        const eval_ = this._minimax(game, depth - 1, alpha, beta, false);
        game.undo();
        maxEval = Math.max(maxEval, eval_);
        alpha = Math.max(alpha, eval_);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        game.move(move.san);
        const eval_ = this._minimax(game, depth - 1, alpha, beta, true);
        game.undo();
        minEval = Math.min(minEval, eval_);
        beta = Math.min(beta, eval_);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  _evaluate(game) {
    if (game.in_checkmate()) {
      return game.turn() === 'w' ? -99999 : 99999;
    }
    if (game.in_draw() || game.in_stalemate() || game.in_threefold_repetition()) {
      return 0;
    }

    let score = 0;
    const board = game.board();

    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (!piece) continue;

        const value = this.PIECE_VALUES[piece.type] || 0;
        const pst = this.PST[piece.type];
        let posValue = 0;

        if (pst) {
          if (piece.color === 'w') {
            posValue = pst[r][f];
          } else {
            posValue = pst[7 - r][f];
          }
        }

        if (piece.color === 'w') {
          score += value + posValue;
        } else {
          score -= value + posValue;
        }
      }
    }

    // Mobility bonus
    const currentMoves = game.moves().length;
    score += (game.turn() === 'w' ? 1 : -1) * currentMoves * 2;

    return score;
  }

  _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
}
