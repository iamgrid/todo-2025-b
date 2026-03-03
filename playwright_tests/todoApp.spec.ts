import { test, expect, type Page } from "@playwright/test";

test.describe("Todo App", () => {
	const todoText1 = "First todo";
	const todoText2 = "Second todo";
	const todoText3 = "Third todo";
	const todoText4 = "Fourth todo";

	async function _addTodos(page: Page) {
		const inputField = page.getByRole("textbox", { name: /new todo text/i });
		const addButton = page.getByRole("button", { name: /add/i });

		await expect(inputField).toBeEmpty();

		await inputField.fill(todoText1);
		await addButton.click();

		await inputField.fill(todoText2);
		await addButton.click();

		await inputField.focus();
		await page.keyboard.type(todoText3);
		await page.keyboard.press("Enter");

		await inputField.fill(todoText4);
		await addButton.click();
	}

	async function _sortByNewestFirst(page: Page) {
		await page
			.getByRole("button", {
				name: 'Toggle "Date Created (Newest first)"',
				exact: true,
			})
			.click();
	}

	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3000/todo-2025-b");
	});

	test("renders correctly", async ({ page }) => {
		await expect(page).toHaveTitle(/.*todo 2025 b/i);
		await expect(
			page.getByRole("textbox", { name: /new todo text/i }),
		).toBeVisible();
		await expect(page.getByRole("button", { name: /add/i })).toBeVisible();
		await expect(page.getByText(/do 50 push-ups/i)).toBeVisible();
		await expect(page.getByText(/buy avocado/i)).toBeVisible();
	});

	test("color scheme switch works as intended", async ({ page }) => {
		const colorSchemeButtonSet = page.getByLabel(/color scheme options/i);
		await expect(colorSchemeButtonSet).toBeVisible();

		const lightModeButton = colorSchemeButtonSet.getByRole("button", {
			name: /toggle \"light\" color scheme/i,
		});
		const darkModeButton = colorSchemeButtonSet.getByRole("button", {
			name: /toggle \"dark\" color scheme/i,
		});
		const systemModeButton = colorSchemeButtonSet.getByRole("button", {
			name: /toggle \"system preference\" color scheme/i,
		});

		await expect(lightModeButton).toBeVisible();
		await expect(darkModeButton).toBeVisible();
		await expect(systemModeButton).toBeVisible();
		expect(systemModeButton).toHaveAttribute("aria-pressed", "true");

		function _getHTMLElementColorSchemeClass(page: Page) {
			return page.evaluate(() => {
				const htmlElement = document.documentElement;
				if (htmlElement.classList.contains("light")) {
					return "light";
				} else if (htmlElement.classList.contains("dark")) {
					return "dark";
				}
			});
		}

		const prefersDarkMode = await page.evaluate(() => {
			return window.matchMedia("(prefers-color-scheme: dark)").matches;
		});

		// loads with system preference color scheme by default
		expect(await _getHTMLElementColorSchemeClass(page)).toBe(
			prefersDarkMode ? "dark" : "light",
		);

		// can switch to dark mode
		await darkModeButton.click();
		expect(darkModeButton).toHaveAttribute("aria-pressed", "true");
		expect(lightModeButton).toHaveAttribute("aria-pressed", "false");
		expect(systemModeButton).toHaveAttribute("aria-pressed", "false");

		expect(await _getHTMLElementColorSchemeClass(page)).toBe("dark");
	});

	test("can add new todos", async ({ page }) => {
		const inputField = page.getByRole("textbox", { name: /new todo text/i });

		await expect(inputField).toBeEmpty();

		await _addTodos(page);

		await expect(page.getByText(todoText1)).toBeVisible();
		await expect(inputField).toBeEmpty();

		await expect(page.getByText(todoText2)).toBeVisible();

		await expect(page.getByText(todoText3)).toBeVisible();

		await expect(page.getByText(todoText4)).toBeVisible();

		const allTodos = page.getByRole("listitem");
		await expect(allTodos).toHaveCount(6);
	});

	test("can complete a todo", async ({ page }) => {
		const allTodos = page.getByRole("listitem");

		await expect(allTodos).toHaveCount(2);

		await _addTodos(page);

		await expect(allTodos).toHaveCount(6);

		await _sortByNewestFirst(page);

		await expect(allTodos.nth(0)).toHaveText(/fourth todo.*/i);

		const firstTodoCheckbox = allTodos.nth(0).getByRole("checkbox");
		await expect(firstTodoCheckbox).not.toBeChecked();
		await firstTodoCheckbox.check();
		await expect(firstTodoCheckbox).toBeChecked();
	});

	test("can edit a todo", async ({ page }) => {
		const allTodos = page.getByRole("listitem");

		await expect(allTodos).toHaveCount(2);

		await expect(allTodos.nth(1)).toHaveText(/buy avocado.*/i);

		const secondTodo = allTodos.nth(1);
		await secondTodo.getByRole("button", { name: /edit/i }).click();

		const editInput = secondTodo.getByRole("textbox");
		await expect(editInput).toHaveValue(/buy avocado/i);

		await editInput.fill("Updated second todo");
		await page.keyboard.press("Enter");

		await expect(secondTodo).toHaveText(/updated second todo.*/i);
	});

	test("can delete a todo", async ({ page }) => {
		const allTodos = page.getByRole("listitem");

		await expect(allTodos).toHaveCount(2);

		const todoToDelete = allTodos.nth(0);

		await expect(todoToDelete).toHaveText(/do 50 push-ups.*/i);
		await todoToDelete.getByRole("button", { name: /delete/i }).click();

		await expect(
			page.getByText(/you are about to delete the following todo.*/i),
		).toBeVisible();
		await page.getByRole("button", { name: /^delete todo$/i }).click();

		await expect(page.getByRole("alertdialog")).not.toBeVisible();

		await expect(allTodos).toHaveCount(1);
		await expect(allTodos.nth(0)).not.toHaveText(/do 50 push-ups.*/i);
	});

	test("can filter todos using the appropriate buttons", async ({ page }) => {
		const allTodos = page.getByRole("listitem");

		await expect(allTodos).toHaveCount(2);

		await _sortByNewestFirst(page);

		const firstTodoCheckbox = allTodos.nth(0).getByRole("checkbox");
		await firstTodoCheckbox.check();

		await expect(firstTodoCheckbox).toBeChecked();

		const filterButtonSet = page.getByLabel(/todo filtering options/i);
		await expect(filterButtonSet).toBeVisible();

		const allFilterButton = filterButtonSet.getByRole("button", {
			name: /toggle \"all/i,
		});
		const incompleteFilterButton = filterButtonSet.getByRole("button", {
			name: /^toggle \"incomplete/i,
		});
		const completedFilterButton = filterButtonSet.getByRole("button", {
			name: /^toggle \"completed/i,
		});

		await expect(allFilterButton).toBeVisible();
		await expect(incompleteFilterButton).toBeVisible();
		await expect(completedFilterButton).toBeVisible();

		expect(allFilterButton).toHaveAttribute("aria-pressed", "true");
		expect(incompleteFilterButton).toHaveText(/incomplete \(1\)/i);
		expect(completedFilterButton).toHaveText(/completed \(1\)/i);

		await incompleteFilterButton.click();

		await expect(allTodos).toHaveCount(1);
		await expect(allTodos.nth(0)).toHaveText(/buy avocado.*/i);
	});

	test("can sort todos using the appropriate buttons", async ({ page }) => {
		const allTodos = page.getByRole("listitem");

		await expect(allTodos).toHaveCount(2);

		const inputField = page.getByRole("textbox", { name: /new todo text/i });
		const addButton = page.getByRole("button", { name: /add/i });

		await expect(inputField).toBeEmpty();

		await inputField.fill(todoText1);
		await addButton.click();

		await expect(allTodos).toHaveCount(3);

		const sortingButtonSet = page.getByLabel(/todo sorting options/i);
		await expect(sortingButtonSet).toBeVisible();

		const defaultSortingButton = sortingButtonSet.getByRole("button", {
			name: /toggle \"default/i,
		});
		const newestFirstSortingButton = sortingButtonSet.getByRole("button", {
			name: /toggle \"date created \(newest first\)/i,
		});
		const oldestFirstSortingButton = sortingButtonSet.getByRole("button", {
			name: /toggle \"date created \(oldest first\)/i,
		});
		const titleSortingButton = sortingButtonSet.getByRole("button", {
			name: /toggle \"title \(a-z\)/i,
		});

		await expect(defaultSortingButton).toBeVisible();
		await expect(newestFirstSortingButton).toBeVisible();
		await expect(oldestFirstSortingButton).toBeVisible();
		await expect(titleSortingButton).toBeVisible();

		const firstTodoCheckbox = allTodos.nth(0).getByRole("checkbox");

		await firstTodoCheckbox.check();
		await expect(allTodos.nth(0)).toHaveText(/do 50 push-ups.*/i);

		await oldestFirstSortingButton.click();

		await expect(allTodos.nth(0)).toHaveText(/buy avocado.*/i);
		await expect(allTodos.nth(1)).toHaveText(/do 50 push-ups.*/i);
		await expect(allTodos.nth(2)).toHaveText(/first todo.*/i);

		await newestFirstSortingButton.click();

		await expect(allTodos.nth(0)).toHaveText(/first todo.*/i);
		await expect(allTodos.nth(1)).toHaveText(/do 50 push-ups.*/i);
		await expect(allTodos.nth(2)).toHaveText(/buy avocado.*/i);

		await titleSortingButton.click();

		await expect(allTodos.nth(0)).toHaveText(/buy avocado.*/i);
		await expect(allTodos.nth(1)).toHaveText(/do 50 push-ups.*/i);
		await expect(allTodos.nth(2)).toHaveText(/first todo.*/i);
	});

	test("can clear completed todos using the appropriate button", async ({
		page,
	}) => {
		const allTodos = page.getByRole("listitem");

		await expect(allTodos).toHaveCount(2);

		const inputField = page.getByRole("textbox", { name: /new todo text/i });
		const addButton = page.getByRole("button", { name: /add/i });

		await expect(inputField).toBeEmpty();

		await inputField.fill(todoText1);
		await addButton.click();

		await expect(allTodos).toHaveCount(3);

		await _sortByNewestFirst(page);

		const firstTodoCheckbox = allTodos.nth(0).getByRole("checkbox");
		const secondTodoCheckbox = allTodos.nth(1).getByRole("checkbox");

		await firstTodoCheckbox.check();
		await secondTodoCheckbox.check();

		await expect(firstTodoCheckbox).toBeChecked();
		await expect(secondTodoCheckbox).toBeChecked();

		await page.getByRole("button", { name: /clear completed/i }).click();

		await expect(
			page.getByText(/you are about to delete 2 completed todo\(s\).*/i),
		).toBeVisible();
		await page.getByRole("button", { name: /^clear completed$/i }).click();

		await expect(page.getByRole("alertdialog")).not.toBeVisible();

		await expect(allTodos).toHaveCount(1);
		await expect(allTodos.nth(0)).toHaveText(/buy avocado.*/i);
	});

	test("can complete all todos using the appropriate button", async ({
		page,
	}) => {
		const allTodos = page.getByRole("listitem");

		await expect(allTodos).toHaveCount(2);

		await page.getByRole("button", { name: /complete all/i }).click();

		await expect(
			page.getByText(
				/you are about to mark 2 incomplete todo\(s\) as completed.*/i,
			),
		).toBeVisible();
		await page.getByRole("button", { name: /^complete all$/i }).click();

		await expect(page.getByRole("alertdialog")).not.toBeVisible();

		await expect(allTodos.nth(0).getByRole("checkbox")).toBeChecked();
		await expect(allTodos.nth(1).getByRole("checkbox")).toBeChecked();
	});
});
