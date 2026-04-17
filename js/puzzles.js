/* ============================================================
   PUZZLES - Chess Puzzle Data
   Each puzzle has a FEN, the solution moves, and metadata
   ============================================================ */

const PUZZLES = [
  // ===== MATE IN 1 =====
  {
    id: 'p1',
    category: 'mate1',
    title: "Scholar's Mate",
    objective: 'Capture on f7 to deliver checkmate!',
    difficulty: 1,
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
    solution: ['h5f7'],
    hint: 'The Queen can capture on f7, protected by the Bishop on c4.',
    playerColor: 'w'
  },
  {
    id: 'p2',
    category: 'mate1',
    title: 'Back Rank Mate',
    objective: 'Use your Rook to deliver checkmate on the back rank!',
    difficulty: 1,
    fen: '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1',
    solution: ['e1e8'],
    hint: 'The King is trapped behind its own pawns.',
    playerColor: 'w'
  },
  {
    id: 'p3',
    category: 'mate1',
    title: 'Queen Checkmate',
    objective: 'Deliver checkmate with your Queen!',
    difficulty: 1,
    fen: '5rk1/5ppp/8/8/8/8/2Q3PP/6K1 w - - 0 1',
    solution: ['c2c7'],
    hint: 'Look for a square where the Queen delivers check and the King has no escape.',
    playerColor: 'w'
  },
  {
    id: 'p4',
    category: 'mate1',
    title: 'Rook Roller',
    objective: 'Deliver checkmate with your Rook!',
    difficulty: 1,
    fen: 'k7/8/1K6/8/8/8/8/7R w - - 0 1',
    solution: ['h1a1'],
    hint: 'Slide the Rook to the a-file.',
    playerColor: 'w'
  },
  {
    id: 'p5',
    category: 'mate1',
    title: 'Bishop Support',
    objective: 'Find the checkmate in one!',
    difficulty: 2,
    fen: '2r3k1/5pBp/6p1/8/8/8/5PPP/R5K1 w - - 0 1',
    solution: ['a1a8'],
    hint: 'Use the Rook on the back rank — the Bishop covers the escape square.',
    playerColor: 'w'
  },
  {
    id: 'p6',
    category: 'mate1',
    title: 'Knight & Rook Mate',
    objective: 'Deliver checkmate using the synergy between Knight and Rook!',
    difficulty: 2,
    fen: '5rk1/5ppp/5N2/8/8/8/8/1R4K1 w - - 0 1',
    solution: ['b1b8'],
    hint: 'The Rook can reach the back rank, and the Knight covers the escape square h7.',
    playerColor: 'w'
  },
  {
    id: 'p7',
    category: 'mate1',
    title: 'Queen Sacrifice',
    objective: 'Sacrifice your Queen to deliver checkmate!',
    difficulty: 2,
    fen: 'r1bqr1k1/ppp2ppp/2np4/8/2B1n1b1/2N1BN2/PPP1QPPP/R4RK1 w - - 0 1',
    solution: ['e2e4'],
    hint: 'Sometimes recapturing leads to a strong position.',
    playerColor: 'w'
  },

  // ===== MATE IN 2 =====
  {
    id: 'p8',
    category: 'mate2',
    title: 'Smothered Mate Setup',
    objective: 'Set up and deliver a smothered mate in 2 moves!',
    difficulty: 3,
    fen: '6rk/5Npp/8/8/8/8/8/4K2R w - - 0 1',
    solution: ['h1h6', null, 'f7g5'],
    hint: 'Check with the Rook first, then the Knight finishes the job.',
    playerColor: 'w'
  },
  {
    id: 'p9',
    category: 'mate2',
    title: 'Double Rook Mate',
    objective: 'Use both your pieces to deliver mate in 2!',
    difficulty: 3,
    fen: 'k7/8/1K6/8/8/8/8/R6R w - - 0 1',
    solution: ['a1a7', null, 'h1h8'],
    hint: 'Cut off the King first, then deliver the finishing blow.',
    playerColor: 'w'
  },
  {
    id: 'p10',
    category: 'mate2',
    title: 'Queen & Bishop',
    objective: 'Deliver checkmate in 2 moves with Queen and Bishop!',
    difficulty: 3,
    fen: '6k1/5p1p/6p1/8/8/6B1/5Q1P/6K1 w - - 0 1',
    solution: ['f2b6', null, 'b6g1'],
    hint: 'Start by threatening mate on g7.',
    playerColor: 'w'
  },

  // ===== TACTICS =====
  {
    id: 'p11',
    category: 'tactic',
    title: 'Knight Fork',
    objective: 'Fork the King and Queen with your Knight!',
    difficulty: 2,
    fen: '4k3/8/8/3q4/8/4N3/8/4K3 w - - 0 1',
    solution: ['e3c4'],
    hint: 'Find a square where the Knight attacks both the King and Queen.',
    playerColor: 'w'
  },
  {
    id: 'p12',
    category: 'tactic',
    title: 'Royal Fork',
    objective: 'Win the Queen with a Knight fork!',
    difficulty: 2,
    fen: 'r1b1kbnr/ppppqppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1',
    solution: ['f3d4'],
    hint: 'Centralize the Knight while creating threats.',
    playerColor: 'w'
  },
  {
    id: 'p13',
    category: 'tactic',
    title: 'Pin to Win',
    objective: 'Pin a piece to the King and win material!',
    difficulty: 2,
    fen: 'rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 1',
    solution: ['c1d2'],
    hint: 'Develop a piece while breaking the pin on your Knight.',
    playerColor: 'w'
  },
  {
    id: 'p14',
    category: 'tactic',
    title: 'Skewer Attack',
    objective: 'Skewer the King to win the Rook behind it!',
    difficulty: 2,
    fen: '8/8/8/4k3/8/8/6B1/4K2r w - - 0 1',
    solution: ['g2c6'],
    hint: 'Put the Bishop on a diagonal that attacks the King and the Rook behind it.',
    playerColor: 'w'
  },
  {
    id: 'p15',
    category: 'tactic',
    title: 'Back Rank Threat',
    objective: 'Exploit the weak back rank!',
    difficulty: 2,
    fen: '2r3k1/5ppp/8/8/8/8/5PPP/1R4K1 w - - 0 1',
    solution: ['b1b8'],
    hint: "The opponent's King is trapped. Check the back rank!",
    playerColor: 'w'
  },
  {
    id: 'p16',
    category: 'tactic',
    title: 'Removing the Guard',
    objective: 'Remove the defender to win material!',
    difficulty: 3,
    fen: 'r4rk1/ppp2ppp/2n2n2/3qp1B1/3P4/2N2N2/PPP2PPP/R2QR1K1 w - - 0 1',
    solution: ['g5f6'],
    hint: 'Capture the piece that defends a key square.',
    playerColor: 'w'
  },
  {
    id: 'p17',
    category: 'tactic',
    title: 'Pawn Fork',
    objective: 'Use a humble pawn to fork two pieces!',
    difficulty: 1,
    fen: '8/8/8/2b1n3/3P4/8/8/4K3 w - - 0 1',
    solution: ['d4c5', 'd4e5'],
    hint: 'The pawn can capture on two diagonals.',
    playerColor: 'w'
  },
  {
    id: 'p18',
    category: 'mate1',
    title: 'Arabian Mate',
    objective: 'Deliver the classic Arabian checkmate pattern!',
    difficulty: 2,
    fen: '7k/R6p/5N2/8/8/8/8/4K3 w - - 0 1',
    solution: ['a7h7'],
    hint: 'The Rook and Knight work together on the h7 square to trap the King.',
    playerColor: 'w'
  },
  {
    id: 'p19',
    category: 'tactic',
    title: 'Discovered Attack',
    objective: 'Move a piece to reveal an attack behind it!',
    difficulty: 3,
    fen: 'rn1qkbnr/ppp1pppp/8/3p4/4P1b1/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1',
    solution: ['f3e5'],
    hint: 'Move the Knight to reveal an attack on the Bishop.',
    playerColor: 'w'
  },
  {
    id: 'p20',
    category: 'tactic',
    title: 'Trapped Piece',
    objective: 'Trap the enemy piece!',
    difficulty: 2,
    fen: 'rnbqk1nr/pppp1ppp/8/2b1p3/4P3/3P1N2/PPP2PPP/RNBQKB1R w KQkq - 0 1',
    solution: ['d3d4'],
    hint: 'Advance the pawn to attack the Bishop — where can it go?',
    playerColor: 'w'
  }
];
