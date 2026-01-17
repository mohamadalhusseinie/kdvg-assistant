type Props = {
    stepIndex: number;
    stepsCount: number;
    label: string;
    progress: number;
};

export function WizardProgress({ stepIndex, stepsCount, label, progress }: Props) {
    return (
        <div className="flex flex-col gap-4">
            <div className="h-2 overflow-hidden rounded-full bg-accent">
                <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                    role="progressbar"
                />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Schritt {stepIndex + 1} von {stepsCount}: {label}
        </span>
                <span>{progress}%</span>
            </div>
        </div>
    );
}