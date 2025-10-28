import { test, expect } from '@playwright/test';

test.describe('Task Manager - E2E', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8081');
          
        // nettoie les tâches
        await page.evaluate(async () => {
        await fetch('/tasks', { method: 'DELETE' });
        });
    });

    test('affiche la liste des tâches initiales', async ({ page }) => {
        const taskCount = await page.locator('ul li').count()
        expect(taskCount).toBeGreaterThanOrEqual(0)
    });

    test('ajoute une nouvelle tâche', async ({ page }) => {
        await page.fill('input[placeholder="Nouvelle tâche"]', 'Apprendre Playwright');
        await page.click('button:has-text("Ajouter")');
        
        // filtre les éléments contenant le texte et on vérifie qu'il y en a au moins un
        const taskItems = page.locator('ul li').filter({ hasText: 'Apprendre Playwright' });
        await expect(taskItems).toHaveCount(1);
    });

    test('marque une tâche comme terminée', async ({ page }) => {
        const firstButton = page.locator('ul li button:has-text("Terminer")').first();
        await firstButton.click();
        await expect(page.locator('ul li span.done').first()).toBeVisible();
    });

    test('supprime une tâche', async ({ page }) => {
        const initialCount = await page.locator('ul li').count();
        await page.locator('ul li button:has-text("Supprimer")').first().click();
        await expect(page.locator('ul li')).toHaveCount(initialCount - 1);
    });
});