import {
  FluentProvider,
  webLightTheme,
  makeStyles,
  tokens,
  Title1,
  Text,
  shorthands,
} from "@fluentui/react-components";
import { SearchableDropdown } from "@/components/SearchableDropdown";

const useStyles = makeStyles({
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    ...shorthands.padding("40px", "20px"),
    backgroundColor: tokens.colorNeutralBackground2,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
    maxWidth: "520px",
    ...shorthands.padding("32px"),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    boxShadow: tokens.shadow8,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginBottom: "8px",
  },
});

const Index = () => {
  const styles = useStyles();

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.header}>
            <Title1>Entity Picker</Title1>
            <Text size={300} style={{ color: tokens.colorNeutralForeground3 }}>
              Search and select from 1,000 entities or 1,000 entity groups
            </Text>
          </div>
          <SearchableDropdown />
        </div>
      </div>
    </FluentProvider>
  );
};

export default Index;
