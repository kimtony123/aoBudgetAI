import { Menu } from "semantic-ui-react";
import { useNavigation } from "../hooks/useNavigation";
import { useConnection } from "@arweave-wallet-kit/react";

import WalletConnector from "./walletConnector";

const Navbar: React.FC = () => {
  const handleClick = useNavigation();

  const { connected } = useConnection(); // Check if wallet is connected

  console.log(connected);
  return (
    <Menu size="large" icon="labeled">
      <Menu.Item name="" onClick={handleClick("/")}>
        <img
          alt="logo"
          src="https://lh3.googleusercontent.com/a/ACg8ocKbOvrq_51AjM7Uo5JbljGP9HO_aVgmIsdjTMllM-S682TXFGpl=s216-c-no"
        />
      </Menu.Item>
      <Menu.Item name="Dashboard" onClick={handleClick("/trackerdashboard")} />
      <Menu.Item name="Transactions" onClick={handleClick("/transactions")} />
      <Menu.Item name="Manage" onClick={handleClick("/manage")} />

      <Menu.Menu position="right">
        <Menu.Item name="AI" onClick={handleClick("/getAIAnalysis")} />
        <Menu.Item name="My Agent" onClick={handleClick("/agents")} />
        <Menu.Item>
          <WalletConnector />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default Navbar;
