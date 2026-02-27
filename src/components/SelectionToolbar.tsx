import { useState } from "react";
import {
  makeStyles,
  shorthands,
  tokens,
  Tooltip,
  Text,
} from "@fluentui/react-components";
import {
  ChevronLeftRegular,
  ChevronRightRegular,
  CalendarRegular,
  GavelRegular,
  BuildingRegular,
  GlobeRegular,
  CurrencyDollarEuroRegular,
  BookRegular,
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
    alignItems: "center",
    ...shorthands.gap("0px"),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.borderWidth("1px"),
    ...shorthands.borderStyle("solid"),
    ...shorthands.borderColor(tokens.colorNeutralStroke2),
    position: "relative",
    ...shorthands.overflow("visible"),
  },
  toggleButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...shorthands.padding("0px", "6px"),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderWidth("0"),
    borderRightWidth: "1px",
    borderRightStyle: "solid",
    borderRightColor: tokens.colorNeutralStroke2,
    cursor: "pointer",
    color: tokens.colorNeutralForeground3,
    alignSelf: "stretch",
    minWidth: "28px",
    flexShrink: 0,
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground3Hover,
    },
  },
  fieldsRow: {
    display: "flex",
    alignItems: "center",
    ...shorthands.gap("6px"),
    ...shorthands.padding("6px", "10px"),
    flexWrap: "nowrap",
    flexGrow: 1,
    minWidth: 0,
  },
  fieldWrapper: {
    display: "flex",
    alignItems: "center",
    ...shorthands.gap("4px"),
    minWidth: "120px",
    flexShrink: 1,
    flexGrow: 1,
    maxWidth: "220px",
  },
  fieldIcon: {
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
  },
  overflowButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...shorthands.padding("4px", "6px"),
    ...shorthands.borderWidth("1px"),
    ...shorthands.borderStyle("solid"),
    ...shorthands.borderColor(tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: "pointer",
    color: tokens.colorNeutralForeground2,
    flexShrink: 0,
    minHeight: "30px",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  overflowActive: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
    ...shorthands.borderColor(tokens.colorBrandStroke1),
  },
  collapsedChips: {
    display: "flex",
    alignItems: "center",
    ...shorthands.gap("4px"),
    ...shorthands.padding("6px", "10px"),
    flexGrow: 1,
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    ...shorthands.padding("1px", "6px"),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    backgroundColor: tokens.colorNeutralBackground4,
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground2,
    maxWidth: "120px",
    overflowX: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  noSelections: {
    color: tokens.colorNeutralForeground4,
    fontSize: tokens.fontSizeBase200,
    ...shorthands.padding("6px", "10px"),
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

  const [selectedPeriod, setSelectedPeriod] = useState<SimpleItem | null>(null);
  const [selectedCase, setSelectedCase] = useState<TabbedItem | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<TabbedItem | null>(null);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<TabbedItem | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<SimpleItem | null>(null);
  const [selectedLedger, setSelectedLedger] = useState<SimpleItem | null>(null);

  const summaryItems = [
    selectedPeriod && selectedPeriod.code,
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

  const collapsedContent = (
    <div className={styles.collapsedChips}>
      {summaryItems.length > 0 ? (
        summaryItems.map((label, i) => (
          <span key={i} className={styles.chip}>{label}</span>
        ))
      ) : (
        <Text className={styles.noSelections}>No selections</Text>
      )}
    </div>
  );

  return (
    <div className={styles.toolbar}>
      {/* Left toggle */}
      <button
        className={styles.toggleButton}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? "Collapse toolbar" : "Expand toolbar"}
        type="button"
      >
        {isExpanded
          ? <ChevronLeftRegular fontSize={16} />
          : <ChevronRightRegular fontSize={16} />
        }
      </button>

      {isExpanded ? (
        <div className={styles.fieldsRow}>
          {/* Period */}
          <div className={styles.fieldWrapper}>
            <Tooltip content="Period" relationship="label">
              <span className={styles.fieldIcon}><CalendarRegular fontSize={16} /></span>
            </Tooltip>
            <SimpleSearchDropdown
              items={periodItems}
              placeholder="Period…"
              selectedItem={selectedPeriod}
              onSelect={setSelectedPeriod}
              onClear={() => setSelectedPeriod(null)}
            />
          </div>

          {/* Case */}
          <div className={styles.fieldWrapper}>
            <Tooltip content="Case" relationship="label">
              <span className={styles.fieldIcon}><GavelRegular fontSize={16} /></span>
            </Tooltip>
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

          {/* Entity */}
          <div className={styles.fieldWrapper}>
            <Tooltip content="Entity" relationship="label">
              <span className={styles.fieldIcon}><BuildingRegular fontSize={16} /></span>
            </Tooltip>
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

          {/* Jurisdiction */}
          <div className={styles.fieldWrapper}>
            <Tooltip content="Jurisdiction" relationship="label">
              <span className={styles.fieldIcon}><GlobeRegular fontSize={16} /></span>
            </Tooltip>
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

          {/* Overflow toggle */}
          <button
            className={`${styles.overflowButton} ${showOverflow ? styles.overflowActive : ""}`}
            onClick={() => setShowOverflow(!showOverflow)}
            aria-label="More fields"
            type="button"
          >
            <MoreHorizontalRegular fontSize={16} />
          </button>

          {/* Overflow fields inline */}
          {showOverflow && (
            <>
              <div className={styles.fieldWrapper}>
                <Tooltip content="Currency" relationship="label">
                  <span className={styles.fieldIcon}><CurrencyDollarEuroRegular fontSize={16} /></span>
                </Tooltip>
                <SimpleSearchDropdown
                  items={currencyItems}
                  placeholder="Currency…"
                  selectedItem={selectedCurrency}
                  onSelect={setSelectedCurrency}
                  onClear={() => setSelectedCurrency(null)}
                />
              </div>

              <div className={styles.fieldWrapper}>
                <Tooltip content="Ledger" relationship="label">
                  <span className={styles.fieldIcon}><BookRegular fontSize={16} /></span>
                </Tooltip>
                <SimpleSearchDropdown
                  items={ledgerItems}
                  placeholder="Ledger…"
                  selectedItem={selectedLedger}
                  onSelect={setSelectedLedger}
                  onClear={() => setSelectedLedger(null)}
                />
              </div>
            </>
          )}
        </div>
      ) : (
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
          {collapsedContent}
        </Tooltip>
      )}
    </div>
  );
}
