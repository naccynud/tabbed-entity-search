import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  makeStyles,
  shorthands,
  tokens,
  Text,
  mergeClasses,
} from "@fluentui/react-components";
import { DismissRegular, ChevronDownRegular } from "@fluentui/react-icons";
import type { SimpleItem } from "@/data/mockData";

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
    minWidth: "220px",
  },
  optionsList: {
    maxHeight: "240px",
    overflowY: "auto",
    ...shorthands.padding("4px"),
  },
  optionItem: {
    display: "flex",
    ...shorthands.gap("8px"),
    ...shorthands.padding("6px", "10px"),
    cursor: "pointer",
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    fontSize: tokens.fontSizeBase200,
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
  optionCode: {
    fontWeight: tokens.fontWeightSemibold,
    minWidth: "40px",
  },
  optionDesc: {
    color: tokens.colorNeutralForeground2,
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
});

interface SimpleSearchDropdownProps {
  items: SimpleItem[];
  placeholder?: string;
  selectedItem: SimpleItem | null;
  onSelect: (item: SimpleItem) => void;
  onClear: () => void;
}

export function SimpleSearchDropdown({
  items,
  placeholder = "Search…",
  selectedItem,
  onSelect,
  onClear,
}: SimpleSearchDropdownProps) {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const triggerRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return q
      ? items.filter(item =>
          item.code.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
        )
      : items;
  }, [search, items]);

  useEffect(() => { setFocusedIndex(-1); }, [search]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (focusedIndex < 0) return;
    const el = listRef.current?.children[focusedIndex] as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex]);

  const handleScroll = useCallback(() => {
    // All items rendered for simple lists (typically < 100 items)
  }, []);

  const handleSelect = (item: SimpleItem) => {
    onSelect(item);
    setIsOpen(false);
    setSearch("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex(i => Math.min(i + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex(i => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filtered.length) {
          handleSelect(filtered[focusedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  const selectedLabel = selectedItem ? `${selectedItem.code} ${selectedItem.description}` : "";

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
            <div
              ref={listRef}
              className={styles.optionsList}
              role="listbox"
              onScroll={handleScroll}
            >
              {filtered.length === 0 ? (
                <div className={styles.emptyState}>
                  <Text size={200}>No results for "{search}"</Text>
                </div>
              ) : (
                filtered.map((item, idx) => (
                  <div
                    key={item.id}
                    className={mergeClasses(styles.optionItem, idx === focusedIndex && styles.optionItemFocused)}
                    role="option"
                    aria-selected={selectedItem?.id === item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setFocusedIndex(idx)}
                  >
                    <span className={styles.optionCode}>{item.code}</span>
                    <span className={styles.optionDesc}>{item.description}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
