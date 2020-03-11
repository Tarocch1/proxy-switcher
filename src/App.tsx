import React, { useEffect } from 'react';
import { Alert } from 'antd';
import { useModel } from '@tarocch1/use-model';
import { MainModel } from './models';
import List from './components/List';
import Edit from './components/Edit';

function App() {
  const mainModel = useModel(MainModel);
  useEffect(() => {
    mainModel.getControllableByThisExtension();
  }, []);
  return mainModel.init ? (
    <React.Fragment>
      {!mainModel.controllableByThisExtension && (
        <Alert message={chrome.i18n.getMessage('controlled_by_other_extensions')} banner showIcon={false} />
      )}
      {mainModel.showMode === 'list' && <List />}
      {mainModel.showMode === 'edit' && <Edit />}
    </React.Fragment>
  ) : (
    <React.Fragment />
  );
}

export default App;
