import { Form } from 'antd';
import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { defaultChainId } from '../../../../Config/AppConfig';
import { SAMPLE_TOKEN } from '../../../../Constants';
import { APP } from '../../../../Constants/AppConstants';
import AuthContext from '../../../../Context/AuthContext';
import { RootState } from '../../../../Store';
import { getDefaultToken } from '../../../../Utils/AppUtils';
import { parseJsonString } from '../../../../Utils/GeneralUtils';
import { DCA_FORM_FIELD, SECONDARY_TOKEN } from '../Constants';
import { getFormValues, setFormValues } from '../Utils/FormUtils';

function initDCAForm() {
  const [form] = Form.useForm();
  const { chainId: currentChainId } = useContext(AuthContext);
  const chainId = currentChainId || defaultChainId;
  const isApproved = false;
  const defualtFromToken = getDefaultToken(APP.dca, chainId);
  const defualtToToken = SECONDARY_TOKEN[chainId];
  const { walletTokenList, tokenList } = useSelector(
    (state: RootState) => state.common,
  );

  const fromTokens =
    walletTokenList.length > 0 ? walletTokenList : [defualtFromToken];
  const toTokens = tokenList.length > 0 ? tokenList : [defualtToToken];

  const defaultSelect = {
    from:
      fromTokens.find((item) => item.contract === defualtFromToken.contract) ||
      null,
    to:
      toTokens.find((item) => item.contract === defualtToToken.contract) ||
      null,
  };

  useEffect(() => {
    if (defaultSelect.from) {
      setFormValues(
        form,
        DCA_FORM_FIELD.fromToken,
        JSON.stringify(defaultSelect.from),
      );
    }
  }, [defaultSelect.from]);

  const currentFromToken =
    parseJsonString(Form.useWatch(DCA_FORM_FIELD.fromToken, form)) ||
    SAMPLE_TOKEN;

  const swapToken = () => {
    const fromToken = parseJsonString(
      getFormValues(form, DCA_FORM_FIELD.fromToken),
    );
    const toToken = parseJsonString(
      getFormValues(form, DCA_FORM_FIELD.toToken),
    );
    if (fromToken) {
      const newFromToken = fromTokens.find(
        (item) => item.contract === toToken.contract,
      );
      setFormValues(
        form,
        DCA_FORM_FIELD.fromToken,
        JSON.stringify(newFromToken),
      );
    }
    if (toToken) {
      const newToToken = toTokens.find(
        (item) => item.contract === fromToken.contract,
      );
      setFormValues(form, DCA_FORM_FIELD.toToken, JSON.stringify(newToToken));
    }
  };
  return {
    fromTokens,
    toTokens,
    form,
    defaultSelect,
    currentFromToken,
    isApproved,
    swapToken,
  };
}
export default initDCAForm;
