// SPDX-License-Identifier: MPL-2.0

import { useState } from "react";

import { Button } from "@/shared/components/Button";
import { Checkbox } from "@/shared/components/Checkbox";
import { Input } from "@/shared/components/Input";
import { Link } from "@/shared/components/Link";
import { Select } from "@/shared/components/Select";
import { StatusMessage } from "@/shared/components/StatusMessage";
import { Textarea } from "@/shared/components/Textarea";
import PageContainer from "@/shared/layouts/PageContainer";

const categories = [
  "Map",
  "Login / Account",
  "Gameplay",
  "UI / Design",
  "Performance",
  "Other",
] as const;

const severities = ["Low", "Medium", "High", "Critical"] as const;

type Category = (typeof categories)[number];
type Severity = (typeof severities)[number];

interface BugFormState {
  title: string;
  category: Category | "";
  severity: Severity | "";
  description: string;
  steps: string;
  expected: string;
  actual: string;
  reproducible: boolean;
}

const initialForm: BugFormState = {
  title: "",
  category: "",
  severity: "",
  description: "",
  steps: "",
  expected: "",
  actual: "",
  reproducible: false,
};

export default function Bugs() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  const updateField = <K extends keyof BugFormState>(field: K, value: BugFormState[K]) => {
    setSubmitted(false);

    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    const title = form.title.trim();
    const description = form.description.trim();

    if (!form.category || !form.severity || !title || !description) {
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <>
        <h1 className="my-4 text-center text-4xl font-bold">Report a Bug</h1>

        <PageContainer>
          <StatusMessage status="success" title="Bug Report Submitted">
            <p className="mb-4">Thanks for helping improve College Football Risk.</p>

            <Button
              variant="secondary"
              onClick={() => {
                setForm(initialForm);
                setSubmitted(false);
                setSuccess(false);
              }}
            >
              Report Another Bug
            </Button>
          </StatusMessage>
        </PageContainer>
      </>
    );
  }

  return (
    <PageContainer>
      <h1 className="my-4 text-center text-4xl font-bold">Report a Bug</h1>

      <p className="mb-6 text-center text-muted">
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

        <div className="grid gap-6 md:grid-cols-2 pb-4">
          <Select
            label="Category"
            required
            hideLabel={false}
            value={form.category}
            options={categories.map((category) => ({
              label: category,
              value: category,
            }))}
            placeholder="Select a category"
            error={submitted && !form.category ? "Category is required" : undefined}
            onChange={(value) => updateField("category", value as Category | "")}
          />

          <Select
            label="Severity"
            required
            hideLabel={false}
            value={form.severity}
            options={severities.map((severity) => ({
              label: severity,
              value: severity,
            }))}
            placeholder="Select a severity"
            error={submitted && !form.severity ? "Severity is required" : undefined}
            onChange={(value) => updateField("severity", value as Severity | "")}
          />
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

        <div className="border-t border-control-border pt-4">
          <p className="mb-4 text-muted">
            <b>Note:</b> Your browser information and username (if logged in) will be included
            automatically in the bug report.
          </p>

          <div className="flex justify-end">
            <Button type="submit" variant="primary">
              Submit Bug Report
            </Button>
          </div>
        </div>
      </form>
    </PageContainer>
  );
}
