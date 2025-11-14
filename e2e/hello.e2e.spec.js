import { test, expect } from '@playwright/test';

test.describe('Welcome page', () => {
    test ("affiche le message de bienvenue de l'API", async ({ page }) => {
        // accède à l'application Vue (serveur Vite)
        await page.goto('http://192.168.1.85:8090');

        // vérifie que le texte est celui renvoyé par l'API
        const messageElement = page.locator('#welcome-message');
        await expect(messageElement).toHaveText("Welcome to the Vehicle Booking website!");
    });
})
