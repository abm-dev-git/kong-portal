"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Search, ChevronDown, ChevronRight } from "lucide-react";

interface Field {
  name: string;
  description: string;
  type: string;
  example?: string;
}

interface FieldCategory {
  name: string;
  description: string;
  fields: Field[];
}

interface FieldTableProps {
  categories: FieldCategory[];
  entityType: "person" | "company";
}

export function FieldTable({ categories, entityType }: FieldTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map(c => c.name))
  );

  const toggleCategory = (name: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(name)) {
      newExpanded.delete(name);
    } else {
      newExpanded.add(name);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    fields: category.fields.filter(
      field =>
        field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        field.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.fields.length > 0);

  const totalFields = categories.reduce((acc, cat) => acc + cat.fields.length, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className={cn(
            "text-xs",
            entityType === "person"
              ? "bg-[var(--turquoise)]/20 text-[var(--turquoise)] border-[var(--turquoise)]/30"
              : "bg-[var(--electric-blue)]/20 text-[var(--electric-blue)] border-[var(--electric-blue)]/30"
          )}>
            {totalFields} fields
          </Badge>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--cream)]/40" />
          <input
            type="text"
            placeholder="Search fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm bg-[var(--dark-blue)] border border-[var(--turquoise)]/20 rounded-lg text-[var(--cream)] placeholder:text-[var(--cream)]/40 focus:outline-none focus:border-[var(--turquoise)]/50 w-64"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {filteredCategories.map((category) => (
          <div
            key={category.name}
            className="border border-[var(--turquoise)]/20 rounded-lg overflow-hidden"
          >
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.name)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[var(--dark-blue)]/50 hover:bg-[var(--turquoise)]/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                {expandedCategories.has(category.name) ? (
                  <ChevronDown className="w-4 h-4 text-[var(--turquoise)]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[var(--turquoise)]" />
                )}
                <span className="font-medium text-[var(--cream)]">
                  {category.name}
                </span>
                <span className="text-sm text-[var(--cream)]/50">
                  {category.description}
                </span>
              </div>
              <Badge variant="secondary" className="bg-[var(--turquoise)]/10 text-[var(--turquoise)] border-[var(--turquoise)]/20">
                {category.fields.length}
              </Badge>
            </button>

            {/* Fields Table */}
            {expandedCategories.has(category.name) && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--turquoise)]/10 bg-[var(--dark-blue)]/30">
                      <th className="text-left py-2 px-4 text-[var(--cream)]/70 font-medium">Field</th>
                      <th className="text-left py-2 px-4 text-[var(--cream)]/70 font-medium">Type</th>
                      <th className="text-left py-2 px-4 text-[var(--cream)]/70 font-medium">Description</th>
                      <th className="text-left py-2 px-4 text-[var(--cream)]/70 font-medium">Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.fields.map((field) => (
                      <tr
                        key={field.name}
                        className="border-b border-[var(--turquoise)]/5 hover:bg-[var(--turquoise)]/5 transition-colors"
                      >
                        <td className="py-2 px-4">
                          <code className="text-xs px-1.5 py-0.5 rounded bg-[var(--turquoise)]/10 text-[var(--turquoise)]">
                            {field.name}
                          </code>
                        </td>
                        <td className="py-2 px-4 text-[var(--cream)]/60">
                          {field.type}
                        </td>
                        <td className="py-2 px-4 text-[var(--cream)]/70">
                          {field.description}
                        </td>
                        <td className="py-2 px-4 text-[var(--cream)]/50 font-mono text-xs">
                          {field.example || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-8 text-[var(--cream)]/50">
          No fields match your search
        </div>
      )}
    </div>
  );
}
