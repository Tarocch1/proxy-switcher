import React from 'react';
import { useModel } from '@tarocch1/use-model';
import { mainModel } from './models';
import List from './components/List';

function App() {
  const _mainModel = useModel(mainModel);
  return <React.Fragment>{_mainModel.showMode === 'list' && <List />}</React.Fragment>;
}

export default App;
