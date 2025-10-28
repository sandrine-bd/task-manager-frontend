import { test, expect } from '@playwright/test';

test.describe('Page Hello', () => {
    test ("affiche le message de bienvenue de l'API", async ({ page }) => {
        // accède à l'application Vue (serveur Vite)
        await page.goto('http://localhost:8081'); 

        // vérifie que le texte est celui renvoyé par l'API
        const messageElement = page.locator('#hello-message'); 
        await expect(messageElement).toHaveText("Welcome to the Task Manager API!");
    });
})