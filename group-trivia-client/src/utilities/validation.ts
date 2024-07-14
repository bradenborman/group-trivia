export const isValidGameCode = (gameCode: string): boolean => {
    return gameCode.length >= 3 && !/\s/.test(gameCode);
};

export const isValidDisplayName = (displayName: string): boolean => {
    return displayName.length >= 3 && !/\s/.test(displayName);
};

export const isValidPlayerName = (playerName: string): boolean => {
    return playerName.length >= 3 && !/\s/.test(playerName);
};