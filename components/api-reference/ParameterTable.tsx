import { cn } from "@/lib/utils";

export interface Parameter {
  name: string;
  type: string;
  required?: boolean;
  description: string;
  location?: "path" | "query" | "header" | "body";
}

interface ParameterTableProps {
  parameters: Parameter[];
}

export function ParameterTable({ parameters }: ParameterTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--turquoise)]/20">
            <th className="text-left py-2 pr-4 text-[var(--cream)]/60 font-medium">Name</th>
            <th className="text-left py-2 pr-4 text-[var(--cream)]/60 font-medium">Type</th>
            <th className="text-left py-2 pr-4 text-[var(--cream)]/60 font-medium hidden sm:table-cell">Location</th>
            <th className="text-left py-2 text-[var(--cream)]/60 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {parameters.map((param) => (
            <tr key={param.name} className="border-b border-[var(--turquoise)]/10">
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <code className="text-[var(--turquoise)] font-mono">{param.name}</code>
                  {param.required && (
                    <span className="text-xs text-red-400">*</span>
                  )}
                </div>
              </td>
              <td className="py-3 pr-4">
                <code className="text-[var(--cream)]/70 font-mono text-xs bg-[var(--navy)] px-1.5 py-0.5 rounded">
                  {param.type}
                </code>
              </td>
              <td className="py-3 pr-4 hidden sm:table-cell">
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded",
                  param.location === "path" && "bg-amber-500/20 text-amber-400",
                  param.location === "query" && "bg-blue-500/20 text-blue-400",
                  param.location === "header" && "bg-purple-500/20 text-purple-400",
                  param.location === "body" && "bg-emerald-500/20 text-emerald-400",
                )}>
                  {param.location || "body"}
                </span>
              </td>
              <td className="py-3 text-[var(--cream)]/60">{param.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
