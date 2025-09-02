import { useNavigate } from "react-router-dom";

export const useNavigation = () => {
  const navigate = useNavigate();
  const createClickHandler = (path: string) => () => {
    navigate(path);
  };
  return createClickHandler;
};
