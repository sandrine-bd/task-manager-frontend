import { test, expect } from '@playwright/test';

test.describe('Task Manager - E2E', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8081');
    });

    test('affiche la liste des tâches initiales', async ({ page }) => {
        const taskCount = await page.locator('ul li').count()
        expect(taskCount).toBeGreaterThanOrEqual(0)
    });

    test('ajoute une nouvelle tâche', async ({ page }) => {
        await page.fill('input[placeholder="Nouvelle tâche"]', 'Apprendre Playwright');
        await page.click('button:has-text("Ajouter")');
        await expect(page.locator('ul li')).toContainText('Apprendre Playwright');
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

    /* Cas d’erreur : ajout de tâche sans description */
    test('ne permet pas d’ajouter une tâche vide', async ({ page }) => {
    await page.goto('http://localhost:8081')

    // Clique sur le bouton sans rien écrire
    await page.click('button.add-task')

    // Vérifie qu’un message d’erreur apparaît
    await expect(page.getByText('Veuillez saisir une description')).toBeVisible()
    })

    /* Cas d’erreur : API indisponible */
    test('affiche un message d’erreur si le serveur ne répond pas', async ({ page }) => {
        // Intercepte les requêtes vers /tasks et renvoie une erreur simulée
        await page.route('**/tasks', route =>
            route.fulfill({
                status: 500,
                body: JSON.stringify({ message: 'Erreur interne serveur' }),
                headers: { 'Content-Type': 'application/json' }
            })
        )

        await page.goto('http://localhost:8081')

        // Le front doit afficher un message d’erreur utilisateur
        await expect(page.getByText(/Erreur lors de la récupération des tâches/i)).toBeVisible()
        })

    /* Cas d’erreur : suppression d’une tâche inexistante */
    test('affiche un message si la tâche à supprimer est introuvable', async ({ page }) => {
        // Intercepte l’appel DELETE et renvoie une erreur 404
        await page.route('**/tasks/*', route =>
            route.fulfill({
                status: 404,
                body: JSON.stringify({ message: 'Tâche non trouvée' }),
                headers: { 'Content-Type': 'application/json' }
            })
        )

        await page.goto('http://localhost:8081')

        // Simule une suppression (bouton supprimé sur la première tâche)
        const firstTask = page.locator('.task-item').first()
        await firstTask.locator('button.delete-task').click()

        await expect(page.getByText(/Tâche non trouvée/i)).toBeVisible()
        })

        /* Cas d’erreur : échec du changement d’état (PUT 500) */
        test('affiche un message si la mise à jour du statut échoue', async ({ page }) => {
            await page.route('**/tasks/*/complete', route =>
                route.fulfill({
                    status: 500,
                    body: JSON.stringify({ message: 'Impossible de terminer la tâche' }),
                    headers: { 'Content-Type': 'application/json' }
                })
            )

            await page.goto('http://localhost:8081')

            const firstTask = page.locator('.task-item').first()
            await firstTask.locator('button.complete-task').click()

            await expect(page.getByText(/Impossible de terminer la tâche/i)).toBeVisible()
            })
});