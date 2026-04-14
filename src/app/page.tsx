"use client"

import { toast } from "sonner";

import { useEffect, useMemo, useState } from "react";

const DOT_PURPLE = "#512BD4";
const DOT_PURPLE_LIGHT = "#8662E7";

type Department = "Engineering" | "Product" | "Sales" | "People" | "Finance";

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  department: Department;
  email: string;
  phone: string;
  office: string;
  managerId: string | null;
  hireDate: string;
  leaveBalance: number;
  leaveUsed: number;
  gradient: string;
};

const DEPARTMENTS: Department[] = ["Engineering", "Product", "Sales", "People", "Finance"];

const FIRSTS = [
  "Alex",
  "Maya",
  "Daniel",
  "Priya",
  "Sam",
  "Lia",
  "Ben",
  "Noor",
  "Hana",
  "Ravi",
  "Elena",
  "Jordan",
  "Kira",
  "Mateo",
  "Yuki",
  "Zara",
  "Omar",
  "Isla",
  "Kai",
  "Sana",
  "Theo",
  "Mira",
  "Finn",
  "Lena",
  "Aiden",
  "Nora",
  "Luca",
  "Eden",
  "Rio",
  "Tara",
];
const LASTS = [
  "Chen",
  "Okafor",
  "Iyer",
  "Whittaker",
  "Romero",
  "Grossman",
  "Park",
  "Ahmed",
  "Rossi",
  "Kim",
  "Brooks",
  "Hassan",
  "Patel",
  "Larsen",
  "Nakamura",
  "Tanaka",
  "Silva",
  "Moreno",
  "Wallace",
  "Brandt",
];
const TITLES: Record<Department, string[]> = {
  Engineering: ["Staff Engineer", "Senior Engineer", "Engineering Manager", "Principal Engineer", "Software Engineer II"],
  Product: ["Senior PM", "Group PM", "Product Designer", "PM Lead", "UX Researcher"],
  Sales: ["Account Executive", "Sales Engineer", "RVP Sales", "SDR Lead", "Enterprise AE"],
  People: ["HR Business Partner", "Talent Lead", "People Ops Manager", "Recruiter", "Learning & Development"],
  Finance: ["Controller", "FP&A Lead", "Senior Accountant", "Finance Director", "Treasury Analyst"],
};

const OFFICES = ["Boston HQ", "New York", "Remote — US", "London", "Remote — EU"];
const GRADIENTS = [
  "from-violet-500 to-fuchsia-600",
  "from-indigo-500 to-violet-600",
  "from-purple-500 to-pink-600",
  "from-blue-500 to-indigo-600",
  "from-fuchsia-500 to-purple-600",
];

function seed(i: number, j = 0) {
  const x = Math.sin(i * 9319.1 + j * 7331.7) * 10000;
  return x - Math.floor(x);
}

