"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { wizardSchema, type WizardFormValues } from "@/features/wizard/schema";
import { defaultValues } from "@/features/wizard/defaults";
import { steps } from "@/features/wizard/steps";
import { mapToPdfApplicationData } from "@/features/wizard/mapToPdf";
import { generatePdfBundle } from "@/lib/pdf/generate";

import { WizardShell } from "./_components/WizardShell";
import { StepStatus } from "./_components/steps/StepStatus";
import { StepPersonal } from "./_components/steps/StepPersonal";
import { StepConscience } from "./_components/steps/StepConscience";
import { StepCv } from "./_components/steps/StepCv";
import { StepReview } from "./_components/steps/StepReview";

const stepComponentById = {
  status: StepStatus,
  personal: StepPersonal,
  conscience: StepConscience,
  cv: StepCv,
  review: StepReview,
} as const;

export default function WizardPage() {
  const [stepIndex, setStepIndex] = useState(0);

  const methods = useForm<WizardFormValues>({
    resolver: zodResolver(wizardSchema),
    defaultValues,
    mode: "onBlur",
  });

  const currentStep = steps[stepIndex];
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);

  const StepComponent = useMemo(() => {
    return stepComponentById[currentStep.id];
  }, [currentStep.id]);

  async function onNext() {
    const ok = await methods.trigger(currentStep.fields, { shouldFocus: true });
    if (!ok) return;
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function onPrev() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  async function onDownload() {
    const ok = await methods.trigger(undefined, { shouldFocus: true });
    if (!ok) return;

    const values = methods.getValues();
    const appData = mapToPdfApplicationData(values);

    const { bundleBytes } = await generatePdfBundle(appData);
    const ab = bundleBytes.buffer.slice(
      bundleBytes.byteOffset,
      bundleBytes.byteOffset + bundleBytes.byteLength,
    ) as ArrayBuffer;

    const blob = new Blob([ab], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "KDV_Antrag_Bundle.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <WizardShell
      stepIndex={stepIndex}
      stepsCount={steps.length}
      stepLabel={currentStep.label}
      stepDescription={currentStep.description}
      progress={progress}
      canGoBack={stepIndex > 0}
      canGoNext={stepIndex < steps.length - 1}
      onPrev={onPrev}
      onNext={onNext}
      onDownload={onDownload}
      isLastStep={currentStep.id === "review"}
    >
      <StepComponent methods={methods} />
    </WizardShell>
  );
}
