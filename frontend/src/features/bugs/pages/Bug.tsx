// SPDX-License-Identifier: MPL-2.0

import { useRef, useState } from "react";
import { Button } from "@/shared/components/Button";
import { Checkbox, Input, Textarea } from "@/shared/components/form";
import { Link } from "@/shared/components/Link";
import { Loader } from "@/shared/components/Loader";
import { Select } from "@/shared/components/Select";
import { StatusMessage } from "@/shared/components/StatusMessage";
import { PageContainer } from "@/shared/layouts/PageContainer";
import {
  type BugForm,
  bugCategoryOptions,
  bugSeverityOptions,
  type Category,
  createBugPayload,
  type Severity,
} from "../api/bug";
import { useCreateBug } from "../hooks/useBug";

const initialForm: BugForm = {
  title: "",
  category: "",
  severity: "",
  description: "",
  steps: "",
  expected: "",
  actual: "",
  reproducible: false,
};

export function Bugs() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const createBugMutation = useCreateBug();
  const formRef = useRef<HTMLFormElement>(null);
  const updateField = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setSubmitted(true);

    const { category, severity } = form;

    if (!category || !severity || !form.title.trim() || !form.description.trim()) {
      requestAnimationFrame(() => {
        const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');

        firstInvalid?.focus({ preventScroll: true });
        firstInvalid?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });

      return;
    }

    createBugMutation.mutate(createBugPayload({ ...form, category, severity }));
  };

  if (createBugMutation.isSuccess) {
    return (
      <PageContainer>
        <h1 className="my-4 text-center font-bold text-4xl">Report a Bug</h1>
        <StatusMessage status="success" title="Bug Report Submitted">
          <p className="mb-4">{createBugMutation.data.message}</p>

          <Button
            variant="secondary"
            onClick={() => {
              setForm(initialForm);
              setSubmitted(false);
              createBugMutation.reset();
            }}
          >
            Report Another Bug
          </Button>
        </StatusMessage>
      </PageContainer>
    );
  }

  if (createBugMutation.isPending) {
    return (
      <PageContainer>
        <h1 className="my-4 text-center font-bold text-4xl">Report a Bug</h1>
        <Loader label="Submitting your bug report..." size="lg" fullHeight />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="my-4 text-center font-bold text-4xl">Report a Bug</h1>

      <p className="mb-6 text-center">
        Found something that isn't working correctly? Tell us what happened and we'll take a look.
      </p>

      <p className="mb-6">
        <b>Note:</b> This request form is only meant for submitting bugs regarding the website not
        functioning properly. For feature requests or suggestions, please either submit a ticket
        through the{" "}
        <Link
          external
          href="https://discord.com/channels/1085080625159090226/1085080625805004900"
          aria-label="College Football Risk Discord"
        >
          CFBR Discord Channel
        </Link>{" "}
        or{" "}
        <Link external href="https://discord.com/users/683329382952992791">
          message me directly through Discord
        </Link>
        .
      </p>

      <form
        ref={formRef}
        noValidate
        className="space-y-6 rounded-lg border border-control-border bg-control p-5 shadow-lg"
        onSubmit={handleSubmit}
      >
        <Input
          label="Bug title"
          required
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
          error={submitted && !form.title.trim() ? "Bug title is required" : undefined}
        />

        <div className="grid gap-x-6 gap-y-8 md:grid-cols-2">
          <div className="min-w-0">
            <Select
              label="Category"
              required
              value={form.category}
              hideLabel={false}
              options={bugCategoryOptions}
              placeholder="Select a category"
              error={submitted && !form.category ? "Category is required" : undefined}
              onChange={(value) => updateField("category", value as Category | "")}
            />
          </div>

          <div className="min-w-0">
            <Select
              label="Severity"
              required
              value={form.severity}
              hideLabel={false}
              options={bugSeverityOptions}
              placeholder="Select a severity"
              error={submitted && !form.severity ? "Severity is required" : undefined}
              onChange={(value) => updateField("severity", value as Severity | "")}
            />
          </div>
        </div>

        <Textarea
          label="What happened?"
          required
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Describe the problem and what you were doing when it occurred."
          error={submitted && !form.description.trim() ? "Description is required" : undefined}
        />

        <Textarea
          label="Steps to reproduce"
          value={form.steps}
          onChange={(event) => updateField("steps", event.target.value)}
          placeholder={"1. Go to ...\n2. Click ...\n3. Notice ..."}
        />

        <Textarea
          label="What did you expect to happen?"
          value={form.expected}
          onChange={(event) => updateField("expected", event.target.value)}
          placeholder="Describe what you expected to happen."
        />

        <Textarea
          label="What actually happened?"
          value={form.actual}
          onChange={(event) => updateField("actual", event.target.value)}
          placeholder="Describe what happened instead."
        />

        <Checkbox
          label="I can reproduce this problem consistently."
          checked={form.reproducible}
          onChange={(event) => updateField("reproducible", event.target.checked)}
        />

        <div className="border-control-border border-t pt-4">
          <p className="mb-4">
            <b>Note:</b> Your browser information and username (if logged in) will be included
            automatically in the bug report.
          </p>

          {createBugMutation.isError && (
            <div className="mb-4">
              <StatusMessage status="failure" title="Unable to Submit Bug Report">
                <p>{createBugMutation.error.message}</p>
              </StatusMessage>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={createBugMutation.isPending}>
              {createBugMutation.isPending ? "Submitting..." : "Submit Bug Report"}
            </Button>
          </div>
        </div>
      </form>
    </PageContainer>
  );
}