const EMPLOYEES: Employee[] = Array.from({ length: 30 }, (_, i) => {
  const first = FIRSTS[i];
  const last = LASTS[Math.floor(seed(i + 1) * LASTS.length)];
  const dept = DEPARTMENTS[Math.floor(seed(i + 7) * DEPARTMENTS.length)];
  const title = TITLES[dept][Math.floor(seed(i + 17) * TITLES[dept].length)];
  return {
    id: `E${String(i + 1001).padStart(4, "0")}`,
    firstName: first,
    lastName: last,
    title,
    department: dept,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@solaris.demo`,
    phone: `+1 (617) 555-0${String(100 + i).padStart(3, "0")}`,
    office: OFFICES[Math.floor(seed(i + 29) * OFFICES.length)],
    managerId: i < 5 ? null : `E${String(1001 + Math.floor(seed(i + 37) * 5)).padStart(4, "0")}`,
    hireDate: `20${18 + Math.floor(seed(i + 43) * 8)}-0${1 + Math.floor(seed(i + 47) * 9)}-1${Math.floor(seed(i + 53) * 9)}`,
    leaveBalance: 10 + Math.floor(seed(i + 59) * 12),
    leaveUsed: Math.floor(seed(i + 61) * 8),
    gradient: GRADIENTS[i % GRADIENTS.length],
  };
});

type Tab = "directory" | "org" | "leave";

type SortKey = "lastName" | "department" | "title" | "office" | "hireDate";

export default function DotNetPortal() {
  const [dark, setDark] = useState(false);
  const [tab, setTab] = useState<Tab>("directory");
  const [query, setQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState<Department | "All">("All");
  const [sortKey, setSortKey] = useState<SortKey>("lastName");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Employee | null>(null);

  // Leave form
  const [leaveType, setLeaveType] = useState("Vacation");
  const [leaveStart, setLeaveStart] = useState("");
  const [leaveEnd, setLeaveEnd] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("solaris-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("solaris-theme", next ? "dark" : "light");
  };

  const filtered = useMemo(() => {
    const list = EMPLOYEES.filter((e) => {
      if (deptFilter !== "All" && e.department !== deptFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !`${e.firstName} ${e.lastName}`.toLowerCase().includes(q) &&
          !e.title.toLowerCase().includes(q) &&
          !e.email.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
    list.sort((a, b) => {
      const av = a[sortKey] as string;
      const bv = b[sortKey] as string;
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return list;
  }, [query, deptFilter, sortKey, sortAsc]);

  const pageSize = 12;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(1);
  };

  const deptCounts = useMemo(() => {
    const m = new Map<Department, number>();
    EMPLOYEES.forEach((e) => m.set(e.department, (m.get(e.department) ?? 0) + 1));
    return m;
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block dark:border-slate-800 dark:bg-slate-900"
        style={{ fontFamily: "'Segoe UI', 'SF Pro Display', ui-sans-serif, system-ui" }}
      >
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5 dark:border-slate-800">
          <span
            className="flex h-9 w-9 items-center justify-center rounded text-sm font-bold text-white shadow-md"
            style={{ background: DOT_PURPLE, boxShadow: `0 4px 12px ${DOT_PURPLE}55` }}
          >
            ◆
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Solaris Workplace</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Enterprise portal
            </div>
          </div>
        </div>
        <nav className="flex flex-col p-3">
          {[
            { id: "directory", icon: "👥", label: "Employee Directory" },
            { id: "org", icon: "🏢", label: "Org Chart" },
            { id: "leave", icon: "📅", label: "Leave Management" },
          ].map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id as Tab)}
                className="flex items-center gap-3 rounded px-3 py-2.5 text-left text-sm transition"
                style={
                  active
                    ? { background: DOT_PURPLE, color: "white" }
                    : {}
                }
              >
                <span className="text-base">{t.icon}</span>
                <span className={active ? "font-semibold" : "font-medium"}>{t.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="mx-3 mt-4 rounded border border-slate-200 bg-slate-50 p-4 text-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="font-semibold text-slate-900 dark:text-white">🔐 Single Sign-On</div>
          <div className="mt-1 text-slate-600 dark:text-slate-400">
            Signed in as <span className="font-semibold">shai.a@solaris.demo</span>
          </div>
          <div className="mt-1 text-slate-500 dark:text-slate-500">via Azure AD</div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1">
        <header
          className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 sm:px-6"
          style={{ fontFamily: "'Segoe UI', ui-sans-serif, system-ui" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 lg:hidden">
              <span
                className="flex h-9 w-9 items-center justify-center rounded text-sm font-bold text-white"
                style={{ background: DOT_PURPLE }}
              >
                ◆
              </span>
              <span className="text-sm font-semibold">Solaris Workplace</span>
            </div>
            <div className="hidden text-sm font-semibold lg:block">
              {tab === "directory" ? "Employee Directory" : tab === "org" ? "Organization Chart" : "Leave Management"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 sm:inline-flex dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> SQL Server connected
            </span>
            <button
              type="button"
              onClick={toggleDark}
              className="flex h-9 w-9 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              aria-label="Toggle dark mode"
            >
              {dark ? "☀️" : "🌙"}
            </button>
            <div
              className="flex h-9 items-center gap-2 rounded border border-slate-200 bg-white px-3 text-xs dark:border-slate-800 dark:bg-slate-950"
            >
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                style={{ background: DOT_PURPLE }}
              >
                SA
              </div>
              <span className="hidden font-medium sm:inline">Shai A.</span>
            </div>
          </div>
        </header>

        <main
          className="p-4 sm:p-6 lg:p-8"
          style={{ fontFamily: "'Segoe UI', ui-sans-serif, system-ui" }}
        >
          {tab === "directory" && (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Employee Directory</h1>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {EMPLOYEES.length} employees across {DEPARTMENTS.length} departments.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300" onClick={() => toast("Exporting to Excel...")}>
                    ⬇ Export Excel
                  </button>
                  <button
                    className="rounded px-4 py-1.5 text-xs font-semibold text-white shadow-md"
                    style={{ background: DOT_PURPLE }}
                   onClick={() => toast("Employee form opening...")}>
                    + Add employee
                  </button>
                </div>
              </div>

              {/* Filter bar */}
              <div className="mb-4 flex flex-col gap-3 rounded border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by name, title, or email…"
                  className="flex-1 rounded border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-[#512BD4] dark:border-slate-700 dark:bg-slate-950"
                />
                <select
                  value={deptFilter}
                  onChange={(e) => {
                    setDeptFilter(e.target.value as Department | "All");
                    setPage(1);
                  }}
                  className="rounded border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="All">All departments ({EMPLOYEES.length})</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d} ({deptCounts.get(d) ?? 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Data grid */}
              <div className="overflow-hidden rounded border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b-2 bg-slate-50 dark:bg-slate-950" style={{ borderColor: DOT_PURPLE }}>
                        <SortTh label="Name" active={sortKey === "lastName"} asc={sortAsc} onClick={() => toggleSort("lastName")} />
                        <SortTh label="Title" active={sortKey === "title"} asc={sortAsc} onClick={() => toggleSort("title")} />
                        <SortTh label="Department" active={sortKey === "department"} asc={sortAsc} onClick={() => toggleSort("department")} />
                        <SortTh label="Office" active={sortKey === "office"} asc={sortAsc} onClick={() => toggleSort("office")} />
                        <SortTh label="Hire Date" active={sortKey === "hireDate"} asc={sortAsc} onClick={() => toggleSort("hireDate")} />
                        <th className="px-4 py-2 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paged.map((e) => (
                        <tr
                          key={e.id}
                          onClick={() => setSelected(e)}
                          className="cursor-pointer border-b border-slate-100 transition hover:bg-violet-50/30 dark:border-slate-800 dark:hover:bg-violet-500/5"
                        >
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${e.gradient} text-[10px] font-semibold text-white`}
                              >
                                {e.firstName[0]}
                                {e.lastName[0]}
                              </div>
                              <div>
                                <div className="font-medium">
                                  {e.firstName} {e.lastName}
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                  {e.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{e.title}</td>
                          <td className="px-4 py-2.5">
                            <span
                              className="rounded px-2 py-0.5 text-[10px] font-semibold"
                              style={{ background: `${DOT_PURPLE}15`, color: DOT_PURPLE }}
                            >
                              {e.department}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{e.office}</td>
                          <td className="px-4 py-2.5 font-mono text-xs text-slate-500 dark:text-slate-400">
                            {e.hireDate}
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <button
                              className="rounded border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                              onClick={(ev) => {
                                ev.stopPropagation();
                                setSelected(e);
                              }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div
                  className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400"
                >
                  <span>
                    Showing {(page - 1) * pageSize + 1}–
                    {Math.min(page * pageSize, filtered.length)} of {filtered.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="rounded border border-slate-200 px-2 py-1 font-semibold disabled:opacity-40 dark:border-slate-700"
                    >
                      ‹ Prev
                    </button>
                    {Array.from({ length: pageCount }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPage(i + 1)}
                        className="rounded px-3 py-1 font-semibold"
                        style={
                          i + 1 === page
                            ? { background: DOT_PURPLE, color: "white" }
                            : {}
                        }
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={page === pageCount}
                      onClick={() => setPage(page + 1)}
                      className="rounded border border-slate-200 px-2 py-1 font-semibold disabled:opacity-40 dark:border-slate-700"
                    >
                      Next ›
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === "org" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">Organization Chart</h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Reporting hierarchy across 5 departments.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {DEPARTMENTS.map((dept) => {
                  const list = EMPLOYEES.filter((e) => e.department === dept).slice(0, 4);
                  return (
                    <div
                      key={dept}
                      className="rounded border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-800">
                        <div className="text-sm font-semibold">{dept}</div>
                        <span
                          className="rounded px-2 py-0.5 text-[10px] font-semibold"
                          style={{ background: `${DOT_PURPLE}15`, color: DOT_PURPLE }}
                        >
                          {deptCounts.get(dept)}
                        </span>
                      </div>
                      <ul className="flex flex-col gap-2">
                        {list.map((e) => (
                          <li key={e.id} className="flex items-center gap-2 text-xs">
                            <div
                              className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${e.gradient} text-[9px] font-semibold text-white`}
                            >
                              {e.firstName[0]}
                              {e.lastName[0]}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">
                                {e.firstName} {e.lastName}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                {e.title}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {tab === "leave" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">Leave Management</h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Request time off and track your balance.
                </p>
              </div>
              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <form
                  className="rounded border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setLeaveSubmitted(true);
                  }}
                >
                  <div className="mb-5 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    New leave request
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1 sm:col-span-2">
                      <span className="text-xs font-semibold">Type of leave</span>
                      <select
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                        className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
                      >
                        <option>Vacation</option>
                        <option>Sick</option>
                        <option>Personal</option>
                        <option>Bereavement</option>
                        <option>Unpaid</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-semibold">Start date</span>
                      <input
                        type="date"
                        value={leaveStart}
                        onChange={(e) => setLeaveStart(e.target.value)}
                        className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-semibold">End date</span>
                      <input
                        type="date"
                        value={leaveEnd}
                        onChange={(e) => setLeaveEnd(e.target.value)}
                        className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
                      />
                    </label>
                    <label className="flex flex-col gap-1 sm:col-span-2">
                      <span className="text-xs font-semibold">Reason / notes</span>
                      <textarea
                        rows={3}
                        value={leaveReason}
                        onChange={(e) => setLeaveReason(e.target.value)}
                        placeholder="Quick note for your manager (optional)"
                        className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-950"
                      />
                    </label>
                  </div>
                  {leaveSubmitted && (
                    <div
                      className="mt-4 rounded border px-4 py-3 text-sm"
                      style={{
                        background: `${DOT_PURPLE}10`,
                        borderColor: `${DOT_PURPLE}33`,
                        color: DOT_PURPLE,
                      }}
                    >
                      ✓ Leave request submitted. Routed to your manager for approval.
                    </div>
                  )}
                  <div className="mt-5 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      className="rounded border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                     onClick={() => toast("Draft saved")}>
                      Save draft
                    </button>
                    <button
                      type="submit"
                      className="rounded px-5 py-2 text-sm font-semibold text-white shadow-md"
                      style={{ background: DOT_PURPLE }}
                     onClick={() => toast("Request submitted")}>
                      Submit request
                    </button>
                  </div>
                </form>

                <aside className="space-y-4">
                  <div className="rounded border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Your balance
                    </div>
                    <div className="mt-3">
                      <div className="text-3xl font-bold" style={{ color: DOT_PURPLE }}>
                        14 days
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        remaining in FY 2026
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-xs">
                      <BalanceRow label="Vacation" used={4} total={14} />
                      <BalanceRow label="Sick" used={1} total={5} />
                      <BalanceRow label="Personal" used={0} total={3} />
                    </div>
                  </div>
                  <div className="rounded border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Upcoming time off
                    </div>
                    <ul className="mt-3 space-y-2 text-xs">
                      <li className="flex items-center justify-between">
                        <span>Memorial Day</span>
                        <span className="text-slate-500">May 26</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Independence Day</span>
                        <span className="text-slate-500">Jul 4</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Labor Day</span>
                        <span className="text-slate-500">Sep 1</span>
                      </li>
                    </ul>
                  </div>
                </aside>
              </div>
            </>
          )}
        </main>

        <footer
          className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
          style={{ fontFamily: "'Segoe UI', ui-sans-serif, system-ui" }}
        >
          Built with ASP.NET Core 8 + Blazor · © {new Date().getFullYear()} Solaris Workplace
        </footer>
      </div>

      {selected && (
        <EmployeeDetailModal employee={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function SortTh({
  label,
  active,
  asc,
  onClick,
}: {
  label: string;
  active: boolean;
  asc: boolean;
  onClick: () => void;
}) {
  return (
    <th
      onClick={onClick}
      className="cursor-pointer select-none px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400"
    >
      {label} {active ? (asc ? "↑" : "↓") : ""}
    </th>
  );
}

function BalanceRow({ label, used, total }: { label: string; used: number; total: number }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="font-medium">{label}</span>
        <span className="text-slate-500 dark:text-slate-400">
          {total - used} / {total} days left
        </span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full"
          style={{ width: `${((total - used) / total) * 100}%`, background: DOT_PURPLE }}
        />
      </div>
    </div>
  );
}

function EmployeeDetailModal({
  employee,
  onClose,
}: {
  employee: Employee;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "'Segoe UI', ui-sans-serif, system-ui" }}
      >
        <div
          className="relative p-6"
          style={{ background: `linear-gradient(135deg, ${DOT_PURPLE}, ${DOT_PURPLE_LIGHT})` }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white"
          >
            ✕
          </button>
          <div className="flex items-center gap-4">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${employee.gradient} text-lg font-bold text-white ring-4 ring-white/30`}
            >
              {employee.firstName[0]}
              {employee.lastName[0]}
            </div>
            <div className="text-white">
              <div className="text-xl font-semibold">
                {employee.firstName} {employee.lastName}
              </div>
              <div className="text-sm opacity-90">{employee.title}</div>
              <div className="mt-1 font-mono text-[10px] opacity-75">{employee.id}</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 p-6 text-sm">
          <Field label="Department" value={employee.department} />
          <Field label="Office" value={employee.office} />
          <Field label="Email" value={employee.email} />
          <Field label="Phone" value={employee.phone} />
          <Field label="Hire date" value={employee.hireDate} />
          <Field
            label="Leave balance"
            value={`${employee.leaveBalance} days (${employee.leaveUsed} used)`}
          />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}
