/* ============================================================
   CHAPTERS - Story Mode Lesson Data
   Each chapter has lessons with narrative, FEN positions, and tasks
   ============================================================ */

const CHAPTERS = [
  {
    id: 1,
    title: 'The Board & Setup',
    icon: '♜',
    description: 'Learn the battlefield — the 64 squares that decide everything.',
    lessons: [
      {
        id: '1-1',
        title: 'The Chessboard',
        narrative: `<p>Welcome, warrior. Before you command any army, you must know your battlefield.</p>
          <p>The chessboard is an 8×8 grid of <span class="piece-highlight">64 squares</span> — 32 light, 32 dark, alternating like a mosaic of strategy.</p>
          <p>Each column is called a <strong>file</strong> (labeled a–h), and each row is called a <strong>rank</strong> (labeled 1–8). Every square has a unique name — like <span class="piece-highlight">e4</span> or <span class="piece-highlight">d7</span>.</p>
          <p>Look at the board now. Notice how the bottom-right square is always <strong>light</strong>. This is the golden rule of setup.</p>`,
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        task: {
          type: 'explore',
          description: 'Click on any 5 different squares to explore the board coordinates.',
          target: 5,
          progress: 0
        }
      },
      {
        id: '1-2',
        title: 'Setting Up the Pieces',
        narrative: `<p>Every great battle begins with formation. Let's learn where each piece stands at the start.</p>
          <p>The <span class="piece-highlight">♖ Rooks</span> stand in the corners. The <span class="piece-highlight">♘ Knights</span> are next to them, followed by the <span class="piece-highlight">♗ Bishops</span>.</p>
          <p>The <span class="piece-highlight">♕ Queen</span> always starts on her own color (White queen on light, Black queen on dark). The <span class="piece-highlight">♔ King</span> takes the remaining square.</p>
          <p>And in front stands the army of 8 <span class="piece-highlight">♙ Pawns</span> — humble but mighty.</p>`,
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        task: {
          type: 'identify',
          description: 'Click on the White King to identify it on the board.',
          targetSquare: 'e1',
          pieceName: 'White King'
        }
      },
      {
        id: '1-3',
        title: 'Files, Ranks & Diagonals',
        narrative: `<p>Now that you see the board, let's understand its geometry.</p>
          <p><strong>Files</strong> run vertically (a–h). The e-file and d-file are the "center files" — controlling them is crucial in chess.</p>
          <p><strong>Ranks</strong> run horizontally (1–8). Your back rank is rank 1 (for White) — protecting it is vital.</p>
          <p><strong>Diagonals</strong> run at 45° angles. Bishops and Queens dominate these paths.</p>
          <p>Click on square <strong>e4</strong>. This square is one of the most important in all of chess — it controls the center!</p>`,
        fen: '8/8/8/8/8/8/8/8 w - - 0 1',
        task: {
          type: 'identify',
          description: 'Click on the center square e4.',
          targetSquare: 'e4',
          pieceName: 'square e4'
        }
      }
    ]
  },
  {
    id: 2,
    title: 'The Army',
    icon: '♞',
    description: 'Meet your soldiers — each piece has unique powers.',
    lessons: [
      {
        id: '2-1',
        title: 'The Pawn',
        narrative: `<p>The <span class="piece-highlight">♙ Pawn</span> is the soul of chess. Small but essential.</p>
          <p><strong>Movement:</strong> Pawns move forward one square, but on their first move they can leap two squares.</p>
          <p><strong>Capture:</strong> Pawns capture diagonally, one square forward-left or forward-right.</p>
          <p><strong>Promotion:</strong> If a pawn reaches the other end of the board, it transforms into any piece (usually a Queen)!</p>
          <p>Try moving the pawn on e2 to e4.</p>`,
        fen: '8/8/8/8/8/8/4P3/8 w - - 0 1',
        task: {
          type: 'move',
          description: 'Move the White Pawn from e2 to e4.',
          from: 'e2',
          to: 'e4'
        }
      },
      {
        id: '2-2',
        title: 'The Knight',
        narrative: `<p>The <span class="piece-highlight">♘ Knight</span> is the trickster of chess — it moves in an "L" shape and is the only piece that can jump over others.</p>
          <p><strong>Movement:</strong> Two squares in one direction, then one square perpendicular. Or: one square then two perpendicular.</p>
          <p>A Knight on e4 can reach up to 8 squares. Knights are strongest in the center where they control the most squares.</p>
          <p>Move the Knight from g1 to f3 — one of the most common opening moves in chess!</p>`,
        fen: '8/8/8/8/8/8/8/6N1 w - - 0 1',
        task: {
          type: 'move',
          description: 'Move the Knight from g1 to f3.',
          from: 'g1',
          to: 'f3'
        }
      },
      {
        id: '2-3',
        title: 'The Bishop',
        narrative: `<p>The <span class="piece-highlight">♗ Bishop</span> is the sniper — it cuts diagonally across the entire board.</p>
          <p><strong>Movement:</strong> Bishops slide any number of squares diagonally, but cannot jump over pieces.</p>
          <p>Each player starts with two Bishops — one on light squares, one on dark. A Bishop can never change its square color!</p>
          <p>The "Bishop pair" (both Bishops together) is very powerful in open positions.</p>
          <p>Move the Bishop from c1 to e3.</p>`,
        fen: '8/8/8/8/8/8/8/2B5 w - - 0 1',
        task: {
          type: 'move',
          description: 'Move the Bishop from c1 to any square.',
          from: 'c1',
          to: null
        }
      },
      {
        id: '2-4',
        title: 'The Rook',
        narrative: `<p>The <span class="piece-highlight">♖ Rook</span> is a siege tower — it dominates ranks and files.</p>
          <p><strong>Movement:</strong> Rooks slide any number of squares horizontally or vertically.</p>
          <p>Rooks are most powerful on open files (files with no pawns). They also play a key role in "castling" — a special King move we'll learn later.</p>
          <p>A Rook is worth about 5 points — more than a Bishop or Knight (3 points each).</p>`,
        fen: '8/8/8/8/8/8/8/R7 w - - 0 1',
        task: {
          type: 'move',
          description: 'Move the Rook from a1 to any square.',
          from: 'a1',
          to: null
        }
      },
      {
        id: '2-5',
        title: 'The Queen',
        narrative: `<p>The <span class="piece-highlight">♕ Queen</span> is the most powerful piece on the board — combining the powers of the Rook and Bishop.</p>
          <p><strong>Movement:</strong> The Queen can move any number of squares in any direction — horizontally, vertically, or diagonally.</p>
          <p>She is worth about 9 points. Losing your Queen early usually means losing the game.</p>
          <p>But beware: bringing her out too early can lead to trouble, as she can be chased around by lesser pieces.</p>`,
        fen: '8/8/8/8/3Q4/8/8/8 w - - 0 1',
        task: {
          type: 'move',
          description: 'Move the Queen from d4 to any square — explore her power!',
          from: 'd4',
          to: null
        }
      },
      {
        id: '2-6',
        title: 'The King',
        narrative: `<p>The <span class="piece-highlight">♔ King</span> is the most important piece — if he falls, you lose.</p>
          <p><strong>Movement:</strong> The King moves one square in any direction.</p>
          <p>The King can never move to a square that is attacked by an enemy piece. You can never put your own King in danger.</p>
          <p>In the endgame, the King transforms from a liability into a powerful attacking piece. He should march forward to help his pawns promote!</p>`,
        fen: '8/8/8/8/4K3/8/8/8 w - - 0 1',
        task: {
          type: 'move',
          description: 'Move the King one square in any direction.',
          from: 'e4',
          to: null
        }
      }
    ]
  },
  {
    id: 3,
    title: 'First Battles',
    icon: '⚔',
    description: 'Master the fundamental rules of engagement.',
    lessons: [
      {
        id: '3-1',
        title: 'Check',
        narrative: `<p>When a piece attacks the enemy King, we say the King is <strong>in check</strong>.</p>
          <p>When you're in check, you MUST escape. There are three ways:</p>
          <p>1. <strong>Move</strong> the King to a safe square<br>
          2. <strong>Block</strong> the attack with another piece<br>
          3. <strong>Capture</strong> the attacking piece</p>
          <p>In this position, can you put the Black King in check? Move the White Queen to deliver check!</p>`,
        fen: '4k3/8/8/8/8/8/8/3Q4 w - - 0 1',
        task: {
          type: 'check',
          description: 'Deliver check to the Black King with your Queen!',
          mustCheck: true
        }
      },
      {
        id: '3-2',
        title: 'Checkmate',
        narrative: `<p><strong>Checkmate</strong> is the ultimate goal — the enemy King is in check and cannot escape.</p>
          <p>When you achieve checkmate, you win the game! There's no capturing the King in chess — the game ends when checkmate is inevitable.</p>
          <p>In this position, the White Rook can deliver a beautiful <strong>back rank checkmate</strong>. The Black King is trapped by his own pawns!</p>
          <p>Move the Rook to the 8th rank to deliver checkmate!</p>`,
        fen: '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1',
        task: {
          type: 'checkmate',
          description: 'Deliver checkmate! Move the Rook to e8.',
          from: 'e1',
          to: 'e8'
        }
      },
      {
        id: '3-3',
        title: 'Stalemate',
        narrative: `<p><strong>Stalemate</strong> is a tricky situation — it's a draw!</p>
          <p>Stalemate occurs when a player is NOT in check but has NO legal moves. The game immediately ends as a draw.</p>
          <p>This is a critical concept! When you're winning, you must avoid accidentally stalemating your opponent. When you're losing, stalemate might be your only hope!</p>
          <p>Study this position — if it were Black's turn, it would be stalemate because the Black King has no legal moves but is not in check.</p>`,
        fen: '5k2/5P2/5K2/8/8/8/8/8 b - - 0 1',
        task: {
          type: 'explore',
          description: 'Study this position. Notice Black has no legal moves but isn\'t in check — this is stalemate! Click on 3 squares to explore.',
          target: 3,
          progress: 0
        }
      },
      {
        id: '3-4',
        title: 'Castling',
        narrative: `<p><strong>Castling</strong> is a special move involving the King and a Rook. It's the only move where two pieces move at once!</p>
          <p><strong>Kingside castling (O-O):</strong> King moves two squares toward the h-Rook, and the Rook jumps over to the other side.</p>
          <p><strong>Queenside castling (O-O-O):</strong> King moves two squares toward the a-Rook, and the Rook jumps over.</p>
          <p><strong>Rules:</strong> You can only castle if: neither the King nor Rook has moved, no pieces are between them, the King isn't in check, and the King doesn't pass through check.</p>
          <p>Try castling kingside! Move the King from e1 to g1.</p>`,
        fen: 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1',
        task: {
          type: 'move',
          description: 'Castle kingside! Move the King from e1 to g1.',
          from: 'e1',
          to: 'g1'
        }
      },
      {
        id: '3-5',
        title: 'En Passant',
        narrative: `<p><strong>En passant</strong> ("in passing") is the most surprising rule in chess!</p>
          <p>When an enemy pawn advances two squares from its starting position and lands beside your pawn, you can capture it as if it only moved one square.</p>
          <p>This special capture must be made immediately — on the very next move, or the right is lost.</p>
          <p>In this position, Black just played d7-d5, landing next to your pawn on e5. Capture en passant by moving your pawn from e5 to d6!</p>`,
        fen: 'rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2',
        task: {
          type: 'move',
          description: 'Capture en passant! Move the pawn from e5 to d6.',
          from: 'e5',
          to: 'd6'
        }
      }
    ]
  },
  {
    id: 4,
    title: 'Tactics',
    icon: '🎯',
    description: 'Learn deadly tactical patterns that win material.',
    lessons: [
      {
        id: '4-1',
        title: 'The Fork',
        narrative: `<p>A <strong>fork</strong> is when one piece attacks two or more enemy pieces simultaneously.</p>
          <p>The opponent can only save one piece — you win the other!</p>
          <p>Knights are the most notorious forkers because of their unusual movement. A Knight fork on the King and Queen (a "Royal Fork") is devastating.</p>
          <p>In this position, you can fork the Black King and Queen with your Knight! Find the forking square.</p>`,
        fen: 'r1bqk2r/ppppbppp/2n2n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQ1RK1 w kq - 0 1',
        task: {
          type: 'find_best_move',
          description: 'Find a way to create a strong tactical position! Make any good move.',
          hint: 'Look for central control or piece development.',
          validateFn: 'anyLegal'
        }
      },
      {
        id: '4-2',
        title: 'The Pin',
        narrative: `<p>A <strong>pin</strong> is when a piece attacks an enemy piece that cannot move because it would expose a more valuable piece behind it.</p>
          <p>An <strong>absolute pin</strong> is against the King — the pinned piece literally cannot move (it's illegal). A <strong>relative pin</strong> is against another valuable piece — moving would lose material.</p>
          <p>Bishops and Rooks are natural pinning pieces because they attack along lines.</p>
          <p>In this position, play Bb5 to pin the Knight to the Black King!</p>`,
        fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
        task: {
          type: 'move',
          description: 'Pin the Knight! Move the Bishop from f1 to b5.',
          from: 'f1',
          to: 'b5'
        }
      },
      {
        id: '4-3',
        title: 'The Skewer',
        narrative: `<p>A <strong>skewer</strong> is like a reverse pin. You attack a valuable piece, and when it moves, you capture the piece behind it.</p>
          <p>The most common skewer is a Bishop or Rook attacking the King, which must move, exposing a Queen or Rook behind it.</p>
          <p>Skewers are devastating because the front piece is forced to move, guaranteeing you win the piece behind.</p>
          <p>In this position, the White Bishop can skewer the Black King and Rook!</p>`,
        fen: '8/8/8/4k3/8/8/6B1/4K2r w - - 0 1',
        task: {
          type: 'move',
          description: 'Skewer the King and Rook! Move the Bishop to the right diagonal.',
          from: 'g2',
          to: null
        }
      },
      {
        id: '4-4',
        title: 'Discovered Attack',
        narrative: `<p>A <strong>discovered attack</strong> occurs when you move one piece out of the way, revealing an attack from a piece behind it.</p>
          <p>A <strong>discovered check</strong> is even more powerful — the revealed attack is a check, forcing the opponent to deal with it while your moved piece wreaks havoc elsewhere.</p>
          <p>These are often called "the atomic bomb of chess" because they can be game-ending.</p>
          <p>Make any move to learn about this powerful concept!</p>`,
        fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
        task: {
          type: 'explore',
          description: 'Explore the position and understand discovered attacks. Click on 3 squares.',
          target: 3,
          progress: 0
        }
      }
    ]
  },
  {
    id: 5,
    title: 'Strategy & Openings',
    icon: '📜',
    description: 'Master opening principles and strategic thinking.',
    lessons: [
      {
        id: '5-1',
        title: 'Opening Principles',
        narrative: `<p>The opening is the first phase of the game. Follow these golden rules:</p>
          <p>1. <strong>Control the center</strong> — place pawns and pieces in the center (e4, d4, e5, d5)</p>
          <p>2. <strong>Develop your pieces</strong> — bring Knights and Bishops out before the Queen</p>
          <p>3. <strong>Castle early</strong> — protect your King and connect your Rooks</p>
          <p>4. <strong>Don't move the same piece twice</strong> in the opening unless necessary</p>
          <p>5. <strong>Don't bring the Queen out early</strong> — she'll get chased around</p>
          <p>Let's start with 1.e4 — the most popular opening move in chess!</p>`,
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        task: {
          type: 'move',
          description: 'Play 1.e4 — control the center! Move the pawn from e2 to e4.',
          from: 'e2',
          to: 'e4'
        }
      },
      {
        id: '5-2',
        title: 'The Italian Game',
        narrative: `<p>The <strong>Italian Game</strong> (Giuoco Piano) is one of the oldest and most natural openings:</p>
          <p>1. e4 e5 — Both sides claim the center<br>
          2. Nf3 Nc6 — Knights develop, attacking the center<br>
          3. Bc4 — The Bishop aims at the weakest point: f7!</p>
          <p>This opening follows all the principles: center control, rapid development, and targeting weaknesses.</p>
          <p>The f7 square (and f2 for Black) is the weakest square at the start — it's only defended by the King!</p>`,
        fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
        task: {
          type: 'move',
          description: 'Play the Italian Game! Move the Bishop from f1 to c4.',
          from: 'f1',
          to: 'c4'
        }
      },
      {
        id: '5-3',
        title: 'The Sicilian Defense',
        narrative: `<p>The <strong>Sicilian Defense</strong> (1.e4 c5) is the most popular and aggressive response to 1.e4.</p>
          <p>Black immediately fights for the center but creates an asymmetrical position that leads to sharp, tactical battles.</p>
          <p>The Sicilian has many variations: the Dragon, the Najdorf, the Scheveningen — each with its own character.</p>
          <p>It's the weapon of choice for players who want to fight for a win with Black!</p>
          <p>Respond to 1.e4 with the Sicilian — play c5!</p>`,
        fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
        task: {
          type: 'move',
          description: 'Play the Sicilian Defense! Move the pawn from c7 to c5.',
          from: 'c7',
          to: 'c5'
        }
      },
      {
        id: '5-4',
        title: "Scholar's Mate Trap",
        narrative: `<p>The <strong>Scholar's Mate</strong> is a 4-move checkmate that every beginner must know — both to play it and to defend against it!</p>
          <p>The idea: White attacks f7 with the Queen and Bishop. If Black doesn't defend, it's checkmate!</p>
          <p>1.e4 e5 2.Qh5 Nc6 3.Bc4 Nf6?? (a mistake!) 4.Qxf7#</p>
          <p>The correct defense is 3...g6! chasing the Queen away.</p>
          <p>Deliver the Scholar's Mate! Capture on f7 with your Queen.</p>`,
        fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
        task: {
          type: 'checkmate',
          description: "Deliver Scholar's Mate! Move the Queen from h5 to f7.",
          from: 'h5',
          to: 'f7'
        }
      }
    ]
  },
  {
    id: 6,
    title: 'Endgames',
    icon: '👑',
    description: 'Learn how to convert advantages and deliver checkmate.',
    lessons: [
      {
        id: '6-1',
        title: 'King + Queen vs King',
        narrative: `<p>The most basic checkmate pattern. With a Queen and King vs a lone King, you should always win.</p>
          <p><strong>The technique:</strong></p>
          <p>1. Use the Queen to restrict the enemy King to the edge<br>
          2. Bring your King closer to help<br>
          3. Deliver checkmate on the edge of the board</p>
          <p>Key rule: Never give stalemate! Always make sure the enemy King has at least one square unless you're delivering checkmate.</p>
          <p>Push the Black King to the edge! Make any move with your Queen.</p>`,
        fen: '8/8/8/8/3k4/8/8/4K2Q w - - 0 1',
        task: {
          type: 'move',
          description: 'Start pushing the Black King to the edge with your Queen.',
          from: 'h1',
          to: null
        }
      },
      {
        id: '6-2',
        title: 'King + Rook vs King',
        narrative: `<p>Slightly harder than Queen + King, but still a forced win.</p>
          <p><strong>The technique (the "box" method):</strong></p>
          <p>1. Use the Rook to create a "box" — cut off the enemy King from crossing a rank or file<br>
          2. Make the box smaller with your Rook<br>
          3. Use your King to help push the enemy King to the edge<br>
          4. Deliver checkmate on the edge</p>
          <p>This is a fundamental endgame that every player must master!</p>`,
        fen: '8/8/8/3k4/8/8/8/R3K3 w - - 0 1',
        task: {
          type: 'move',
          description: 'Cut off the Black King with your Rook! Move the Rook to create a barrier.',
          from: 'a1',
          to: null
        }
      },
      {
        id: '6-3',
        title: 'Pawn Promotion',
        narrative: `<p>In many endgames, the battle is about promoting a pawn to a Queen.</p>
          <p><strong>Key concepts:</strong></p>
          <p>1. <strong>The square rule:</strong> Draw a diagonal from the pawn to the promotion square — if the enemy King can enter this square, it catches the pawn<br>
          2. <strong>Opposition:</strong> Kings facing each other with one square between — this is key to pawn endgames<br>
          3. <strong>Passed pawns:</strong> Pawns with no enemy pawns blocking them are the most dangerous</p>
          <p>In this position, push your pawn forward toward promotion!</p>`,
        fen: '8/8/8/8/8/8/1k2P3/4K3 w - - 0 1',
        task: {
          type: 'move',
          description: 'Advance the pawn towards promotion! Move e2 to e4.',
          from: 'e2',
          to: 'e4'
        }
      },
      {
        id: '6-4',
        title: 'Back Rank Checkmate',
        narrative: `<p>The <strong>back rank checkmate</strong> is one of the most common tactical patterns in chess.</p>
          <p>It happens when a Rook or Queen delivers check on the back rank (1st or 8th), and the King is trapped by its own pawns.</p>
          <p>To prevent this: create "luft" (breathing room) by pushing one pawn in front of your King (like h3 or g3).</p>
          <p>Deliver the classic back rank checkmate!</p>`,
        fen: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1',
        task: {
          type: 'checkmate',
          description: 'Deliver back rank checkmate! Move the Rook to a8.',
          from: 'a1',
          to: 'a8'
        }
      }
    ]
  }
];
