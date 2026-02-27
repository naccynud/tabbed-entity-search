import {
  FluentProvider,
  webLightTheme,
  makeStyles,
  tokens,
  Title1,
  Text,
  shorthands,
} from "@fluentui/react-components";
import { SelectionToolbar } from "@/components/SelectionToolbar";

const useStyles = makeStyles({
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    ...shorthands.padding("40px", "20px"),
    backgroundColor: tokens.colorNeutralBackground2,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("16px"),
    width: "100%",
    maxWidth: "900px",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("4px"),
  },
});

const Index = () => {
  const styles = useStyles();

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <Title1>Tax Workbench</Title1>
            <Text size={300} style={{ color: tokens.colorNeutralForeground3 }}>
              Select context parameters for your analysis
            </Text>
          </div>
          <SelectionToolbar />
        </div>
      </div>
    </FluentProvider>
  );
};

export default Index;
