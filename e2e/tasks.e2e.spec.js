import { test, expect } from '@playwright/test';

test.describe('Gestion des tâches', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8081');
    });

    test('affiche la liste des tâches initiales', async ({ page }) => {
        await expect(page.locator('ul li')).toHaveCount(3);
    });

    test("permet d'ajouter une nouvelle tâche", async ({ page }) => {
        await page.fill('input[placeholder="Nouvelle tâche"]', 'Apprendre Playwright');
        await page.click('button:has-text("Ajouter")');
        await expect(page.locator('ul li')).toContainText('Apprendre Playwright');
    });

    test('permet de marquer une tâche comme terminée', async ({ page }) => {
        const firstButton = page.locator('ul li button:has-text("Terminer")').first();
        await firstButton.click();
        await expect(page.locator('ul li span.done').first()).toBeVisible();
    });

    test('permet de supprimer une tâche', async ({ page }) => {
        const initialCount = await page.locator('ul li').count();
        await page.locator('ul li button:has-text("Supprimer")').first().click();
        await expect(page.locator('ul li')).toHaveCount(initialCount - 1);
    });
});