import { Page, Locator, expect } from '@playwright/test';
import { SidebarMenuItem } from '../test-data/sidebarMenuData';

export class DashboardPage {
  readonly page: Page;
  readonly sidebarContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebarContainer = page.locator('ul.menu-nav:visible').first();
  }

  /**
   * Asserts sidebar root is rendered
   */
  async assertSidebarLoaded(): Promise<void> {
    await expect(this.sidebarContainer).toBeVisible();
  }

  /**
   * Asserts that a top-level menu item exists in the sidebar
   */
  async assertParentMenuItemExists(name: string, parentIndex = 0): Promise<Locator> {
    const parentItem = this.sidebarContainer
      .locator('> li.menu-item')
      .filter({ has: this.page.locator(`> a.menu-link span.menu-text`, { hasText: name.trim() }) })
      .nth(parentIndex);

    await expect(parentItem).toBeAttached();
    return parentItem;
  }

  /**
   * Asserts sub-item existence attached under parent menu
   */
  async assertSubItemExists(parentItemLocator: Locator, subItemName: string): Promise<void> {
    const subItem = parentItemLocator
      .locator('.menu-submenu .menu-subnav span.menu-text')
      .filter({ hasText: subItemName.trim() })
      .first();

    await expect(subItem).toBeAttached();
  }

  /**
   * Iterates through the entire menu structure and verifies each parent and child item
   */
  async assertAllSidebarOptions(menuData: SidebarMenuItem[]): Promise<void> {
    for (const menu of menuData) {
      // 1. Verify Parent Item
      const parentLocator = await this.assertParentMenuItemExists(menu.parent, menu.parentIndex);

      // 2. Verify Children (if applicable)
      if (menu.hasSubmenu && menu.subItems && menu.subItems.length > 0) {
        await parentLocator.locator('> a.menu-link').click();

        for (const subItemName of menu.subItems) {
          await this.assertSubItemExists(parentLocator, subItemName);
        }

        const actualSubItems = Array.from(
          new Set(
            (await parentLocator.locator('.menu-submenu .menu-subnav span.menu-text').allTextContents())
              .map((text) => text.trim())
              .filter((text) => text && text !== menu.parent),
          ),
        ).sort();
        const expectedSubItems = [...menu.subItems].map((text) => text.trim()).sort();

        expect(actualSubItems).toEqual(expectedSubItems);
      }
    }
  }
}