import { useState } from "react";
import {
  makeStyles,
  shorthands,
  tokens,
  Text,
  Tooltip,
  mergeClasses,
} from "@fluentui/react-components";
import {
  ChevronUpRegular,
  ChevronDownRegular,
  MoreHorizontalRegular,
} from "@fluentui/react-icons";
import { TabbedSearchDropdown } from "./TabbedSearchDropdown";
import { SimpleSearchDropdown } from "./SimpleSearchDropdown";
import type { TabbedItem, SimpleItem } from "@/data/mockData";
import {
  entityItems,
  entityGroupItems,
  allJurisdictionItems,
  jurisdictionGroupItems,
  caseItems,
  caseGroupItems,
  periodItems,
  currencyItems,
  ledgerItems,
} from "@/data/mockData";

const useStyles = makeStyles({
  toolbar: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("0px"),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.borderWidth("1px"),
    ...shorthands.borderStyle("solid"),
    ...shorthands.borderColor(tokens.colorNeutralStroke2),
    ...shorthands.overflow("hidden"),
  },
  toolbarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    ...shorthands.padding("8px", "12px"),
    backgroundColor: tokens.colorNeutralBackground3,
    cursor: "pointer",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground3Hover,
    },
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    ...shorthands.gap("8px"),
  },
  headerLabel: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground1,
  },
  summaryChips: {
    display: "flex",
    flexWrap: "wrap",
    ...shorthands.gap("4px"),
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    ...shorthands.padding("1px", "6px"),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    backgroundColor: tokens.colorNeutralBackground4,
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground2,
    maxWidth: "140px",
    overflowX: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  fieldsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    ...shorthands.gap("8px"),
    ...shorthands.padding("10px", "12px"),
  },
  overflowRow: {
    display: "flex",
    ...shorthands.gap("8px"),
    ...shorthands.padding("0px", "12px", "10px"),
  },
  fieldWrapper: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("3px"),
    minWidth: "0",
  },
  fieldLabel: {
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  overflowButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...shorthands.padding("4px", "8px"),
    ...shorthands.borderWidth("1px"),
    ...shorthands.borderStyle("solid"),
    ...shorthands.borderColor(tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: "pointer",
    minHeight: "30px",
    minWidth: "36px",
    color: tokens.colorNeutralForeground2,
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  overflowPanel: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    ...shorthands.gap("8px"),
    ...shorthands.padding("0px", "12px", "10px"),
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: tokens.colorNeutralStroke2,
    paddingTop: "10px",
  },
  collapsed: {
    display: "none",
  },
  chevronIcon: {
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
  },
  tooltipContent: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("2px"),
  },
});

