import { useState } from "react";

import { Select } from "@/shared/components/Select";

function SettingsPage() {
  const [pageSize, setPageSize] = useState(10);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background p-8 text-foreground">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold">Settings</h1>

        <div className="mt-8 rounded-card border border-border bg-card p-6 text-card-foreground">
          <Select
            label="test"
            hideLabel={false}
            value={pageSize}
            options={[
              { label: "5", value: 5 },
              { label: "10", value: 10 },
              { label: "15", value: 15 },
              { label: "20", value: 20 },
              { label: "25", value: 25 },
              { label: "50", value: 50 },
              { label: "100", value: 100 },
            ]}
            onChange={(value) => {
              if (value !== "") {
                setPageSize(value);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
