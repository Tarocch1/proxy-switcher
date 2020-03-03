import React, { useEffect } from 'react';
import { Result } from 'antd';
import { useModel } from '@tarocch1/use-model';
import { mainModel } from './models';
import List from './components/List';
import Edit from './components/Edit';

function App() {
  const _mainModel = useModel(mainModel);
  useEffect(() => {
    _mainModel.getControllableByThisExtension();
  }, []);
  return _mainModel.init ? (
    <React.Fragment>
      {!_mainModel.controllableByThisExtension && (
        <Result status="warning" subTitle={chrome.i18n.getMessage('controlled_by_other_extensions')} />
      )}
      {_mainModel.controllableByThisExtension && _mainModel.showMode === 'list' && <List />}
      {_mainModel.controllableByThisExtension && _mainModel.showMode === 'edit' && <Edit />}
    </React.Fragment>
  ) : (
    <React.Fragment />
  );
}

export default App;
