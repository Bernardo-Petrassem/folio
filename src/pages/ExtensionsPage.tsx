import { useStore } from "@/lib/store";

export function ExtensionsPage() {
  const extensions = useStore((s) => s.extensions);
  const toggleExtension = useStore((s) => s.toggleExtension);
  const addWaterGlass = useStore((s) => s.addWaterGlass);
  const waterGlasses = useStore((s) => s.waterGlasses);
  const waterOn = extensions.find((e) => e.id === "ext-water")?.enabled;

  return (
    <div className="px-4 pt-6 pb-10">
      <h1 className="font-serif text-2xl font-semibold">Extensões</h1>
      <p className="mt-1 text-sm text-muted">
        Códigos dos desenvolvedores do Folio que adicionam pequenas funções ao app.
      </p>

      <ul className="mt-6 flex flex-col gap-3">
        {extensions.map((ext) => (
          <li key={ext.id} className="rounded-3xl bg-page p-4 shadow-[var(--shadow-border)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{ext.name}</p>
                <p className="mt-1 text-sm text-muted">{ext.description}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleExtension(ext.id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                  ext.enabled ? "bg-accent text-accent-fg" : "bg-surface text-muted shadow-[var(--shadow-border)]"
                }`}
              >
                {ext.enabled ? "Ativa" : "Ativar"}
              </button>
            </div>
            {ext.id === "ext-water" && waterOn && (
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-surface px-3 py-2">
                <span className="text-sm text-muted">Copos hoje: <strong className="text-fg tabular-nums">{waterGlasses}</strong></span>
                <button type="button" onClick={addWaterGlass} className="rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-fg">
                  +1 copo
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
