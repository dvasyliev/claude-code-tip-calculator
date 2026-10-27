"use client";

import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./page.module.css";
import { DEFAULTS } from "@/types/tip-state";
import { formatCurrency } from "@/utils/format";
import {
  tipFormSchema,
  billValueSchema,
  tipValueSchema,
  peopleValueSchema,
  type TipForm,
} from "@/utils/validation";
import { useTipCalculator } from "@/hooks/useTipCalculator";
import { FieldInput } from "@/components/field-input/field-input";
import { ComputedField } from "@/components/computed-field/computed-field";
import { SplitSection } from "@/components/split-section/split-section";

function App() {
  const { control, setValue, reset } = useForm<TipForm>({
    resolver: zodResolver(tipFormSchema),
    defaultValues: DEFAULTS,
  });
  const [bill, tip, people] = useWatch({
    control,
    name: ["bill", "tip", "people"],
  });
  const [splitOpen, setSplitOpen] = useState(false);

  const { tipAmount, total, tipPerPerson, totalPerPerson } = useTipCalculator(
    bill,
    tip,
    people,
  );

  const handleReset = () => {
    reset(DEFAULTS);
    setSplitOpen(false);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles["page-title"]}>Tip Calculator</h1>
      <div className={styles.card}>
        <div className={styles["split-row"]}>
          <Controller
            control={control}
            name="bill"
            render={({ field }) => (
              <FieldInput
                label="Bill"
                value={field.value}
                type="text"
                inputMode="decimal"
                onChange={(e) => {
                  if (
                    tipFormSchema.shape.bill.safeParse(e.target.value).success
                  )
                    field.onChange(e.target.value);
                }}
                onBlur={() => {
                  setValue("bill", billValueSchema.parse(field.value));
                  field.onBlur();
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="tip"
            render={({ field }) => (
              <FieldInput
                label="Tip"
                value={field.value}
                type="number"
                min="0"
                max="100"
                onChange={(e) => {
                  if (tipFormSchema.shape.tip.safeParse(e.target.value).success)
                    field.onChange(e.target.value);
                }}
                onBlur={() => {
                  setValue("tip", tipValueSchema.parse(field.value));
                  field.onBlur();
                }}
              />
            )}
          />
        </div>

        <div className={styles["split-row"]}>
          <ComputedField label="Tip amount" value={formatCurrency(tipAmount)} />
          <ComputedField label="Total" value={formatCurrency(total)} />
        </div>

        <div className={styles.divider} />

        <SplitSection
          label="Are you splitting the bill?"
          open={splitOpen}
          onToggle={() => setSplitOpen((o) => !o)}
        >
          <Controller
            control={control}
            name="people"
            render={({ field }) => (
              <FieldInput
                label="Number of people"
                value={field.value}
                type="number"
                min="2"
                max="50"
                onChange={(e) => {
                  if (
                    tipFormSchema.shape.people.safeParse(e.target.value).success
                  )
                    field.onChange(e.target.value);
                }}
                onBlur={() => {
                  setValue("people", peopleValueSchema.parse(field.value));
                  field.onBlur();
                }}
              />
            )}
          />
          <div className={styles["split-row"]}>
            <ComputedField
              label="Tip per person"
              value={formatCurrency(tipPerPerson)}
            />
            <ComputedField
              label="Total per person"
              value={formatCurrency(totalPerPerson)}
            />
          </div>
        </SplitSection>

        <button className={styles["reset-btn"]} onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
