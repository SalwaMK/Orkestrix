/** Demo seed data for charts and testing */
import { addDays, format } from "date-fns";
import type { Tool } from "@/types";

export type DemoToolInput = Omit<Tool, "id" | "createdAt">;

/**
 * Realistic demo tools with staggered renewal dates.
 * Renewal dates are computed dynamically relative to today.
 */
export function getDemoTools(): DemoToolInput[] {
  const today = new Date();

  return [
    {
      userId: "local",
      toolName: "Notion",
      cost: 1600, // $16.00
      billingCycle: "monthly",
      renewalDate: format(addDays(today, 5), "yyyy-MM-dd"),
      category: "productivity",
      status: "active",
      isAiTool: false,
      notes: "Team wiki",
    },
    {
      userId: "local",
      toolName: "Figma",
      cost: 1500, // $15.00
      billingCycle: "monthly",
      renewalDate: format(addDays(today, 12), "yyyy-MM-dd"),
      category: "design",
      status: "active",
      isAiTool: false,
    },
    {
      userId: "local",
      toolName: "Linear",
      cost: 800, // $8.00
      billingCycle: "monthly",
      renewalDate: format(addDays(today, 20), "yyyy-MM-dd"),
      category: "development",
      status: "active",
      isAiTool: false,
    },
    {
      userId: "local",
      toolName: "Claude Pro",
      cost: 2000, // $20.00
      billingCycle: "monthly",
      renewalDate: format(addDays(today, 3), "yyyy-MM-dd"),
      category: "ai",
      status: "active",
      isAiTool: true,
      notes: "Primary AI assistant",
    },
    {
      userId: "local",
      toolName: "OpenAI API",
      cost: 3400, // $34.00
      billingCycle: "monthly",
      renewalDate: format(addDays(today, 8), "yyyy-MM-dd"),
      category: "ai",
      status: "active",
      isAiTool: true,
    },
    {
      userId: "local",
      toolName: "Vercel",
      cost: 2000, // $20.00
      billingCycle: "monthly",
      renewalDate: format(addDays(today, 45), "yyyy-MM-dd"),
      category: "development",
      status: "active",
      isAiTool: false,
    },
    {
      userId: "local",
      toolName: "GitHub",
      cost: 400, // $4.00
      billingCycle: "monthly",
      renewalDate: format(addDays(today, 60), "yyyy-MM-dd"),
      category: "development",
      status: "active",
      isAiTool: false,
    },
    {
      userId: "local",
      toolName: "Loom",
      cost: 12500, // $125.00 yearly
      billingCycle: "yearly",
      renewalDate: format(addDays(today, 90), "yyyy-MM-dd"),
      category: "communication",
      status: "paused",
      isAiTool: false,
      notes: "Barely use this",
    },
  ];
}

// Module-level guard: prevents double-seeding from React Strict Mode double-mount.
let _seedPromise: Promise<boolean> | null = null;

/**
 * Seeds demo data into the database if it's empty.
 * Only runs in development mode. Safe to call multiple times — deduped internally.
 */
export async function seedDemoData(): Promise<boolean> {
  if (_seedPromise) return _seedPromise;
  _seedPromise = _doSeed();
  return _seedPromise;
}

async function _doSeed(): Promise<boolean> {
  // Only seed in development
  if (!import.meta.env.DEV) {
    return false;
  }

  try {
    // Check if tools already exist
    const response = await fetch("/api/tools");
    if (!response.ok) {
      console.error("Failed to check existing tools");
      return false;
    }

    const existingTools = await response.json();
    if (existingTools.length > 0) {
      console.log("Database already has tools, skipping seed");
      return false;
    }

    // Insert demo tools
    const demoTools = getDemoTools();
    const createdAt = new Date().toISOString();

    for (const tool of demoTools) {
      const fullTool: Tool = {
        ...tool,
        id: crypto.randomUUID(),
        createdAt,
      };

      const insertResponse = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullTool),
      });

      if (!insertResponse.ok) {
        console.error(`Failed to seed tool: ${tool.toolName}`);
      }
    }

    console.log(`✓ Seeded ${demoTools.length} demo tools`);
    return true;
  } catch (error) {
    console.error("Failed to seed demo data:", error);
    return false;
  }
}
