import { isValidGameCode, isValidDisplayName, isValidPlayerName } from '../utilities/validation';

describe('Validation Utility Functions', () => {
    describe('isValidGameCode', () => {
        it('should return true for valid game code', () => {
            expect(isValidGameCode('game123')).toBe(true);
        });

        it('should return false for game code with spaces', () => {
            expect(isValidGameCode('game 123')).toBe(false);
        });

        it('should return false for game code less than 3 characters', () => {
            expect(isValidGameCode('ga')).toBe(false);
        });
    });

    describe('isValidDisplayName', () => {
        it('should return true for valid display name', () => {
            expect(isValidDisplayName('player')).toBe(true);
        });

        it('should return false for display name with spaces', () => {
            expect(isValidDisplayName('play er')).toBe(false);
        });

        it('should return false for display name less than 3 characters', () => {
            expect(isValidDisplayName('pl')).toBe(false);
        });
    });

    describe('isValidPlayerName', () => {
        it('should return true for valid player name', () => {
            expect(isValidPlayerName('player')).toBe(true);
        });

        it('should return false for player name with spaces', () => {
            expect(isValidPlayerName('play er')).toBe(false);
        });

        it('should return false for player name less than 3 characters', () => {
            expect(isValidPlayerName('pl')).toBe(false);
        });
    });
});
