import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  makeStyles,
  shorthands,
  tokens,
  TabList,
  Tab,
  Text,
  Badge,
  mergeClasses,
} from "@fluentui/react-components";
import {
  PeopleRegular,
  PeopleTeamRegular,
  DismissRegular,
} from "@fluentui/react-icons";
import { entities, entityGroups, type Entity, type EntityGroup } from "@/data/mockEntities";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("8px"),
    width: "100%",
    maxWidth: "480px",
  },
  label: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase300,
  },
  dropdownWrapper: {
    position: "relative",
    width: "100%",
  },
  customDropdown: {
    position: "absolute",
    top: "100%",
    left: "0",
    right: "0",
    zIndex: 1000,
    marginTop: "4px",
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    boxShadow: tokens.shadow16,
    ...shorthands.borderWidth("1px"),
    ...shorthands.borderStyle("solid"),
    ...shorthands.borderColor(tokens.colorNeutralStroke1),
    ...shorthands.overflow("hidden"),
  },
  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    ...shorthands.padding("10px", "12px"),
    ...shorthands.borderWidth("0"),
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: tokens.colorNeutralStroke2,
    fontSize: tokens.fontSizeBase300,
    outlineStyle: "none",
    backgroundColor: "transparent",
    color: tokens.colorNeutralForeground1,
  },
  optionsList: {
    maxHeight: "320px",
    overflowY: "auto",
    ...shorthands.padding("4px"),
  },
  optionItem: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("2px"),
    ...shorthands.padding("8px", "12px"),
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
  },
  optionMeta: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  emptyState: {
    ...shorthands.padding("24px"),
    textAlign: "center",
    color: tokens.colorNeutralForeground3,
  },
  triggerButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    ...shorthands.padding("8px", "12px"),
    ...shorthands.borderWidth("1px"),
    ...shorthands.borderStyle("solid"),
    ...shorthands.borderColor(tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: "pointer",
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
    minHeight: "36px",
  },
  triggerPlaceholder: {
    color: tokens.colorNeutralForeground4,
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
    ...shorthands.padding("6px", "12px"),
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: tokens.colorNeutralStroke2,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  selectedInfo: {
    display: "flex",
    alignItems: "center",
    ...shorthands.gap("8px"),
    ...shorthands.padding("8px", "12px"),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.borderWidth("1px"),
    ...shorthands.borderStyle("solid"),
    ...shorthands.borderColor(tokens.colorNeutralStroke1),
  },
});

type TabValue = "entities" | "groups";
const PAGE_SIZE = 50;

export function SearchableDropdown() {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabValue>("entities");
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<EntityGroup | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (activeTab === "entities") {
      return q
        ? entities.filter(e => e.name.toLowerCase().includes(q) || e.type.toLowerCase().includes(q))
        : entities;
    } else {
      return q
        ? entityGroups.filter(g => g.name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q))
        : entityGroups;
    }
  }, [search, activeTab]);

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

  const selectEntity = (entity: Entity) => {
    setSelectedEntity(entity);
    setSelectedGroup(null);
    setIsOpen(false);
    setSearch("");
  };

  const selectGroup = (group: EntityGroup) => {
    setSelectedGroup(group);
    setSelectedEntity(null);
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
          const item = visibleItems[focusedIndex];
          if (activeTab === "entities") selectEntity(item as Entity);
          else selectGroup(item as EntityGroup);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
      case "Tab":
        if (e.ctrlKey) {
          e.preventDefault();
          setActiveTab(t => (t === "entities" ? "groups" : "entities"));
        }
        break;
    }
  };

  const openDropdown = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const selectedLabel = selectedEntity?.name || selectedGroup?.name || null;

  return (
    <div className={styles.root}>
      <label className={styles.label} id="dropdown-label">
        Select Entity or Group
      </label>

      <div className={styles.dropdownWrapper} ref={wrapperRef}>
        <button
          className={styles.triggerButton}
          onClick={openDropdown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby="dropdown-label"
          type="button"
        >
          {selectedLabel ? (
            <span>{selectedLabel}</span>
          ) : (
            <span className={styles.triggerPlaceholder}>Search entities or groups…</span>
          )}
          {selectedLabel && (
            <button
              className={styles.clearButton}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEntity(null);
                setSelectedGroup(null);
              }}
              aria-label="Clear selection"
              type="button"
            >
              <DismissRegular fontSize={16} />
            </button>
          )}
        </button>

        {isOpen && (
          <div
            className={styles.customDropdown}
            role="dialog"
            aria-label="Search and select"
            onKeyDown={handleKeyDown}
          >
            <input
              ref={inputRef}
              className={styles.searchInput}
              placeholder={activeTab === "entities" ? "Search entities by name or type…" : "Search groups by name or category…"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search"
              autoComplete="off"
            />

            <TabList
              selectedValue={activeTab}
              onTabSelect={(_, d) => setActiveTab(d.value as TabValue)}
              size="small"
              style={{ padding: "4px 8px 0" }}
            >
              <Tab value="entities" icon={<PeopleRegular />}>Entities</Tab>
              <Tab value="groups" icon={<PeopleTeamRegular />}>Groups</Tab>
            </TabList>

            <div
              ref={listRef}
              className={styles.optionsList}
              role="listbox"
              aria-label={activeTab === "entities" ? "Entities" : "Entity Groups"}
              onScroll={handleScroll}
            >
              {visibleItems.length === 0 ? (
                <div className={styles.emptyState}>
                  <Text>No results found for "{search}"</Text>
                </div>
              ) : activeTab === "entities" ? (
                visibleItems.map((item, idx) => {
                  const entity = item as Entity;
                  return (
                    <div
                      key={entity.id}
                      className={mergeClasses(styles.optionItem, idx === focusedIndex && styles.optionItemFocused)}
                      role="option"
                      aria-selected={selectedEntity?.id === entity.id}
                      onClick={() => selectEntity(entity)}
                      onMouseEnter={() => setFocusedIndex(idx)}
                    >
                      <span className={styles.optionName}>{entity.name}</span>
                      <span className={styles.optionMeta}>{entity.type} · {entity.description}</span>
                    </div>
                  );
                })
              ) : (
                visibleItems.map((item, idx) => {
                  const group = item as EntityGroup;
                  return (
                    <div
                      key={group.id}
                      className={mergeClasses(styles.optionItem, idx === focusedIndex && styles.optionItemFocused)}
                      role="option"
                      aria-selected={selectedGroup?.id === group.id}
                      onClick={() => selectGroup(group)}
                      onMouseEnter={() => setFocusedIndex(idx)}
                    >
                      <span className={styles.optionName}>{group.name}</span>
                      <span className={styles.optionMeta}>{group.category} · {group.memberCount} members</span>
                    </div>
                  );
                })
              )}
            </div>

            <div className={styles.statusBar}>
              <span>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
              <span>↑↓ Navigate · Enter Select · Esc Close · Ctrl+Tab Switch</span>
            </div>
          </div>
        )}
      </div>

      {(selectedEntity || selectedGroup) && (
        <div className={styles.selectedInfo}>
          <Badge appearance="filled" color={selectedEntity ? "brand" : "success"} size="small">
            {selectedEntity ? "Entity" : "Group"}
          </Badge>
          <Text weight="semibold">{selectedEntity?.name || selectedGroup?.name}</Text>
          <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
            {selectedEntity
              ? `${selectedEntity.type} · ${selectedEntity.id}`
              : `${selectedGroup?.category} · ${selectedGroup?.memberCount} members`}
          </Text>
        </div>
      )}
    </div>
  );
}
