import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  makeStyles,
  shorthands,
  tokens,
  TabList,
  Tab,
  Text,
  mergeClasses,
} from "@fluentui/react-components";
import {
  PeopleRegular,
  PeopleTeamRegular,
  DismissRegular,
  ChevronDownRegular,
} from "@fluentui/react-icons";
import type { TabbedItem } from "@/data/mockData";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  dropdownWrapper: {
    position: "relative",
    width: "100%",
  },
  triggerButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    ...shorthands.padding("4px", "8px"),
    ...shorthands.borderWidth("1px"),
    ...shorthands.borderStyle("solid"),
    ...shorthands.borderColor(tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: "pointer",
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground1,
    minHeight: "30px",
  },
  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    ...shorthands.borderWidth("0"),
    fontSize: tokens.fontSizeBase200,
    outlineStyle: "none",
    backgroundColor: "transparent",
    color: tokens.colorNeutralForeground1,
    ...shorthands.padding("0"),
  },
  searchInputInDropdown: {
    width: "100%",
    boxSizing: "border-box",
    ...shorthands.padding("8px", "12px"),
    ...shorthands.borderWidth("0"),
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: tokens.colorNeutralStroke2,
    fontSize: tokens.fontSizeBase300,
    outlineStyle: "none",
    backgroundColor: "transparent",
    color: tokens.colorNeutralForeground1,
  },
  customDropdown: {
    position: "absolute",
    top: "100%",
    left: "0",
    right: "0",
    zIndex: 1000,
    marginTop: "2px",
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    boxShadow: tokens.shadow16,
    ...shorthands.borderWidth("1px"),
    ...shorthands.borderStyle("solid"),
    ...shorthands.borderColor(tokens.colorNeutralStroke1),
    ...shorthands.overflow("hidden"),
    minWidth: "280px",
  },
  optionsList: {
    maxHeight: "240px",
    overflowY: "auto",
    ...shorthands.padding("4px"),
  },
  optionItem: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("1px"),
    ...shorthands.padding("6px", "10px"),
    cursor: "pointer",
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  optionItemFocused: {
    backgroundColor: tokens.colorNeutralBackground1Hover,
    outlineWidth: "2px",
    outlineStyle: "solid",
    outlineColor: tokens.colorBrandStroke1,
    outlineOffset: "-2px",
  },
  optionName: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase200,
  },
  optionMeta: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
  emptyState: {
    ...shorthands.padding("16px"),
    textAlign: "center",
    color: tokens.colorNeutralForeground3,
  },
  clearButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...shorthands.borderWidth("0"),
    backgroundColor: "transparent",
    cursor: "pointer",
    color: tokens.colorNeutralForeground3,
    ...shorthands.padding("2px"),
    ...shorthands.borderRadius("50%"),
  },
  statusBar: {
    display: "flex",
    justifyContent: "space-between",
    ...shorthands.padding("4px", "10px"),
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: tokens.colorNeutralStroke2,
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
});

interface TabDef {
  value: string;
  label: string;
  icon: "entity" | "group";
  items: TabbedItem[];
}

interface TabbedSearchDropdownProps {
  tabs: TabDef[];
  placeholder?: string;
  selectedItem: TabbedItem | null;
  onSelect: (item: TabbedItem) => void;
  onClear: () => void;
}

const PAGE_SIZE = 50;

const iconMap = {
  entity: <PeopleRegular fontSize={14} />,
  group: <PeopleTeamRegular fontSize={14} />,
};

export function TabbedSearchDropdown({
  tabs,
  placeholder = "Search…",
  selectedItem,
  onSelect,
  onClear,
}: TabbedSearchDropdownProps) {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(tabs[0]?.value ?? "");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const triggerRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const currentTab = tabs.find(t => t.value === activeTab) ?? tabs[0];

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!currentTab) return [];
    return q
      ? currentTab.items.filter(item =>
          item.name.toLowerCase().includes(q) || item.meta.toLowerCase().includes(q)
        )
      : currentTab.items;
  }, [search, currentTab]);

  const visibleItems = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  useEffect(() => {
    setFocusedIndex(-1);
    setVisibleCount(PAGE_SIZE);
  }, [search, activeTab]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleScroll = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      setVisibleCount(c => Math.min(c + PAGE_SIZE, filtered.length));
    }
  }, [filtered.length]);

  useEffect(() => {
    if (focusedIndex < 0) return;
    const el = listRef.current?.children[focusedIndex] as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex]);

  const handleSelect = (item: TabbedItem) => {
    onSelect(item);
    setIsOpen(false);
    setSearch("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex(i => Math.min(i + 1, visibleItems.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex(i => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < visibleItems.length) {
          handleSelect(visibleItems[focusedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
      case "Tab":
        if (e.ctrlKey) {
          e.preventDefault();
          const idx = tabs.findIndex(t => t.value === activeTab);
          setActiveTab(tabs[(idx + 1) % tabs.length].value);
        }
        break;
    }
  };

  const selectedLabel = selectedItem?.name ?? "";

  return (
    <div className={styles.root}>
      <div className={styles.dropdownWrapper} ref={wrapperRef}>
        <div className={styles.triggerButton} onClick={() => triggerRef.current?.focus()}>
          <input
            ref={triggerRef}
            className={styles.searchInput}
            placeholder={placeholder}
            value={search || (isOpen ? "" : selectedLabel)}
            onChange={e => {
              setSearch(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-label={placeholder}
            autoComplete="off"
          />
          {(search || selectedItem) ? (
            <button
              className={styles.clearButton}
              onClick={e => {
                e.stopPropagation();
                setSearch("");
                onClear();
                triggerRef.current?.focus();
              }}
              aria-label="Clear"
              type="button"
            >
              <DismissRegular fontSize={14} />
            </button>
          ) : (
            <ChevronDownRegular fontSize={14} style={{ color: tokens.colorNeutralForeground3, flexShrink: 0 }} />
          )}
        </div>

        {isOpen && (
          <div className={styles.customDropdown} role="dialog" aria-label="Search and select">
            {tabs.length > 1 && (
              <TabList
                selectedValue={activeTab}
                onTabSelect={(_, d) => setActiveTab(d.value as string)}
                size="small"
                style={{ padding: "4px 8px 0" }}
              >
                {tabs.map(tab => (
                  <Tab key={tab.value} value={tab.value} icon={iconMap[tab.icon]} tabIndex={-1}>
                    {tab.label}
                  </Tab>
                ))}
              </TabList>
            )}

            <div
              ref={listRef}
              className={styles.optionsList}
              role="listbox"
              onScroll={handleScroll}
            >
              {visibleItems.length === 0 ? (
                <div className={styles.emptyState}>
                  <Text size={200}>No results for "{search}"</Text>
                </div>
              ) : (
                visibleItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className={mergeClasses(styles.optionItem, idx === focusedIndex && styles.optionItemFocused)}
                    role="option"
                    aria-selected={selectedItem?.id === item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setFocusedIndex(idx)}
                  >
                    <span className={styles.optionName}>{item.name}</span>
                    <span className={styles.optionMeta}>{item.meta}</span>
                  </div>
                ))
              )}
            </div>

            <div className={styles.statusBar}>
              <span>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
              <span>↑↓ · Enter · Esc{tabs.length > 1 ? " · Ctrl+Tab" : ""}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
