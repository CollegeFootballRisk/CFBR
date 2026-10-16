import type { Schema } from "@/shared/api";
import { api } from "@/shared/api/client";
import { BugCategory, BugSeverity } from "@/shared/api/schema/enums";
import { enumToOptions } from "@/shared/utils/enumOptions";

export type Category = Schema<"BugCategory">;
export type Severity = Schema<"BugSeverity">;

export type BugCreateRequest = Schema<"BugCreate">;

export interface BugForm {
  title: string;
  category: Category | "";
  severity: Severity | "";
  description: string;
  steps: string;
  expected: string;
  actual: string;
  reproducible: boolean;
}

export const bugCategoryOptions = enumToOptions(BugCategory);
export const bugSeverityOptions = enumToOptions(BugSeverity);

export function createBugPayload(
  form: BugForm & { category: Category; severity: Severity },
): BugCreateRequest {
  return {
    title: form.title.trim(),
    category: form.category,
    severity: form.severity,
    description: form.description.trim(),
    reproductionSteps: form.steps.trim() || null,
    expectedBehavior: form.expected.trim() || null,
    actualBehavior: form.actual.trim() || null,
    canProduceConsistently: form.reproducible,
    userAgent: navigator.userAgent,
    pageUrl: window.location.href,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    locale: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    appVersion: __APP_VERSION__,
    gitCommit: __GIT_COMMIT__,
  };
}

export function createBug(payload: BugCreateRequest) {
  return api.post<null>("/api/bugs", payload);
}
