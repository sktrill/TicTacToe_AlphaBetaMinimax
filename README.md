# TicTacToe_AlphaBetaMinimax

Play with the app here: https://sk-tictactoe-alphabetamm.herokuapp.com/

<p><b>Problem</b></p>
Create a perfect player such that every Tic Tac Toe (TTT) ends in a draw or a win regardless of which player starts.

<p><b>Solution</b></p>
TTT is a two-person zero-sum game (a game such that each player's gain / loss utility is balanced by the other's loss / gain) with perfect information (since players play in turn neither player has an information advantage over the other), which lends itself to the minimax decision rule strategy.

The minimax decision rule for the perfect player works by aiming to minimize the maximum payoff possible for the other player. This payoff is calculated by a heuristic evaluation (function scoreCalc()) that calculates the winning state of a board. The minimax can be thought of as exploring the nodes of a game tree, traversing the possible different configurations of the board. This makes minimax a rather tedious algorithm working in exponential time complexity (related to how the number of branches and depth of the tree) and linear space complexity.

It can be optimized by the alpha-beta pruning search algorithm that seeks to seeks to decrease the number of evaluated nodes by maintaining two values alpha (α) and beta (β), which represents the maximum payoff assured to the perfect player and the minimum payoff assured to the other, respectively. This allows us to avoid certain nodes in the game tree where α > β.

@thekotecha
