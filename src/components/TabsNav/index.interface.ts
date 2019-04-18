export interface IProps {
  tabs: string[];
  onKeyChange: (curentKey: number) => void;
  currentKeyAndChildren: {
    currentKeyFormSuperComponent: number;
    currentChildren: JSX.Element[] | null;
  };
  [key: string]: any;
}