export function SelectionToolbar() {
  const styles = useStyles();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showOverflow, setShowOverflow] = useState(false);

  // Selection state
  const [selectedPeriod, setSelectedPeriod] = useState<SimpleItem | null>(null);
  const [selectedCase, setSelectedCase] = useState<TabbedItem | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<TabbedItem | null>(null);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<TabbedItem | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<SimpleItem | null>(null);
  const [selectedLedger, setSelectedLedger] = useState<SimpleItem | null>(null);

  const summaryItems = [
    selectedPeriod && `${selectedPeriod.code}`,
    selectedCase && selectedCase.name,
    selectedEntity && selectedEntity.name,
    selectedJurisdiction && selectedJurisdiction.name,
    selectedCurrency && selectedCurrency.code,
    selectedLedger && selectedLedger.code,
  ].filter(Boolean) as string[];

  const tooltipLines = [
    `Period: ${selectedPeriod?.code ?? "—"}`,
    `Case: ${selectedCase?.name ?? "—"}`,
    `Entity: ${selectedEntity?.name ?? "—"}`,
    `Jurisdiction: ${selectedJurisdiction?.name ?? "—"}`,
    `Currency: ${selectedCurrency ? `${selectedCurrency.code} ${selectedCurrency.description}` : "—"}`,
    `Ledger: ${selectedLedger ? `${selectedLedger.code} ${selectedLedger.description}` : "—"}`,
  ];

  const headerContent = (
    <div className={styles.toolbarHeader} onClick={() => setIsExpanded(!isExpanded)}>
      <div className={styles.headerLeft}>
        <Text className={styles.headerLabel}>Selections</Text>
        {!isExpanded && summaryItems.length > 0 && (
          <div className={styles.summaryChips}>
            {summaryItems.map((label, i) => (
              <span key={i} className={styles.chip}>{label}</span>
            ))}
          </div>
        )}
        {!isExpanded && summaryItems.length === 0 && (
          <Text size={200} style={{ color: tokens.colorNeutralForeground4 }}>No selections</Text>
        )}
      </div>
      {isExpanded
        ? <ChevronUpRegular fontSize={16} className={styles.chevronIcon} />
        : <ChevronDownRegular fontSize={16} className={styles.chevronIcon} />
      }
    </div>
  );

  return (
    <div className={styles.toolbar}>
      {!isExpanded ? (
        <Tooltip
          content={
            <div className={styles.tooltipContent}>
              {tooltipLines.map((line, i) => (
                <Text key={i} size={200}>{line}</Text>
              ))}
            </div>
          }
          relationship="description"
          positioning="below"
        >
          {headerContent}
        </Tooltip>
      ) : (
        headerContent
      )}

      <div className={mergeClasses(!isExpanded && styles.collapsed)}>
        {/* Primary fields: Period, Case, Entity, Jurisdiction */}
        <div className={styles.fieldsGrid}>
          <div className={styles.fieldWrapper}>
            <Text className={styles.fieldLabel}>Period</Text>
            <SimpleSearchDropdown
              items={periodItems}
              placeholder="Tax year…"
              selectedItem={selectedPeriod}
              onSelect={setSelectedPeriod}
              onClear={() => setSelectedPeriod(null)}
            />
          </div>

          <div className={styles.fieldWrapper}>
            <Text className={styles.fieldLabel}>Case</Text>
            <TabbedSearchDropdown
              tabs={[
                { value: "cases", label: "Cases", icon: "entity", items: caseItems },
                { value: "caseGroups", label: "Case Groups", icon: "group", items: caseGroupItems },
              ]}
              placeholder="Case…"
              selectedItem={selectedCase}
              onSelect={setSelectedCase}
              onClear={() => setSelectedCase(null)}
            />
          </div>

          <div className={styles.fieldWrapper}>
            <Text className={styles.fieldLabel}>Entity</Text>
            <TabbedSearchDropdown
              tabs={[
                { value: "entities", label: "Entities", icon: "entity", items: entityItems },
                { value: "entityGroups", label: "Entity Groups", icon: "group", items: entityGroupItems },
              ]}
              placeholder="Entity…"
              selectedItem={selectedEntity}
              onSelect={setSelectedEntity}
              onClear={() => setSelectedEntity(null)}
            />
          </div>

          <div className={styles.fieldWrapper}>
            <Text className={styles.fieldLabel}>Jurisdiction</Text>
            <TabbedSearchDropdown
              tabs={[
                { value: "jurisdictions", label: "Jurisdictions", icon: "entity", items: allJurisdictionItems },
                { value: "jurisdictionGroups", label: "Jurisdiction Groups", icon: "group", items: jurisdictionGroupItems },
              ]}
              placeholder="Jurisdiction…"
              selectedItem={selectedJurisdiction}
              onSelect={setSelectedJurisdiction}
              onClear={() => setSelectedJurisdiction(null)}
            />
          </div>
        </div>

        {/* Overflow toggle */}
        <div className={styles.overflowRow}>
          <button
            className={styles.overflowButton}
            onClick={() => setShowOverflow(!showOverflow)}
            aria-label="More fields"
            type="button"
          >
            <MoreHorizontalRegular fontSize={16} />
            <Text size={200} style={{ marginLeft: "4px" }}>
              {showOverflow ? "Less" : "More"}
            </Text>
          </button>
        </div>

        {/* Overflow fields: Currency, Ledger */}
        {showOverflow && (
          <div className={styles.overflowPanel}>
            <div className={styles.fieldWrapper}>
              <Text className={styles.fieldLabel}>Currency</Text>
              <SimpleSearchDropdown
                items={currencyItems}
                placeholder="Currency…"
                selectedItem={selectedCurrency}
                onSelect={setSelectedCurrency}
                onClear={() => setSelectedCurrency(null)}
              />
            </div>

            <div className={styles.fieldWrapper}>
              <Text className={styles.fieldLabel}>Ledger</Text>
              <SimpleSearchDropdown
                items={ledgerItems}
                placeholder="Ledger…"
                selectedItem={selectedLedger}
                onSelect={setSelectedLedger}
                onClear={() => setSelectedLedger(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
