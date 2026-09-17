"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CURRENCIES } from "@/lib/domain";

type Props = {
  query: {
    search?: string;
    category?: string;
    currency?: string;
    platform?: string;
    from?: string;
    to?: string;
  };
  gameCategories: { id: string; name: string }[];
  platforms: { id: string; name: string }[];
};

export function SessionFilters({ query, gameCategories, platforms }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParams = useRef(searchParams.toString());

  useEffect(() => {
    filterParams.current = searchParams.toString();
  }, [searchParams]);

  function updateFilter(name: string, value: string) {
    const params = new URLSearchParams(filterParams.current);
    if (value) params.set(name, value);
    else params.delete(name);
    const suffix = params.toString();
    filterParams.current = suffix;
    router.replace(suffix ? `/sessions?${suffix}` : "/sessions", { scroll: false });
  }

  return (
    <div className="panel filter-grid mt-8">
      <label className="field">
        <span>Search</span>
        <input
          defaultValue={query.search}
          placeholder="Platform or notes"
          onChange={(event) => updateFilter("search", event.target.value)}
        />
      </label>
      <label className="field">
        <span>Game type</span>
        <select
          defaultValue={query.category}
          onChange={(event) => updateFilter("category", event.target.value)}
        >
          <option value="">All</option>
          {gameCategories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Platform</span>
        <select
          defaultValue={query.platform}
          onChange={(event) => updateFilter("platform", event.target.value)}
        >
          <option value="">All</option>
          {platforms.map((platform) => (
            <option key={platform.id} value={platform.id}>{platform.name}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Currency</span>
        <select
          defaultValue={query.currency}
          onChange={(event) => updateFilter("currency", event.target.value)}
        >
          <option value="">All</option>
          {CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}
        </select>
      </label>
      <label className="field">
        <span>From</span>
        <input
          type="date"
          defaultValue={query.from}
          onChange={(event) => updateFilter("from", event.target.value)}
        />
      </label>
      <label className="field">
        <span>To</span>
        <input
          type="date"
          defaultValue={query.to}
          onChange={(event) => updateFilter("to", event.target.value)}
        />
      </label>
    </div>
  );
}
