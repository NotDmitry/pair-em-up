# Pair 'em Up

## [Original Task](https://github.com/rolling-scopes-school/tasks/tree/master/stage1/tasks/pair-em-up#main-functional-requirements-)

## Key skills

- Core JavaScript 
- Dynamic DOM Manipulation
- Event-driven architecture
- Algorithm design
- Complex state management
- Responsive & Adaptive UI/UX Design

## Description

**Pair 'em Up** is a strategic number-matching puzzle game where players must clear a grid by finding and removing valid pairs of numbers. The goal is to score points by strategically matching number pairs while managing limited assist tools and resources. Players win by reaching or exceeding the target score of 100 points before running out of valid moves and available assists.

## Features & Game rules

### 🎮 Game modes

The game offers three distinct modes:

- **Classic mode**: Sequential numbers from 1-19 (excluding 10) arranged in order
- **Random mode**: Numbers from 1-19 (excluding 10) placed in random order
- **Chaotic mode**: Exactly 27 random numbers using only digits 1-9

### ✅ Valid Pairs

A valid pair consists of exactly two numbers that meet one of the following criteria:

- **Identical numbers**: Two numbers that are exactly the same (e.g., 7 and 7)
- **Sum to 10**: Two numbers that add up to 10 (e.g., 3 and 7, 4 and 6)
- **Special case**: A pair of fives (5 and 5) awards bonus points

### 🎯 Pair Selection Rules

Numbers can be selected and removed following these connectivity rules:

- **Adjacent cells**: Numbers in vertically or horizontally adjacent cells can always be paired
- **Same row/column**: Numbers in the same row or column can be paired if the cells between them are empty
- **Row boundaries**: The last number of one row can pair with the first number of the next non-empty row

### ⚙️ Gameplay Mechanics

- **Cell removal**: When a valid pair is successfully matched, both cells become empty and the numbers are permanently removed from the grid
- **Invalid pairs**: Attempting to match an invalid pair provides visual/audio feedback but keeps the numbers in place
- **Grid management**: As cells are cleared, remaining numbers maintain their positions (no automatic shifting)

### 🏆 Scoring System

Points are awarded based on pair difficulty:

- **Identical pair**: +1 point (e.g., 7 + 7)
- **Sum-to-10 pair**: +2 points (e.g., 3 + 7)
- **Double five bonus**: +3 points (special case for 5 + 5)

### 🪄 Assist Tools

Players have access to limited-use assist tools to help overcome challenging board states:

- **Hints**: Show the number of currently available valid moves (maximum display: "5+")
- **Revert**: Undo the last move (single-step undo, can be used once after each move)
- **Add Numbers** (max 10 uses per game): The numbers are added to the grid one by one without empty cells in between
  - **Classic mode**: collects all remaining numbers and appends them to the grid in sequential order
  - **Random mode**: collects all remaining numbers and appends them to the grid in random order
  - **Chaotic mode**: appends as many new random numbers (1-9) to the grid as the number of remaining numbers
- **Shuffle**: Randomly rearranges existing numbers on the board (max 5 uses per game)
- **Eraser**: Removes any single number from the grid (max 5 uses per game)

### 🏅 Win/Lose Conditions

- **Win condition** (either of the following must be true): 
  - reach or exceed the target score of 100 points 
  - clear the board
- **Lose condition** (either of the following must be true):
  - no valid moves remain and all assist tools have been used
  - the 50-line grid limit has been reached

### ⏱️ Game Limits

- **Maximum grid size**: 50 lines total (when adding numbers repeatedly)
- **Assist caps**: Add numbers (10 uses), Shuffle (5 uses), Eraser (5 uses)
- **Undo history**: 1 step back (unlimited use per game)
- **Target score**: 100 points

### ⚙️ Other features

- **Timer**: Running time display in MM:SS format, starts automatically when game loads
- **Control buttons**:
    - **Reset button**: Restarts the current game in the same mode with fresh numbers
    - **Save game button**: Preserves current game state (grid, score, timer, mode, undo history, assist tools uses)
    - **Continue game button**: Loads a previously saved game state (enabled only when a saved game exists)
- **Settings button**: Quick access to game settings during play and in main menu
- **High score table**: Maintains the 5 latest games, sorted by completion time (MM:SS format)
- **Data persistence**: All results stored in localStorage for cross-session access
- **Automatic save**: Current game state and user settings preserved before page unload